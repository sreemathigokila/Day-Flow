package com.dayflow.service;

import com.dayflow.dto.AuthDTOs;
import com.dayflow.entity.Employee;
import com.dayflow.entity.HR;
import com.dayflow.entity.Role;
import com.dayflow.entity.User;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.HrRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final HrRepository hrRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private static class OtpData {
        String code;
        LocalDateTime expiresAt;

        OtpData(String code, LocalDateTime expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
        }
    }

    public AuthService(UserRepository userRepository, EmployeeRepository employeeRepository, HrRepository hrRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.hrRepository = hrRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthDTOs.LoginResponse login(AuthDTOs.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Long hrId = null;
        Long employeeId = null;
        String name = user.getEmail();

        if (user.getRole() == Role.ROLE_HR) {
            Optional<HR> hrOpt = hrRepository.findByUserId(user.getId());
            if (hrOpt.isPresent()) {
                hrId = hrOpt.get().getId();
                name = hrOpt.get().getName();
            }
        } else if (user.getRole() == Role.ROLE_EMPLOYEE) {
            Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());
            if (empOpt.isPresent()) {
                employeeId = empOpt.get().getId();
                name = empOpt.get().getName();
                if (empOpt.get().getHr() != null) {
                    hrId = empOpt.get().getHr().getId();
                }
            }
        } else if (user.getRole() == Role.ROLE_ADMIN) {
            name = "System Admin";
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId(), hrId, employeeId);

        return new AuthDTOs.LoginResponse(token, user.getId(), user.getRole().name(), hrId, employeeId, name);
    }

    public AuthDTOs.SendOtpResponse sendRegistrationOtp(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered. Please sign in.");
        }

        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        otpStorage.put(email.toLowerCase().trim(), new OtpData(otpCode, expiresAt));

        System.out.println("==========================================");
        System.out.println("DAYFLOW EMAIL VERIFICATION OTP FOR " + email + ": " + otpCode);
        System.out.println("==========================================");

        return new AuthDTOs.SendOtpResponse("Verification OTP code sent to " + email + ". Please check your inbox.", otpCode);
    }

    @Transactional
    public String registerEmployee(AuthDTOs.RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        OtpData storedOtp = otpStorage.get(email);
        if (storedOtp == null || !storedOtp.code.equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP code. Please enter the valid 6-digit OTP code sent to your email.");
        }

        if (storedOtp.expiresAt.isBefore(LocalDateTime.now())) {
            otpStorage.remove(email);
            throw new IllegalArgumentException("OTP code has expired. Please request a new OTP code.");
        }

        otpStorage.remove(email);

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                Role.ROLE_EMPLOYEE
        );
        userRepository.save(user);

        List<HR> hrList = hrRepository.findAll();
        HR assignedHr = hrList.isEmpty() ? null : hrList.get(0);

        Employee employee = new Employee();
        employee.setUser(user);
        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setJobTitle(request.getJobTitle());
        employee.setAddress(request.getAddress());
        employee.setBaseSalary(request.getBaseSalary() != null ? request.getBaseSalary() : 65000.0);
        employee.setHr(assignedHr);

        employeeRepository.save(employee);

        return "Registration successful and email verified! You can now log in.";
    }
}
