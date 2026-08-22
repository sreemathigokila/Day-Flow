package com.dayflow.controller;

import com.dayflow.dto.AuthDTOs;
import com.dayflow.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTOs.LoginResponse> login(@RequestBody AuthDTOs.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<AuthDTOs.SendOtpResponse> sendOtp(@RequestBody AuthDTOs.SendOtpRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthDTOs.SendOtpResponse("Please enter a valid email address.", null));
        }
        return ResponseEntity.ok(authService.sendRegistrationOtp(request.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthDTOs.RegisterRequest request) {
        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("OTP verification code is required to complete registration.");
        }
        String result = authService.registerEmployee(request);
        return ResponseEntity.ok(result);
    }
}
