package com.dayflow.dto;

import com.dayflow.entity.Attendance;
import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceDTOs {

    public static class AttendanceRecordDTO {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private LocalDate date;
        private LocalTime checkInTime;
        private LocalTime checkOutTime;
        private Double workHours;
        private Attendance.AttendanceStatus status;

        public AttendanceRecordDTO() {}

        public AttendanceRecordDTO(Long id, Long employeeId, String employeeName, LocalDate date, LocalTime checkInTime, LocalTime checkOutTime, Double workHours, Attendance.AttendanceStatus status) {
            this.id = id;
            this.employeeId = employeeId;
            this.employeeName = employeeName;
            this.date = date;
            this.checkInTime = checkInTime;
            this.checkOutTime = checkOutTime;
            this.workHours = workHours;
            this.status = status;
        }

        public Long getId() { return id; }
        public Long getEmployeeId() { return employeeId; }
        public String getEmployeeName() { return employeeName; }
        public LocalDate getDate() { return date; }
        public LocalTime getCheckInTime() { return checkInTime; }
        public LocalTime getCheckOutTime() { return checkOutTime; }
        public Double getWorkHours() { return workHours; }
        public Attendance.AttendanceStatus getStatus() { return status; }
    }
}
