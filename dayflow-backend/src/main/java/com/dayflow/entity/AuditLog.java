package com.dayflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long actorUserId;
    private String actorEmail;

    @Column(nullable = false)
    private String action;

    private String targetEntity;
    
    @Column(columnDefinition = "TEXT")
    private String details;

    private boolean allowed = true;

    private LocalDateTime timestamp = LocalDateTime.now();

    public AuditLog() {}

    public AuditLog(Long actorUserId, String actorEmail, String action, String targetEntity, String details, boolean allowed) {
        this.actorUserId = actorUserId;
        this.actorEmail = actorEmail;
        this.action = action;
        this.targetEntity = targetEntity;
        this.details = details;
        this.allowed = allowed;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getActorUserId() { return actorUserId; }
    public void setActorUserId(Long actorUserId) { this.actorUserId = actorUserId; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetEntity() { return targetEntity; }
    public void setTargetEntity(String targetEntity) { this.targetEntity = targetEntity; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public boolean isAllowed() { return allowed; }
    public void setAllowed(boolean allowed) { this.allowed = allowed; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
