package com.dayflow.config;

import com.dayflow.entity.*;
import com.dayflow.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HrRepository hrRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final HRPolicyRepository hrPolicyRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, HrRepository hrRepository, EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository, LeaveRequestRepository leaveRequestRepository, PayrollRepository payrollRepository, HRPolicyRepository hrPolicyRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hrRepository = hrRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
        this.hrPolicyRepository = hrPolicyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return; // Already seeded

        System.out.println(">>> Initializing Dayflow HRMS Default Seed Data...");

        // 1. Create ADMIN Account
        User adminUser = new User("admin@dayflow.com", passwordEncoder.encode("Admin@123"), Role.ROLE_ADMIN);
        userRepository.save(adminUser);

        // 2. Create HR Users
        User hrUser1 = new User("hr.sarah@dayflow.com", passwordEncoder.encode("Hr@12345"), Role.ROLE_HR);
        userRepository.save(hrUser1);
        HR hr1 = new HR(hrUser1, "Sarah Jenkins", "+1 (555) 019-2834", "Human Resources");
        hr1 = hrRepository.save(hr1);

        User hrUser2 = new User("hr.david@dayflow.com", passwordEncoder.encode("Hr@12345"), Role.ROLE_HR);
        userRepository.save(hrUser2);
        HR hr2 = new HR(hrUser2, "David Miller", "+1 (555) 018-9921", "Technical HR");
        hr2 = hrRepository.save(hr2);

        // 3. Create Employees
        // Emp 1: Alex Morgan (Assigned to HR 1 Sarah Jenkins)
        User empUser1 = new User("emp.alex@dayflow.com", passwordEncoder.encode("Emp@12345"), Role.ROLE_EMPLOYEE);
        userRepository.save(empUser1);
        Employee emp1 = new Employee(empUser1, hr1, "Alex Morgan", "+1 (555) 012-3456", "742 Evergreen Terrace, Springfield", "Engineering", "Senior Software Engineer", 85000.0);
        emp1.setProfilePicture("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400");
        emp1 = employeeRepository.save(emp1);

        // Emp 2: Priya Sharma (Assigned to HR 1 Sarah Jenkins)
        User empUser2 = new User("emp.priya@dayflow.com", passwordEncoder.encode("Emp@12345"), Role.ROLE_EMPLOYEE);
        userRepository.save(empUser2);
        Employee emp2 = new Employee(empUser2, hr1, "Priya Sharma", "+1 (555) 014-7890", "101 Market Street, San Francisco", "Design", "UI/UX Product Designer", 78000.0);
        emp2.setProfilePicture("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400");
        emp2 = employeeRepository.save(emp2);

        // Emp 3: Marcus Vance (Assigned to HR 2 David Miller)
        User empUser3 = new User("emp.marcus@dayflow.com", passwordEncoder.encode("Emp@12345"), Role.ROLE_EMPLOYEE);
        userRepository.save(empUser3);
        Employee emp3 = new Employee(empUser3, hr2, "Marcus Vance", "+1 (555) 016-5432", "456 Wall Street, New York", "Infrastructure", "DevOps Engineer", 82000.0);
        emp3.setProfilePicture("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400");
        emp3 = employeeRepository.save(emp3);

        // 4. Seed Attendance Records for Alex
        LocalDate today = LocalDate.now();
        Attendance attToday = new Attendance(emp1, today, LocalTime.of(9, 2, 15), Attendance.AttendanceStatus.PRESENT);
        attToday.setCheckOutTime(LocalTime.of(17, 30, 0));
        attToday.setWorkHours(8.5);
        attendanceRepository.save(attToday);

        for (int i = 1; i <= 5; i++) {
            LocalDate date = today.minusDays(i);
            Attendance att = new Attendance(emp1, date, LocalTime.of(9, 0, 0), Attendance.AttendanceStatus.PRESENT);
            att.setCheckOutTime(LocalTime.of(17, 0, 0));
            att.setWorkHours(8.0);
            attendanceRepository.save(att);
        }

        // 5. Seed Leave Requests for Alex
        LeaveRequest leave1 = new LeaveRequest(emp1, LeaveRequest.LeaveType.PAID, today.minusDays(15), today.minusDays(14), "Family medical emergency");
        leave1.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        leave1.setHrComments("Approved by HR Sarah. Take care!");
        leaveRequestRepository.save(leave1);

        LeaveRequest leave2 = new LeaveRequest(emp1, LeaveRequest.LeaveType.SICK, today.plusDays(5), today.plusDays(6), "Scheduled dental surgery");
        leave2.setStatus(LeaveRequest.LeaveStatus.PENDING);
        leaveRequestRepository.save(leave2);

        // 6. Seed Payroll for Alex
        Payroll payroll1 = new Payroll(emp1, 7, 2026, 85000.0 / 12, 500.0, 200.0, (85000.0 / 12) + 300.0, Payroll.PaymentStatus.PAID);
        payrollRepository.save(payroll1);

        Payroll payroll2 = new Payroll(emp1, 8, 2026, 85000.0 / 12, 500.0, 200.0, (85000.0 / 12) + 300.0, Payroll.PaymentStatus.PAID);
        payrollRepository.save(payroll2);

        // 7. Seed HR Policies
        HRPolicy policy1 = new HRPolicy("Company Leave Policy", "Leave", "Employees are entitled to 24 annual days off (15 Paid Leaves, 9 Sick Leaves). All leave requests must be submitted through the Dayflow portal. Emergency sick leaves can be requested on the day of absence.", "https://example.com/leave-policy.pdf");
        hrPolicyRepository.save(policy1);

        HRPolicy policy2 = new HRPolicy("Working Hours & Attendance Policy", "Attendance", "Official company working hours are 9:00 AM to 5:00 PM EST, Monday through Friday. Daily check-in and check-out via the Dayflow widget is mandatory for all team members.", "https://example.com/attendance-policy.pdf");
        hrPolicyRepository.save(policy2);

        HRPolicy policy3 = new HRPolicy("Payroll & Compensation Structure", "Payroll", "Salary disbursements occur on the last business day of every calendar month. Base salary is supplemented by performance allowances and health benefit deductions.", "https://example.com/payroll-policy.pdf");
        hrPolicyRepository.save(policy3);

        System.out.println(">>> Dayflow HRMS Seed Data Initialization Complete!");
        System.out.println("ADMIN -> Login: admin@dayflow.com / Admin@123");
        System.out.println("HR -> Login: hr.sarah@dayflow.com / Hr@12345");
        System.out.println("EMPLOYEE -> Login: emp.alex@dayflow.com / Emp@12345");
    }
}
