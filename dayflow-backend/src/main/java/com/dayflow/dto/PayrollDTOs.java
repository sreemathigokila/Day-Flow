package com.dayflow.dto;

import com.dayflow.entity.Payroll;
import java.time.LocalDate;

public class PayrollDTOs {

    public static class PayrollRecordDTO {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private Integer month;
        private Integer year;
        private Double basicSalary;
        private Double allowances;
        private Double deductions;
        private Double netSalary;
        private Payroll.PaymentStatus status;
        private LocalDate paymentDate;

        public PayrollRecordDTO(Long id, Long employeeId, String employeeName, Integer month, Integer year, Double basicSalary, Double allowances, Double deductions, Double netSalary, Payroll.PaymentStatus status, LocalDate paymentDate) {
            this.id = id;
            this.employeeId = employeeId;
            this.employeeName = employeeName;
            this.month = month;
            this.year = year;
            this.basicSalary = basicSalary;
            this.allowances = allowances;
            this.deductions = deductions;
            this.netSalary = netSalary;
            this.status = status;
            this.paymentDate = paymentDate;
        }

        public Long getId() { return id; }
        public Long getEmployeeId() { return employeeId; }
        public String getEmployeeName() { return employeeName; }
        public Integer getMonth() { return month; }
        public Integer getYear() { return year; }
        public Double getBasicSalary() { return basicSalary; }
        public Double getAllowances() { return allowances; }
        public Double getDeductions() { return deductions; }
        public Double getNetSalary() { return netSalary; }
        public Payroll.PaymentStatus getStatus() { return status; }
        public LocalDate getPaymentDate() { return paymentDate; }
    }
}
