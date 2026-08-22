package com.dayflow.dto;

public class AuthDTOs {

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private Long userId;
        private String role;
        private Long hrId;
        private Long employeeId;
        private String name;

        public LoginResponse() {}
        public LoginResponse(String token, Long userId, String role, Long hrId, Long employeeId, String name) {
            this.token = token;
            this.userId = userId;
            this.role = role;
            this.hrId = hrId;
            this.employeeId = employeeId;
            this.name = name;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public Long getHrId() { return hrId; }
        public void setHrId(Long hrId) { this.hrId = hrId; }

        public Long getEmployeeId() { return employeeId; }
        public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String department;
        private String jobTitle;
        private String address;
        private Double baseSalary = 65000.0;
        private String otp;

        public RegisterRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getJobTitle() { return jobTitle; }
        public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public Double getBaseSalary() { return baseSalary; }
        public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }

        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class SendOtpRequest {
        private String email;

        public SendOtpRequest() {}
        public SendOtpRequest(String email) { this.email = email; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class SendOtpResponse {
        private String message;
        private String otp; // Provided for easy hackathon demo testing

        public SendOtpResponse() {}
        public SendOtpResponse(String message, String otp) {
            this.message = message;
            this.otp = otp;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }
}
