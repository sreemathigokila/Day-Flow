package com.dayflow.dto;

import java.util.Map;

public class DashboardDTOs {

    public static class AdminDashboardDTO {
        private long totalHrUsers;
        private long totalEmployees;
        private long activeHrUsers;
        private long presentToday;
        private long pendingLeaves;
        private Map<String, Long> employeesByDepartment;

        public AdminDashboardDTO(long totalHrUsers, long totalEmployees, long activeHrUsers, long presentToday, long pendingLeaves, Map<String, Long> employeesByDepartment) {
            this.totalHrUsers = totalHrUsers;
            this.totalEmployees = totalEmployees;
            this.activeHrUsers = activeHrUsers;
            this.presentToday = presentToday;
            this.pendingLeaves = pendingLeaves;
            this.employeesByDepartment = employeesByDepartment;
        }

        public long getTotalHrUsers() { return totalHrUsers; }
        public long getTotalEmployees() { return totalEmployees; }
        public long getActiveHrUsers() { return activeHrUsers; }
        public long getPresentToday() { return presentToday; }
        public long getPendingLeaves() { return pendingLeaves; }
        public Map<String, Long> getEmployeesByDepartment() { return employeesByDepartment; }
    }

    public static class HrDashboardDTO {
        private long assignedEmployeeCount;
        private long presentToday;
        private long absentToday;
        private long onLeaveToday;
        private long pendingLeaveRequests;

        public HrDashboardDTO(long assignedEmployeeCount, long presentToday, long absentToday, long onLeaveToday, long pendingLeaveRequests) {
            this.assignedEmployeeCount = assignedEmployeeCount;
            this.presentToday = presentToday;
            this.absentToday = absentToday;
            this.onLeaveToday = onLeaveToday;
            this.pendingLeaveRequests = pendingLeaveRequests;
        }

        public long getAssignedEmployeeCount() { return assignedEmployeeCount; }
        public long getPresentToday() { return presentToday; }
        public long getAbsentToday() { return absentToday; }
        public long getOnLeaveToday() { return onLeaveToday; }
        public long getPendingLeaveRequests() { return pendingLeaveRequests; }
    }

    public static class EmployeeDashboardDTO {
        private EmployeeDTOs.EmployeeResponse profile;
        private AttendanceDTOs.AttendanceRecordDTO todayAttendance;
        private LeaveDTOs.LeaveBalanceDTO leaveBalance;
        private Double recentNetSalary;
        private long unreadNotifications;

        public EmployeeDashboardDTO(EmployeeDTOs.EmployeeResponse profile, AttendanceDTOs.AttendanceRecordDTO todayAttendance, LeaveDTOs.LeaveBalanceDTO leaveBalance, Double recentNetSalary, long unreadNotifications) {
            this.profile = profile;
            this.todayAttendance = todayAttendance;
            this.leaveBalance = leaveBalance;
            this.recentNetSalary = recentNetSalary;
            this.unreadNotifications = unreadNotifications;
        }

        public EmployeeDTOs.EmployeeResponse getProfile() { return profile; }
        public AttendanceDTOs.AttendanceRecordDTO getTodayAttendance() { return todayAttendance; }
        public LeaveDTOs.LeaveBalanceDTO getLeaveBalance() { return leaveBalance; }
        public Double getRecentNetSalary() { return recentNetSalary; }
        public long getUnreadNotifications() { return unreadNotifications; }
    }
}
