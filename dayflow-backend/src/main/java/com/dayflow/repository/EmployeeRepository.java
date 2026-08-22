package com.dayflow.repository;

import com.dayflow.entity.Employee;
import com.dayflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUser(User user);
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findByUserEmail(String email);
    List<Employee> findByHrId(Long hrId);
    long countByHrId(Long hrId);
}
