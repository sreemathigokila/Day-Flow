package com.dayflow.service;

import com.dayflow.dto.*;
import com.dayflow.entity.*;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final NotificationService notificationService;

    public EmployeeService(EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository, PayrollRepository payrollRepository, NotificationService notificationService) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
        this.notificationService = notificationService;
    }

    public EmployeeDTOs.EmployeeResponse getEmployeeProfile(Long employeeId) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        return new EmployeeDTOs.EmployeeResponse(
                emp.getId(),
                emp.getUser().getId(),
                emp.getName(),
                emp.getUser().getEmail(),
                emp.getPhone(),
                emp.getAddress(),
                emp.getProfilePicture(),
                emp.getDepartment(),
                emp.getJobTitle(),
                emp.getBaseSalary(),
                emp.getJoiningDate(),
                emp.getHr() != null ? emp.getHr().getId() : null,
                emp.getHr() != null ? emp.getHr().getName() : null,
                emp.getUser().isActive()
        );
    }

    @Transactional
    public EmployeeDTOs.EmployeeResponse updateProfile(Long employeeId, EmployeeDTOs.UpdateProfileRequest request) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        if (request.getPhone() != null) emp.setPhone(request.getPhone());
        if (request.getAddress() != null) emp.setAddress(request.getAddress());
        if (request.getProfilePicture() != null) emp.setProfilePicture(request.getProfilePicture());

        emp = employeeRepository.save(emp);
        return getEmployeeProfile(emp.getId());
    }

    @Transactional
    public AttendanceDTOs.AttendanceRecordDTO checkIn(Long employeeId) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existingOpt = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

        if (existingOpt.isPresent()) {
            throw new BadRequestException("You have already checked in today at " + existingOpt.get().getCheckInTime());
        }

        Attendance attendance = new Attendance(emp, today, LocalTime.now(), Attendance.AttendanceStatus.PRESENT);
        attendance = attendanceRepository.save(attendance);

        return new AttendanceDTOs.AttendanceRecordDTO(
                attendance.getId(),
                emp.getId(),
                emp.getName(),
                attendance.getDate(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                attendance.getWorkHours(),
                attendance.getStatus()
        );
    }

    @Transactional
    public AttendanceDTOs.AttendanceRecordDTO checkOut(Long employeeId) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new BadRequestException("You must check in first before checking out."));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("You have already checked out today at " + attendance.getCheckOutTime());
        }

        LocalTime checkOutTime = LocalTime.now();
        attendance.setCheckOutTime(checkOutTime);

        if (attendance.getCheckInTime() != null) {
            long minutes = Duration.between(attendance.getCheckInTime(), checkOutTime).toMinutes();
            double hours = Math.round((minutes / 60.0) * 10.0) / 10.0;
            attendance.setWorkHours(hours);
        }

        attendance = attendanceRepository.save(attendance);

        return new AttendanceDTOs.AttendanceRecordDTO(
                attendance.getId(),
                emp.getId(),
                emp.getName(),
                attendance.getDate(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                attendance.getWorkHours(),
                attendance.getStatus()
        );
    }

    public List<AttendanceDTOs.AttendanceRecordDTO> getAttendanceHistory(Long employeeId) {
        List<Attendance> records = attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId);
        return records.stream().map(a -> new AttendanceDTOs.AttendanceRecordDTO(
                a.getId(),
                a.getEmployee().getId(),
                a.getEmployee().getName(),
                a.getDate(),
                a.getCheckInTime(),
                a.getCheckOutTime(),
                a.getWorkHours(),
                a.getStatus()
        )).collect(Collectors.toList());
    }

    public AttendanceDTOs.AttendanceRecordDTO getTodayAttendance(Long employeeId) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> attendanceOpt = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        if (attendanceOpt.isEmpty()) {
            return null;
        }
        Attendance a = attendanceOpt.get();
        return new AttendanceDTOs.AttendanceRecordDTO(
                a.getId(),
                a.getEmployee().getId(),
                a.getEmployee().getName(),
                a.getDate(),
                a.getCheckInTime(),
                a.getCheckOutTime(),
                a.getWorkHours(),
                a.getStatus()
        );
    }

    @Transactional
    public LeaveDTOs.LeaveRequestDTO applyLeave(Long employeeId, LeaveDTOs.ApplyLeaveRequest request) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date.");
        }

        LeaveRequest leaveRequest = new LeaveRequest(emp, request.getLeaveType(), request.getStartDate(), request.getEndDate(), request.getRemarks());
        leaveRequest = leaveRequestRepository.save(leaveRequest);

        // Notify assigned HR if any
        if (emp.getHr() != null) {
            notificationService.sendNotification(
                    emp.getHr().getUser(),
                    "New Leave Request Received",
                    emp.getName() + " applied for " + request.getLeaveType() + " leave from " + request.getStartDate() + " to " + request.getEndDate(),
                    "LEAVE"
            );
        }

        return new LeaveDTOs.LeaveRequestDTO(
                leaveRequest.getId(),
                emp.getId(),
                emp.getName(),
                leaveRequest.getLeaveType(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getRemarks(),
                leaveRequest.getStatus(),
                leaveRequest.getHrComments(),
                leaveRequest.getCreatedAt()
        );
    }

    public List<LeaveDTOs.LeaveRequestDTO> getLeaveRequests(Long employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId).stream()
                .map(l -> new LeaveDTOs.LeaveRequestDTO(
                        l.getId(),
                        l.getEmployee().getId(),
                        l.getEmployee().getName(),
                        l.getLeaveType(),
                        l.getStartDate(),
                        l.getEndDate(),
                        l.getRemarks(),
                        l.getStatus(),
                        l.getHrComments(),
                        l.getCreatedAt()
                )).collect(Collectors.toList());
    }

    public LeaveDTOs.LeaveBalanceDTO getLeaveBalance(Long employeeId) {
        List<LeaveRequest> approvedLeaves = leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId).stream()
                .filter(l -> l.getStatus() == LeaveRequest.LeaveStatus.APPROVED)
                .collect(Collectors.toList());

        int paidUsed = 0;
        int sickUsed = 0;
        int unpaidUsed = 0;

        for (LeaveRequest l : approvedLeaves) {
            long days = ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1;
            if (l.getLeaveType() == LeaveRequest.LeaveType.PAID) paidUsed += (int) days;
            else if (l.getLeaveType() == LeaveRequest.LeaveType.SICK) sickUsed += (int) days;
            else if (l.getLeaveType() == LeaveRequest.LeaveType.UNPAID) unpaidUsed += (int) days;
        }

        int totalAllowed = 24; // 24 days per year total policy
        int remaining = Math.max(0, totalAllowed - (paidUsed + sickUsed));

        return new LeaveDTOs.LeaveBalanceDTO(totalAllowed, paidUsed, sickUsed, unpaidUsed, remaining);
    }

    public List<PayrollDTOs.PayrollRecordDTO> getPayrollSummary(Long employeeId) {
        return payrollRepository.findByEmployeeIdOrderByYearDescMonthDesc(employeeId).stream()
                .map(p -> new PayrollDTOs.PayrollRecordDTO(
                        p.getId(),
                        p.getEmployee().getId(),
                        p.getEmployee().getName(),
                        p.getMonth(),
                        p.getYear(),
                        p.getBasicSalary(),
                        p.getAllowances(),
                        p.getDeductions(),
                        p.getNetSalary(),
                        p.getStatus(),
                        p.getPaymentDate()
                )).collect(Collectors.toList());
    }

    public DashboardDTOs.EmployeeDashboardDTO getEmployeeDashboardData(Long employeeId) {
        EmployeeDTOs.EmployeeResponse profile = getEmployeeProfile(employeeId);
        AttendanceDTOs.AttendanceRecordDTO todayAttendance = getTodayAttendance(employeeId);
        LeaveDTOs.LeaveBalanceDTO leaveBalance = getLeaveBalance(employeeId);

        List<PayrollDTOs.PayrollRecordDTO> payrolls = getPayrollSummary(employeeId);
        Double recentNetSalary = !payrolls.isEmpty() ? payrolls.get(0).getNetSalary() : profile.getBaseSalary();

        long unreadNotifs = notificationService.getUnreadCount(profile.getUserId());

        return new DashboardDTOs.EmployeeDashboardDTO(
                profile,
                todayAttendance,
                leaveBalance,
                recentNetSalary,
                unreadNotifs
        );
    }
}
