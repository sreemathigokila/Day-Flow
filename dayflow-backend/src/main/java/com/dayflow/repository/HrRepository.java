package com.dayflow.repository;

import com.dayflow.entity.HR;
import com.dayflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HrRepository extends JpaRepository<HR, Long> {
    Optional<HR> findByUser(User user);
    Optional<HR> findByUserId(Long userId);
    Optional<HR> findByUserEmail(String email);
}
