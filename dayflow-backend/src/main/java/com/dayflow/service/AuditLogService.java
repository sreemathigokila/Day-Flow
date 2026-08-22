package com.dayflow.service;

import com.dayflow.entity.AuditLog;
import com.dayflow.repository.AuditLogRepository;
import com.dayflow.security.SecurityUtils;
import com.dayflow.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String action, String targetEntity, String details, boolean allowed) {
        UserPrincipal principal = SecurityUtils.getCurrentUserPrincipal();
        Long userId = principal != null ? principal.getUserId() : null;
        String email = principal != null ? principal.getUsername() : "SYSTEM";

        AuditLog log = new AuditLog(userId, email, action, targetEntity, details, allowed);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
