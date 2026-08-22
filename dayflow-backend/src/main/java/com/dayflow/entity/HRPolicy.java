package com.dayflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hr_policies")
public class HRPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String category;
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    private PolicyVisibility visibility = PolicyVisibility.ALL;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PolicyVisibility {
        ALL,
        EMPLOYEE,
        HR,
        ADMIN
    }

    public HRPolicy() {}

    public HRPolicy(String title, String content, String category, String documentUrl) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.documentUrl = documentUrl;
        this.visibility = PolicyVisibility.ALL;
        this.createdAt = LocalDateTime.now();
    }

    public HRPolicy(String title, String content, String category, String documentUrl, PolicyVisibility visibility) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.documentUrl = documentUrl;
        this.visibility = visibility != null ? visibility : PolicyVisibility.ALL;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public PolicyVisibility getVisibility() { return visibility; }
    public void setVisibility(PolicyVisibility visibility) { this.visibility = visibility; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
