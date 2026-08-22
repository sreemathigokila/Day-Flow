package com.dayflow.repository;

import com.dayflow.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeIdOrderByDateDesc(Long employeeId);
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    List<Attendance> findByEmployeeIdAndDateBetweenOrderByDateDesc(Long employeeId, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByEmployeeHrIdAndDate(Long hrId, LocalDate date);
    List<Attendance> findByDate(LocalDate date);
}
