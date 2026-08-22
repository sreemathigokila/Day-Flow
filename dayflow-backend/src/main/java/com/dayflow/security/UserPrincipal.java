package com.dayflow.security;

import com.dayflow.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final Long userId;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final Long hrId;
    private final Long employeeId;
    private final boolean active;

    public UserPrincipal(Long userId, String email, String password, String role, Long hrId, Long employeeId, boolean active) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
        this.hrId = hrId;
        this.employeeId = employeeId;
        this.active = active;
    }

    public Long getUserId() { return userId; }
    public Long getHrId() { return hrId; }
    public Long getEmployeeId() { return employeeId; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return active; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return active; }
}
