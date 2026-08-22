package com.dayflow.dto;

public class HrDTOs {

    public static class CreateHrRequest {
        private String email;
        private String password;
        private String name;
        private String phone;
        private String department;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }

    public static class HrResponse {
        private Long id;
        private Long userId;
        private String name;
        private String email;
        private String phone;
        private String department;
        private boolean active;
        private long assignedEmployeeCount;

        public HrResponse(Long id, Long userId, String name, String email, String phone, String department, boolean active, long assignedEmployeeCount) {
            this.id = id;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.department = department;
            this.active = active;
            this.assignedEmployeeCount = assignedEmployeeCount;
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getDepartment() { return department; }
        public boolean isActive() { return active; }
        public long getAssignedEmployeeCount() { return assignedEmployeeCount; }
    }

    public static class EmployeeAssignmentRequest {
        private Long employeeId;
        private Long hrId;

        public Long getEmployeeId() { return employeeId; }
        public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
        public Long getHrId() { return hrId; }
        public void setHrId(Long hrId) { this.hrId = hrId; }
    }
}
