package com.dayflow.repository;

import com.dayflow.entity.AiAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiAuditLogRepository extends JpaRepository<AiAuditLog, Long> {
    List<AiAuditLog> findTop50ByOrderByTimestampDesc();
    List<AiAuditLog> findByEmployeeIdOrderByTimestampDesc(Long employeeId);
}
