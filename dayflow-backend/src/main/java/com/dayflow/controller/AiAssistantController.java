package com.dayflow.controller;

import com.dayflow.dto.AiDTOs;
import com.dayflow.service.ai.DayflowAiAssistantService;
import com.dayflow.service.ai.EmployeeAiTools;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@PreAuthorize("hasAuthority('ROLE_EMPLOYEE')")
public class AiAssistantController {

    private final DayflowAiAssistantService aiAssistantService;
    private final EmployeeAiTools employeeAiTools;

    public AiAssistantController(DayflowAiAssistantService aiAssistantService, EmployeeAiTools employeeAiTools) {
        this.aiAssistantService = aiAssistantService;
        this.employeeAiTools = employeeAiTools;
    }

    @PostMapping("/assistant")
    public ResponseEntity<AiDTOs.AiChatResponse> chatWithAiAssistant(@RequestBody AiDTOs.AiChatRequest request) {
        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AiDTOs.AiChatResponse("Please ask a valid question.", "CLIENT_ERROR", false));
        }
        return ResponseEntity.ok(aiAssistantService.processEmployeeQuery(request.getPrompt()));
    }

    @GetMapping("/timeline")
    public ResponseEntity<Map<String, Object>> getMyHrTimeline() {
        return ResponseEntity.ok(employeeAiTools.getMyHRTimeline());
    }

    @GetMapping("/explain-attendance")
    public ResponseEntity<Map<String, Object>> explainAttendance() {
        return ResponseEntity.ok(employeeAiTools.explainAttendance());
    }

    @GetMapping("/explain-leave/{id}")
    public ResponseEntity<Map<String, Object>> explainLeaveDecision(@PathVariable Long id) {
        return ResponseEntity.ok(employeeAiTools.explainLeaveDecision(id));
    }
}
