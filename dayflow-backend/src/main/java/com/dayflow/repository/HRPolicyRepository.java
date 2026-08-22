package com.dayflow.repository;

import com.dayflow.entity.HRPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HRPolicyRepository extends JpaRepository<HRPolicy, Long> {
    List<HRPolicy> findByVisibilityIn(List<HRPolicy.PolicyVisibility> visibilities);
}
