package com.dayflow.controller;

import com.dayflow.dto.DashboardDTOs;
import com.dayflow.dto.EmployeeDTOs;
import com.dayflow.dto.HrDTOs;
import com.dayflow.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTOs.AdminDashboardDTO> getDashboardData() {
        return ResponseEntity.ok(adminService.getAdminDashboardData());
    }

    @GetMapping("/hr")
    public ResponseEntity<List<HrDTOs.HrResponse>> getAllHrs() {
        return ResponseEntity.ok(adminService.getAllHrs());
    }

    @PostMapping("/hr")
    public ResponseEntity<HrDTOs.HrResponse> createHr(@RequestBody HrDTOs.CreateHrRequest request) {
        return ResponseEntity.ok(adminService.createHr(request));
    }

    @PutMapping("/hr/{id}/status")
    public ResponseEntity<?> toggleHrStatus(@PathVariable Long id, @RequestParam boolean active) {
        adminService.toggleHrStatus(id, active);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assign-employee")
    public ResponseEntity<?> assignEmployee(@RequestBody HrDTOs.EmployeeAssignmentRequest request) {
        adminService.assignEmployeeToHr(request.getEmployeeId(), request.getHrId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDTOs.EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(adminService.getAllEmployees());
    }
}
