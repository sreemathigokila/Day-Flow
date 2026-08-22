package com.dayflow.controller;

import com.dayflow.dto.*;
import com.dayflow.exception.AccessDeniedCustomException;
import com.dayflow.security.SecurityUtils;
import com.dayflow.service.HrService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hr")
@PreAuthorize("hasAuthority('ROLE_HR')")
public class HrController {

    private final HrService hrService;

    public HrController(HrService hrService) {
        this.hrService = hrService;
    }

    private Long getAuthenticatedHrId() {
        Long hrId = SecurityUtils.getCurrentHrId();
        if (hrId == null) {
            throw new AccessDeniedCustomException("Access Denied: Current user is not a valid HR profile.");
        }
        return hrId;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTOs.HrDashboardDTO> getDashboard() {
        return ResponseEntity.ok(hrService.getHrDashboardData(getAuthenticatedHrId()));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDTOs.EmployeeResponse>> getAssignedEmployees() {
        return ResponseEntity.ok(hrService.getAssignedEmployees(getAuthenticatedHrId()));
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDTOs.EmployeeResponse> getEmployeeDetails(@PathVariable Long id) {
        return ResponseEntity.ok(hrService.getEmployeeDetailsForHr(getAuthenticatedHrId(), id));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDTOs.AttendanceRecordDTO>> getAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(hrService.getAssignedEmployeesAttendance(getAuthenticatedHrId(), date));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveDTOs.LeaveRequestDTO>> getLeaveRequests() {
        return ResponseEntity.ok(hrService.getLeaveRequestsForHr(getAuthenticatedHrId()));
    }

    @PutMapping("/leaves/{id}/decision")
    public ResponseEntity<LeaveDTOs.LeaveRequestDTO> processLeaveDecision(
            @PathVariable Long id,
            @RequestBody LeaveDTOs.LeaveDecisionRequest request) {
        return ResponseEntity.ok(hrService.processLeaveDecision(getAuthenticatedHrId(), id, request));
    }

    @GetMapping("/payroll")
    public ResponseEntity<List<PayrollDTOs.PayrollRecordDTO>> getPayroll() {
        return ResponseEntity.ok(hrService.getAssignedEmployeesPayroll(getAuthenticatedHrId()));
    }
}
