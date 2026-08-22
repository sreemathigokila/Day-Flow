package com.dayflow.service.ai;

import com.dayflow.dto.AttendanceDTOs;
import com.dayflow.dto.EmployeeDTOs;
import com.dayflow.dto.LeaveDTOs;
import com.dayflow.dto.PayrollDTOs;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.HRPolicy;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.HRPolicyRepository;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.security.SecurityUtils;
import com.dayflow.service.EmployeeService;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class EmployeeAiTools {

    private final EmployeeService employeeService;
    private final HRPolicyRepository hrPolicyRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public EmployeeAiTools(EmployeeService employeeService, HRPolicyRepository hrPolicyRepository, AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository) {
        this.employeeService = employeeService;
        this.hrPolicyRepository = hrPolicyRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public EmployeeDTOs.EmployeeResponse getMyProfile() {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");
        return employeeService.getEmployeeProfile(empId);
    }

    public List<AttendanceDTOs.AttendanceRecordDTO> getMyAttendance() {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");
        return employeeService.getAttendanceHistory(empId);
    }

    public LeaveDTOs.LeaveBalanceDTO getMyLeaveBalance() {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");
        return employeeService.getLeaveBalance(empId);
    }

    public List<LeaveDTOs.LeaveRequestDTO> getMyLeaveRequests() {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");
        return employeeService.getLeaveRequests(empId);
    }

    public List<PayrollDTOs.PayrollRecordDTO> getMyPayrollSummary() {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");
        return employeeService.getPayrollSummary(empId);
    }

    public List<HRPolicy> getEmployeeAccessiblePolicies() {
        return hrPolicyRepository.findAll();
    }

    public Map<String, Object> getMyHRTimeline() {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");

        EmployeeDTOs.EmployeeResponse profile = employeeService.getEmployeeProfile(empId);
        List<LeaveDTOs.LeaveRequestDTO> leaves = employeeService.getLeaveRequests(empId);
        List<PayrollDTOs.PayrollRecordDTO> payrolls = employeeService.getPayrollSummary(empId);
        List<AttendanceDTOs.AttendanceRecordDTO> attendance = employeeService.getAttendanceHistory(empId);

        List<Map<String, Object>> events = new ArrayList<>();

        // 1. Joining event
        Map<String, Object> e1 = new HashMap<>();
        e1.put("date", profile.getJoiningDate() != null ? profile.getJoiningDate().toString() : "2026-01-01");
        e1.put("title", "Joined Dayflow HRMS");
        e1.put("description", "Onboarded as " + profile.getJobTitle() + " in " + profile.getDepartment() + " Department");
        e1.put("category", "JOINING");
        events.add(e1);

        // 2. Leaves
        for (LeaveDTOs.LeaveRequestDTO l : leaves) {
            Map<String, Object> el = new HashMap<>();
            el.put("date", l.getStartDate().toString());
            el.put("title", l.getLeaveType() + " Leave Request (" + l.getStatus() + ")");
            el.put("description", "From " + l.getStartDate() + " to " + l.getEndDate() + ". Remarks: " + l.getRemarks() + (l.getHrComments() != null ? " | HR: " + l.getHrComments() : ""));
            el.put("category", "LEAVE");
            events.add(el);
        }

        // 3. Payrolls
        for (PayrollDTOs.PayrollRecordDTO p : payrolls) {
            Map<String, Object> ep = new HashMap<>();
            ep.put("date", p.getPaymentDate() != null ? p.getPaymentDate().toString() : p.getYear() + "-" + p.getMonth() + "-28");
            ep.put("title", "Salary Disbursement (" + p.getMonth() + "/" + p.getYear() + ")");
            ep.put("description", "Net salary of $" + p.getNetSalary() + " disbursed via direct bank transfer");
            ep.put("category", "PAYROLL");
            events.add(ep);
        }

        events.sort((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")));

        Map<String, Object> result = new HashMap<>();
        result.put("profile", profile);
        result.put("events", events);
        result.put("totalAttendanceRecords", attendance.size());
        result.put("leaveCount", leaves.size());
        return result;
    }

    public Map<String, Object> explainAttendance() {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");

        List<Attendance> records = attendanceRepository.findByEmployeeIdOrderByDateDesc(empId);

        int totalDays = records.size();
        int presentCount = 0;
        int lateCount = 0;
        int absentCount = 0;
        int halfDayCount = 0;
        int leaveCount = 0;

        for (Attendance a : records) {
            if (a.getStatus() == Attendance.AttendanceStatus.PRESENT) {
                presentCount++;
                if (a.getCheckInTime() != null && a.getCheckInTime().isAfter(java.time.LocalTime.of(9, 15))) {
                    lateCount++;
                }
            } else if (a.getStatus() == Attendance.AttendanceStatus.ABSENT) {
                absentCount++;
            } else if (a.getStatus() == Attendance.AttendanceStatus.HALF_DAY) {
                halfDayCount++;
            } else if (a.getStatus() == Attendance.AttendanceStatus.ON_LEAVE) {
                leaveCount++;
            }
        }

        double percentage = totalDays > 0 ? Math.round(((double) (presentCount) / totalDays) * 100.0) : 100.0;

        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalDays", totalDays);
        analysis.put("presentCount", presentCount);
        analysis.put("lateCount", lateCount);
        analysis.put("absentCount", absentCount);
        analysis.put("halfDayCount", halfDayCount);
        analysis.put("leaveCount", leaveCount);
        analysis.put("attendancePercentage", percentage);

        StringBuilder explanation = new StringBuilder();
        explanation.append("Your current attendance rate is ").append(percentage).append("% across ").append(totalDays).append(" recorded work days.\n");
        if (lateCount > 0) explanation.append("- ").append(lateCount).append(" late check-in(s) recorded past 9:15 AM.\n");
        if (absentCount > 0) explanation.append("- ").append(absentCount).append(" unexcused absence(s).\n");
        if (halfDayCount > 0) explanation.append("- ").append(halfDayCount).append(" half-day shift(s).\n");
        if (leaveCount > 0) explanation.append("- ").append(leaveCount).append(" approved leave day(s).\n");
        if (lateCount == 0 && absentCount == 0 && halfDayCount == 0) {
            explanation.append("Great job! You have an exemplary attendance record with zero late check-ins or absences.");
        }

        analysis.put("explanationText", explanation.toString());
        return analysis;
    }

    public Map<String, Object> explainLeaveDecision(Long leaveId) {
        Long empId = SecurityUtils.getCurrentEmployeeId();
        if (empId == null) throw new IllegalStateException("Unauthenticated employee session");

        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (!request.getEmployee().getId().equals(empId)) {
            throw new IllegalStateException("Access denied: You can only inspect your own leave decisions.");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("leaveId", request.getId());
        res.put("leaveType", request.getLeaveType());
        res.put("startDate", request.getStartDate());
        res.put("endDate", request.getEndDate());
        res.put("status", request.getStatus());
        res.put("remarks", request.getRemarks());
        res.put("hrComments", request.getHrComments());

        String explanation;
        if (request.getStatus() == LeaveRequest.LeaveStatus.REJECTED) {
            if (request.getHrComments() != null && !request.getHrComments().trim().isEmpty()) {
                explanation = "Your " + request.getLeaveType() + " leave request from " + request.getStartDate() + " to " + request.getEndDate() + " was REJECTED by HR with the following comment: \"" + request.getHrComments() + "\".";
            } else {
                explanation = "Your " + request.getLeaveType() + " leave request from " + request.getStartDate() + " to " + request.getEndDate() + " was REJECTED. The system does not contain a recorded reason for this decision. Please contact your assigned HR manager (" + (request.getEmployee().getHr() != null ? request.getEmployee().getHr().getName() : "General HR") + ").";
            }
        } else if (request.getStatus() == LeaveRequest.LeaveStatus.APPROVED) {
            explanation = "Your " + request.getLeaveType() + " leave request from " + request.getStartDate() + " to " + request.getEndDate() + " was APPROVED by HR. Comments: " + (request.getHrComments() != null ? request.getHrComments() : "Standard approval.") + ".";
        } else {
            explanation = "Your leave request is currently PENDING review by your assigned HR manager.";
        }

        res.put("explanationText", explanation);
        return res;
    }
}
