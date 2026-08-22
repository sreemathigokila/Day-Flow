package com.dayflow.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hr_id")
    private HR hr;

    @Column(nullable = false)
    private String name;

    private String phone;
    private String address;
    private String profilePicture;
    private String department;
    private String jobTitle;
    private Double baseSalary;
    private LocalDate joiningDate = LocalDate.now();

    public Employee() {}

    public Employee(User user, HR hr, String name, String phone, String address, String department, String jobTitle, Double baseSalary) {
        this.user = user;
        this.hr = hr;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.department = department;
        this.jobTitle = jobTitle;
        this.baseSalary = baseSalary;
        this.joiningDate = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public HR getHr() { return hr; }
    public void setHr(HR hr) { this.hr = hr; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
}
