package com.dayflow.service.ai;

import com.dayflow.dto.AiDTOs;
import com.dayflow.dto.AttendanceDTOs;
import com.dayflow.dto.EmployeeDTOs;
import com.dayflow.dto.LeaveDTOs;
import com.dayflow.dto.PayrollDTOs;
import com.dayflow.exception.AccessDeniedCustomException;
import com.dayflow.security.SecurityUtils;
import com.dayflow.service.AuditLogService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class DayflowAiAssistantService {

    private final EmployeeAiTools employeeAiTools;
    private final PolicyRagService policyRagService;
    private final AuditLogService auditLogService;

    @Value("${app.gemini.api-key:mock-key}")
    private String geminiApiKey;

    public DayflowAiAssistantService(EmployeeAiTools employeeAiTools, PolicyRagService policyRagService, AuditLogService auditLogService) {
        this.employeeAiTools = employeeAiTools;
        this.policyRagService = policyRagService;
        this.auditLogService = auditLogService;
    }

    public AiDTOs.AiChatResponse processEmployeeQuery(String userPrompt) {
        Long currentEmployeeId = SecurityUtils.getCurrentEmployeeId();
        if (currentEmployeeId == null) {
            auditLogService.logAction("AI_QUERY_BLOCKED", "AI_ASSISTANT", "Unauthenticated session attempt", false);
            throw new AccessDeniedCustomException("AI Assistant is strictly available to authenticated employees.");
        }

        String lowerPrompt = userPrompt.toLowerCase().trim();

        // Security check for unauthorized cross-employee or admin queries
        if (isUnauthorizedCrossEmployeeQuery(lowerPrompt)) {
            auditLogService.logAction("AI_SECURITY_DENIAL", "AI_ASSISTANT", "Prompt: " + userPrompt, false);
            return new AiDTOs.AiChatResponse(
                    "I am your personal Dayflow AI Assistant. I can only provide attendance, leave, payroll, and profile information for your own account. I am strictly forbidden from accessing or disclosing information about other employees, HR staff, or administrators.",
                    "SECURITY_FIREWALL",
                    true
            );
        }

        auditLogService.logAction("AI_TOOL_EXECUTION", "AI_ASSISTANT", "Prompt: " + userPrompt, true);
        EmployeeDTOs.EmployeeResponse profile = employeeAiTools.getMyProfile();

        // Human-in-the-Loop Recommendation Check (e.g. "I need leave next Friday")
        if (lowerPrompt.contains("need leave") || lowerPrompt.contains("apply for leave") || lowerPrompt.contains("want off") || lowerPrompt.contains("leave next")) {
            LeaveDTOs.LeaveBalanceDTO balance = employeeAiTools.getMyLeaveBalance();
            if (balance.getRemainingLeaves() > 0) {
                String recommendedType = lowerPrompt.contains("sick") ? "SICK" : "PAID";
                return new AiDTOs.AiChatResponse(
                        "AI LEAVE RECOMMENDATION:\nYou have " + balance.getRemainingLeaves() + " remaining leave days available. " + recommendedType + " LEAVE appears applicable for your request.\n\n[HUMAN-IN-THE-LOOP CONFIRMATION REQUIRED]\nWould you like to prepare and submit this leave request to your assigned HR manager (" + (profile.getHrName() != null ? profile.getHrName() : "General HR") + ")?",
                        "AI_RECOMMENDATION",
                        true
                );
            } else {
                return new AiDTOs.AiChatResponse(
                        "AI LEAVE CHECK: You have 0 remaining paid leave days. You may apply for UNPAID LEAVE, which will require explicit approval from your HR manager.",
                        "DAYFLOW_SECURE_AI",
                        true
                );
            }
        }

        // Determine tool data to inject
        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("Authenticated Employee Info:\n")
                .append("Name: ").append(profile.getName()).append("\n")
                .append("Job Title: ").append(profile.getJobTitle()).append("\n")
                .append("Department: ").append(profile.getDepartment()).append("\n")
                .append("HR Manager: ").append(profile.getHrName() != null ? profile.getHrName() : "General HR").append("\n\n");

        if (lowerPrompt.contains("explain my attendance") || lowerPrompt.contains("why did my attendance decrease")) {
            Map<String, Object> attendanceAnalysis = employeeAiTools.explainAttendance();
            return new AiDTOs.AiChatResponse((String) attendanceAnalysis.get("explanationText"), "AI_EXPLAINABILITY", true);
        }

        if (lowerPrompt.contains("leave") || lowerPrompt.contains("vacation") || lowerPrompt.contains("absent") || lowerPrompt.contains("holiday")) {
            LeaveDTOs.LeaveBalanceDTO balance = employeeAiTools.getMyLeaveBalance();
            List<LeaveDTOs.LeaveRequestDTO> requests = employeeAiTools.getMyLeaveRequests();

            contextBuilder.append("My Leave Balance:\n")
                    .append("- Total Annual Allowed: ").append(balance.getTotalAllowed()).append(" days\n")
                    .append("- Paid Leaves Used: ").append(balance.getPaidLeavesUsed()).append(" days\n")
                    .append("- Sick Leaves Used: ").append(balance.getSickLeavesUsed()).append(" days\n")
                    .append("- Remaining Balance: ").append(balance.getRemainingLeaves()).append(" days\n\n");

            contextBuilder.append("My Recent Leave Requests:\n");
            for (LeaveDTOs.LeaveRequestDTO req : requests) {
                contextBuilder.append("- ").append(req.getLeaveType()).append(" from ").append(req.getStartDate()).append(" to ").append(req.getEndDate())
                        .append(" | Status: ").append(req.getStatus()).append(" | Comments: ").append(req.getHrComments() != null ? req.getHrComments() : "N/A").append("\n");
            }
            contextBuilder.append("\n");
        }

        if (lowerPrompt.contains("attendance") || lowerPrompt.contains("check-in") || lowerPrompt.contains("check-out") || lowerPrompt.contains("absent") || lowerPrompt.contains("working hours") || lowerPrompt.contains("today")) {
            List<AttendanceDTOs.AttendanceRecordDTO> attendance = employeeAiTools.getMyAttendance();
            contextBuilder.append("My Recent Attendance Records:\n");
            int count = 0;
            for (AttendanceDTOs.AttendanceRecordDTO att : attendance) {
                if (count++ >= 7) break;
                contextBuilder.append("- Date: ").append(att.getDate())
                        .append(" | Check-in: ").append(att.getCheckInTime() != null ? att.getCheckInTime() : "Not checked in")
                        .append(" | Check-out: ").append(att.getCheckOutTime() != null ? att.getCheckOutTime() : "Not checked out")
                        .append(" | Status: ").append(att.getStatus()).append("\n");
            }
            contextBuilder.append("\n");
        }

        if (lowerPrompt.contains("salary") || lowerPrompt.contains("pay") || lowerPrompt.contains("payroll") || lowerPrompt.contains("compensation") || lowerPrompt.contains("earnings")) {
            List<PayrollDTOs.PayrollRecordDTO> payrolls = employeeAiTools.getMyPayrollSummary();
            contextBuilder.append("My Payroll Summary:\n");
            for (PayrollDTOs.PayrollRecordDTO pay : payrolls) {
                contextBuilder.append("- ").append(pay.getMonth()).append("/").append(pay.getYear())
                        .append(" | Basic: $").append(pay.getBasicSalary())
                        .append(" | Allowances: $").append(pay.getAllowances())
                        .append(" | Deductions: $").append(pay.getDeductions())
                        .append(" | Net Salary: $").append(pay.getNetSalary())
                        .append(" | Status: ").append(pay.getStatus()).append("\n");
            }
            contextBuilder.append("\n");
        }

        if (lowerPrompt.contains("policy") || lowerPrompt.contains("rule") || lowerPrompt.contains("procedure") || lowerPrompt.contains("hours") || lowerPrompt.contains("how to apply")) {
            String policyContext = policyRagService.searchRelevantPolicies(userPrompt);
            contextBuilder.append(policyContext).append("\n");
        }

        String responseText = generateGeminiOrSmartResponse(userPrompt, contextBuilder.toString());
        return new AiDTOs.AiChatResponse(responseText, "DAYFLOW_SECURE_AI", true);
    }

    private boolean isUnauthorizedCrossEmployeeQuery(String prompt) {
        List<String> suspiciousKeywords = Arrays.asList(
                "other employee", "others' salary", "john's", "manager's salary", "boss's salary",
                "colleague's", "all employees", "everyone's salary", "admin password", "database",
                "jwt", "secret", "user credentials", "other's attendance"
        );

        for (String keyword : suspiciousKeywords) {
            if (prompt.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String generateGeminiOrSmartResponse(String prompt, String context) {
        if (!"mock-key".equals(geminiApiKey) && !"mock-gemini-key".equals(geminiApiKey) && geminiApiKey.length() > 10) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> systemInstruction = new HashMap<>();
                systemInstruction.put("parts", List.of(Map.of("text", "You are Dayflow AI Assistant, a friendly and secure personal HR assistant for employees. Respond concisely, accurately, and kindly based ONLY on the provided context.")));

                Map<String, Object> userPart = new HashMap<>();
                userPart.put("text", "Context Data:\n" + context + "\n\nUser Question: " + prompt);

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("system_instruction", systemInstruction);
                requestBody.put("contents", List.of(Map.of("parts", List.of(userPart))));

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map body = response.getBody();
                    List candidates = (List) body.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map candidate = (Map) candidates.get(0);
                        Map contentMap = (Map) candidate.get("content");
                        List parts = (List) contentMap.get("parts");
                        Map part = (Map) parts.get(0);
                        return (String) part.get("text");
                    }
                }
            } catch (Exception e) {
                System.out.println("Gemini API call failed, falling back to local smart synthesizer: " + e.getMessage());
            }
        }

        return buildSmartFallbackResponse(prompt, context);
    }

    private String buildSmartFallbackResponse(String prompt, String context) {
        String lower = prompt.toLowerCase();
        if (lower.contains("leave")) {
            return "Based on your current Dayflow record, you have a total annual allowance of 24 leave days. Your current leave requests and balance are available above. You can easily submit a new leave request using the 'Apply for Leave' form on your dashboard!";
        } else if (lower.contains("attendance") || lower.contains("check-in") || lower.contains("check-out")) {
            return "Here is your attendance update: Today's check-in and check-out status can be managed directly on your Employee Dashboard widget. Your attendance history is recorded accurately in your Dayflow portal.";
        } else if (lower.contains("salary") || lower.contains("pay")) {
            return "Your net salary breakdown is available in your Dayflow Payroll Summary. You can view your basic salary, allowances, and deductions anytime from the My Payroll tab.";
        } else if (lower.contains("policy") || lower.contains("rule")) {
            return "Dayflow HR Policy Summary:\n- Working Hours: 9:00 AM to 5:00 PM (Monday to Friday).\n- Leave Policy: 24 total paid/sick leave days per calendar year. Leave requests must be submitted at least 24 hours in advance.\n- Attendance Policy: Daily check-in and check-out required via the dashboard widget.";
        }
        return "Hello! I am your Dayflow AI Assistant. I can help answer questions about your attendance records, leave balance, payroll breakdown, or company HR policies. How can I assist you today?";
    }
}
