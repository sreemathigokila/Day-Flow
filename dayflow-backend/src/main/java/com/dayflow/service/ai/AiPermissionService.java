package com.dayflow.service.ai;

import com.dayflow.entity.AiAuditLog;
import com.dayflow.repository.AiAuditLogRepository;
import com.dayflow.security.SecurityUtils;
import org.springframework.stereotype.Service;

@Service
public class AiPermissionService {

    private final AiAuditLogRepository aiAuditLogRepository;

    public AiPermissionService(AiAuditLogRepository aiAuditLogRepository) {
        this.aiAuditLogRepository = aiAuditLogRepository;
    }

    public Long validateEmployeeAccess(String toolName, String action) {
        Long authenticatedEmployeeId = SecurityUtils.getCurrentEmployeeId();
        if (authenticatedEmployeeId == null) {
            aiAuditLogRepository.save(new AiAuditLog(null, toolName, action, false, "Unauthenticated session attempt blocked"));
            throw new IllegalStateException("Access Denied: AI tools require an authenticated employee session.");
        }

        aiAuditLogRepository.save(new AiAuditLog(authenticatedEmployeeId, toolName, action, true, "Authorized employee identity verified"));
        return authenticatedEmployeeId;
    }

    public void logDeniedAttempt(String toolName, String action, String reason) {
        Long authenticatedEmployeeId = SecurityUtils.getCurrentEmployeeId();
        aiAuditLogRepository.save(new AiAuditLog(authenticatedEmployeeId, toolName, action, false, reason));
    }
}
