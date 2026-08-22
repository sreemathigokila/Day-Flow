package com.dayflow.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payrolls")
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "pay_month", nullable = false)
    private Integer month;

    @Column(name = "pay_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Double basicSalary;

    private Double allowances = 0.0;
    private Double deductions = 0.0;
    private Double netSalary;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PAID;

    private LocalDate paymentDate;

    public enum PaymentStatus {
        PAID,
        PENDING,
        PROCESSING
    }

    public Payroll() {}

    public Payroll(Employee employee, Integer month, Integer year, Double basicSalary, Double allowances, Double deductions, Double netSalary, PaymentStatus status) {
        this.employee = employee;
        this.month = month;
        this.year = year;
        this.basicSalary = basicSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.netSalary = netSalary;
        this.status = status;
        this.paymentDate = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getBasicSalary() { return basicSalary; }
    public void setBasicSalary(Double basicSalary) { this.basicSalary = basicSalary; }

    public Double getAllowances() { return allowances; }
    public void setAllowances(Double allowances) { this.allowances = allowances; }

    public Double getDeductions() { return deductions; }
    public void setDeductions(Double deductions) { this.deductions = deductions; }

    public Double getNetSalary() { return netSalary; }
    public void setNetSalary(Double netSalary) { this.netSalary = netSalary; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
}
