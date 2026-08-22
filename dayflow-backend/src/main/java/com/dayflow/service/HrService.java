package com.dayflow.service;

import com.dayflow.dto.*;
import com.dayflow.entity.*;
import com.dayflow.exception.AccessDeniedCustomException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HrService {

    private final HrRepository hrRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final NotificationService notificationService;

    public HrService(HrRepository hrRepository, EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository, PayrollRepository payrollRepository, NotificationService notificationService) {
        this.hrRepository = hrRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
        this.notificationService = notificationService;
    }

    private void verifyHrEmployeeOwnership(Long hrId, Employee employee) {
        if (employee.getHr() == null || !employee.getHr().getId().equals(hrId)) {
            throw new AccessDeniedCustomException("Access Denied: This employee is not assigned to your HR account.");
        }
    }

    public List<EmployeeDTOs.EmployeeResponse> getAssignedEmployees(Long hrId) {
        return employeeRepository.findByHrId(hrId).stream().map(emp -> new EmployeeDTOs.EmployeeResponse(
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
                hrId,
                emp.getHr() != null ? emp.getHr().getName() : null,
                emp.getUser().isActive()
        )).collect(Collectors.toList());
    }

    public EmployeeDTOs.EmployeeResponse getEmployeeDetailsForHr(Long hrId, Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        verifyHrEmployeeOwnership(hrId, employee);

        return new EmployeeDTOs.EmployeeResponse(
                employee.getId(),
                employee.getUser().getId(),
                employee.getName(),
                employee.getUser().getEmail(),
                employee.getPhone(),
                employee.getAddress(),
                employee.getProfilePicture(),
                employee.getDepartment(),
                employee.getJobTitle(),
                employee.getBaseSalary(),
                employee.getJoiningDate(),
                hrId,
                employee.getHr() != null ? employee.getHr().getName() : null,
                employee.getUser().isActive()
        );
    }

    public List<AttendanceDTOs.AttendanceRecordDTO> getAssignedEmployeesAttendance(Long hrId, LocalDate date) {
        LocalDate searchDate = date != null ? date : LocalDate.now();
        List<Attendance> records = attendanceRepository.findByEmployeeHrIdAndDate(hrId, searchDate);
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

    public List<LeaveDTOs.LeaveRequestDTO> getLeaveRequestsForHr(Long hrId) {
        List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeHrIdOrderByCreatedAtDesc(hrId);
        return requests.stream().map(l -> new LeaveDTOs.LeaveRequestDTO(
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

    @Transactional
    public LeaveDTOs.LeaveRequestDTO processLeaveDecision(Long hrId, Long leaveId, LeaveDTOs.LeaveDecisionRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        verifyHrEmployeeOwnership(hrId, leaveRequest.getEmployee());

        LeaveRequest.LeaveStatus newStatus = LeaveRequest.LeaveStatus.valueOf(request.getStatus().toUpperCase());
        leaveRequest.setStatus(newStatus);
        leaveRequest.setHrComments(request.getComments());
        leaveRequest = leaveRequestRepository.save(leaveRequest);

        // Notify Employee
        notificationService.sendNotification(
                leaveRequest.getEmployee().getUser(),
                "Leave Request " + newStatus.name(),
                "Your leave request from " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate() + " has been " + newStatus.name().toLowerCase() + ". Comments: " + (request.getComments() != null ? request.getComments() : "None"),
                "LEAVE"
        );

        return new LeaveDTOs.LeaveRequestDTO(
                leaveRequest.getId(),
                leaveRequest.getEmployee().getId(),
                leaveRequest.getEmployee().getName(),
                leaveRequest.getLeaveType(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getRemarks(),
                leaveRequest.getStatus(),
                leaveRequest.getHrComments(),
                leaveRequest.getCreatedAt()
        );
    }

    public List<PayrollDTOs.PayrollRecordDTO> getAssignedEmployeesPayroll(Long hrId) {
        List<Payroll> payrolls = payrollRepository.findByEmployeeHrIdOrderByYearDescMonthDesc(hrId);
        return payrolls.stream().map(p -> new PayrollDTOs.PayrollRecordDTO(
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

    public DashboardDTOs.HrDashboardDTO getHrDashboardData(Long hrId) {
        long assignedCount = employeeRepository.countByHrId(hrId);
        LocalDate today = LocalDate.now();
        List<Attendance> todayAttendance = attendanceRepository.findByEmployeeHrIdAndDate(hrId, today);

        long presentToday = todayAttendance.stream().filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT).count();
        long absentToday = todayAttendance.stream().filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT).count();
        long onLeaveToday = todayAttendance.stream().filter(a -> a.getStatus() == Attendance.AttendanceStatus.ON_LEAVE).count();

        long pendingLeaves = leaveRequestRepository.findByEmployeeHrIdAndStatus(hrId, LeaveRequest.LeaveStatus.PENDING).size();

        return new DashboardDTOs.HrDashboardDTO(
                assignedCount,
                presentToday,
                absentToday,
                onLeaveToday,
                pendingLeaves
        );
    }
}
