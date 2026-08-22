package com.dayflow.dto;

import com.dayflow.entity.LeaveRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveDTOs {

    public static class ApplyLeaveRequest {
        private LeaveRequest.LeaveType leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String remarks;

        public LeaveRequest.LeaveType getLeaveType() { return leaveType; }
        public void setLeaveType(LeaveRequest.LeaveType leaveType) { this.leaveType = leaveType; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }

    public static class LeaveDecisionRequest {
        private String status; // APPROVED or REJECTED
        private String comments;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }

    public static class LeaveRequestDTO {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private LeaveRequest.LeaveType leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String remarks;
        private LeaveRequest.LeaveStatus status;
        private String hrComments;
        private LocalDateTime createdAt;

        public LeaveRequestDTO(Long id, Long employeeId, String employeeName, LeaveRequest.LeaveType leaveType, LocalDate startDate, LocalDate endDate, String remarks, LeaveRequest.LeaveStatus status, String hrComments, LocalDateTime createdAt) {
            this.id = id;
            this.employeeId = employeeId;
            this.employeeName = employeeName;
            this.leaveType = leaveType;
            this.startDate = startDate;
            this.endDate = endDate;
            this.remarks = remarks;
            this.status = status;
            this.hrComments = hrComments;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public Long getEmployeeId() { return employeeId; }
        public String getEmployeeName() { return employeeName; }
        public LeaveRequest.LeaveType getLeaveType() { return leaveType; }
        public LocalDate getStartDate() { return startDate; }
        public LocalDate getEndDate() { return endDate; }
        public String getRemarks() { return remarks; }
        public LeaveRequest.LeaveStatus getStatus() { return status; }
        public String getHrComments() { return hrComments; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    public static class LeaveBalanceDTO {
        private int totalAllowed;
        private int paidLeavesUsed;
        private int sickLeavesUsed;
        private int unpaidLeavesUsed;
        private int remainingLeaves;

        public LeaveBalanceDTO(int totalAllowed, int paidLeavesUsed, int sickLeavesUsed, int unpaidLeavesUsed, int remainingLeaves) {
            this.totalAllowed = totalAllowed;
            this.paidLeavesUsed = paidLeavesUsed;
            this.sickLeavesUsed = sickLeavesUsed;
            this.unpaidLeavesUsed = unpaidLeavesUsed;
            this.remainingLeaves = remainingLeaves;
        }

        public int getTotalAllowed() { return totalAllowed; }
        public int getPaidLeavesUsed() { return paidLeavesUsed; }
        public int getSickLeavesUsed() { return sickLeavesUsed; }
        public int getUnpaidLeavesUsed() { return unpaidLeavesUsed; }
        public int getRemainingLeaves() { return remainingLeaves; }
    }
}
