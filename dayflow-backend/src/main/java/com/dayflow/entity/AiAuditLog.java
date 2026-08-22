package com.dayflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_audit_logs")
public class AiAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private String toolName;
    private String action;
    private boolean result;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private LocalDateTime timestamp = LocalDateTime.now();

    public AiAuditLog() {}

    public AiAuditLog(Long employeeId, String toolName, String action, boolean result, String reason) {
        this.employeeId = employeeId;
        this.toolName = toolName;
        this.action = action;
        this.result = result;
        this.reason = reason;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getToolName() { return toolName; }
    public void setToolName(String toolName) { this.toolName = toolName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public boolean isResult() { return result; }
    public void setResult(boolean result) { this.result = result; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
