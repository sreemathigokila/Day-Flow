package com.dayflow.service;

import com.dayflow.dto.DashboardDTOs;
import com.dayflow.dto.EmployeeDTOs;
import com.dayflow.dto.HrDTOs;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.entity.HR;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.entity.Role;
import com.dayflow.entity.User;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final HrRepository hrRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public AdminService(UserRepository userRepository, HrRepository hrRepository, EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository, PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.hrRepository = hrRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Transactional
    public HrDTOs.HrResponse createHr(HrDTOs.CreateHrRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists!");
        }

        User user = new User(request.getEmail(), passwordEncoder.encode(request.getPassword()), Role.ROLE_HR);
        user = userRepository.save(user);

        HR hr = new HR(user, request.getName(), request.getPhone(), request.getDepartment());
        hr = hrRepository.save(hr);

        return new HrDTOs.HrResponse(
                hr.getId(),
                user.getId(),
                hr.getName(),
                user.getEmail(),
                hr.getPhone(),
                hr.getDepartment(),
                user.isActive(),
                0
        );
    }

    public List<HrDTOs.HrResponse> getAllHrs() {
        return hrRepository.findAll().stream().map(hr -> {
            long count = employeeRepository.countByHrId(hr.getId());
            return new HrDTOs.HrResponse(
                    hr.getId(),
                    hr.getUser().getId(),
                    hr.getName(),
                    hr.getUser().getEmail(),
                    hr.getPhone(),
                    hr.getDepartment(),
                    hr.getUser().isActive(),
                    count
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public void toggleHrStatus(Long hrId, boolean active) {
        HR hr = hrRepository.findById(hrId)
                .orElseThrow(() -> new ResourceNotFoundException("HR user not found"));
        User user = hr.getUser();
        user.setActive(active);
        userRepository.save(user);
    }

    @Transactional
    public void assignEmployeeToHr(Long employeeId, Long hrId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        HR hr = hrRepository.findById(hrId)
                .orElseThrow(() -> new ResourceNotFoundException("HR not found"));

        employee.setHr(hr);
        employeeRepository.save(employee);

        notificationService.sendNotification(
                employee.getUser(),
                "HR Assignment Updated",
                "Your responsible HR manager has been set to " + hr.getName(),
                "GENERAL"
        );
    }

    public DashboardDTOs.AdminDashboardDTO getAdminDashboardData() {
        long totalHrUsers = hrRepository.count();
        long totalEmployees = employeeRepository.count();
        long activeHrUsers = hrRepository.findAll().stream().filter(h -> h.getUser().isActive()).count();

        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.findByDate(today).stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();

        long pendingLeaves = leaveRequestRepository.countByStatus(LeaveRequest.LeaveStatus.PENDING);

        Map<String, Long> deptCounts = new HashMap<>();
        employeeRepository.findAll().forEach(emp -> {
            String dept = emp.getDepartment() != null ? emp.getDepartment() : "Unassigned";
            deptCounts.put(dept, deptCounts.getOrDefault(dept, 0L) + 1);
        });

        return new DashboardDTOs.AdminDashboardDTO(
                totalHrUsers,
                totalEmployees,
                activeHrUsers,
                presentToday,
                pendingLeaves,
                deptCounts
        );
    }

    public List<EmployeeDTOs.EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream().map(emp -> new EmployeeDTOs.EmployeeResponse(
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
                emp.getHr() != null ? emp.getHr().getName() : "Unassigned",
                emp.getUser().isActive()
        )).collect(Collectors.toList());
    }
}
