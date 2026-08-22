package com.dayflow.controller;

import com.dayflow.dto.*;
import com.dayflow.exception.AccessDeniedCustomException;
import com.dayflow.security.SecurityUtils;
import com.dayflow.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    private Long getAuthenticatedEmployeeId() {
        Long employeeId = SecurityUtils.getCurrentEmployeeId();
        if (employeeId == null) {
            throw new AccessDeniedCustomException("Access Denied: Current user is not a valid Employee profile.");
        }
        return employeeId;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTOs.EmployeeDashboardDTO> getDashboard() {
        return ResponseEntity.ok(employeeService.getEmployeeDashboardData(getAuthenticatedEmployeeId()));
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployeeDTOs.EmployeeResponse> getProfile() {
        return ResponseEntity.ok(employeeService.getEmployeeProfile(getAuthenticatedEmployeeId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<EmployeeDTOs.EmployeeResponse> updateProfile(@RequestBody EmployeeDTOs.UpdateProfileRequest request) {
        return ResponseEntity.ok(employeeService.updateProfile(getAuthenticatedEmployeeId(), request));
    }

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceDTOs.AttendanceRecordDTO> checkIn() {
        return ResponseEntity.ok(employeeService.checkIn(getAuthenticatedEmployeeId()));
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceDTOs.AttendanceRecordDTO> checkOut() {
        return ResponseEntity.ok(employeeService.checkOut(getAuthenticatedEmployeeId()));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDTOs.AttendanceRecordDTO>> getAttendanceHistory() {
        return ResponseEntity.ok(employeeService.getAttendanceHistory(getAuthenticatedEmployeeId()));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveDTOs.LeaveRequestDTO>> getLeaveRequests() {
        return ResponseEntity.ok(employeeService.getLeaveRequests(getAuthenticatedEmployeeId()));
    }

    @PostMapping("/leaves")
    public ResponseEntity<LeaveDTOs.LeaveRequestDTO> applyLeave(@RequestBody LeaveDTOs.ApplyLeaveRequest request) {
        return ResponseEntity.ok(employeeService.applyLeave(getAuthenticatedEmployeeId(), request));
    }

    @GetMapping("/leaves/balance")
    public ResponseEntity<LeaveDTOs.LeaveBalanceDTO> getLeaveBalance() {
        return ResponseEntity.ok(employeeService.getLeaveBalance(getAuthenticatedEmployeeId()));
    }

    @GetMapping("/payroll")
    public ResponseEntity<List<PayrollDTOs.PayrollRecordDTO>> getPayrollSummary() {
        return ResponseEntity.ok(employeeService.getPayrollSummary(getAuthenticatedEmployeeId()));
    }
}
