package com.dayflow.repository;

import com.dayflow.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<LeaveRequest> findByEmployeeHrIdOrderByCreatedAtDesc(Long hrId);
    List<LeaveRequest> findByEmployeeHrIdAndStatus(Long hrId, LeaveRequest.LeaveStatus status);
    long countByEmployeeIdAndStatus(Long employeeId, LeaveRequest.LeaveStatus status);
    long countByStatus(LeaveRequest.LeaveStatus status);
}
