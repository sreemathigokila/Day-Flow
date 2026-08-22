package com.dayflow.dto;

import java.time.LocalDate;

public class EmployeeDTOs {

    public static class EmployeeResponse {
        private Long id;
        private Long userId;
        private String name;
        private String email;
        private String phone;
        private String address;
        private String profilePicture;
        private String department;
        private String jobTitle;
        private Double baseSalary;
        private LocalDate joiningDate;
        private Long hrId;
        private String hrName;
        private boolean active;

        public EmployeeResponse() {}

        public EmployeeResponse(Long id, Long userId, String name, String email, String phone, String address, String profilePicture, String department, String jobTitle, Double baseSalary, LocalDate joiningDate, Long hrId, String hrName, boolean active) {
            this.id = id;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.profilePicture = profilePicture;
            this.department = department;
            this.jobTitle = jobTitle;
            this.baseSalary = baseSalary;
            this.joiningDate = joiningDate;
            this.hrId = hrId;
            this.hrName = hrName;
            this.active = active;
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getAddress() { return address; }
        public String getProfilePicture() { return profilePicture; }
        public String getDepartment() { return department; }
        public String getJobTitle() { return jobTitle; }
        public Double getBaseSalary() { return baseSalary; }
        public LocalDate getJoiningDate() { return joiningDate; }
        public Long getHrId() { return hrId; }
        public String getHrName() { return hrName; }
        public boolean isActive() { return active; }
    }

    public static class UpdateProfileRequest {
        private String phone;
        private String address;
        private String profilePicture;

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    }
}
