package com.dayflow.security;

import com.dayflow.entity.Employee;
import com.dayflow.entity.HR;
import com.dayflow.entity.User;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.HrRepository;
import com.dayflow.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final HrRepository hrRepository;
    private final EmployeeRepository employeeRepository;

    public CustomUserDetailsService(UserRepository userRepository, HrRepository hrRepository, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.hrRepository = hrRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Long hrId = null;
        Long employeeId = null;

        if (user.getRole() == com.dayflow.entity.Role.ROLE_HR) {
            Optional<HR> hrOpt = hrRepository.findByUserId(user.getId());
            if (hrOpt.isPresent()) {
                hrId = hrOpt.get().getId();
            }
        } else if (user.getRole() == com.dayflow.entity.Role.ROLE_EMPLOYEE) {
            Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());
            if (empOpt.isPresent()) {
                employeeId = empOpt.get().getId();
            }
        }

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().name(),
                hrId,
                employeeId,
                user.isActive()
        );
    }
}
