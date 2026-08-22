package com.dayflow.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    public static Long getCurrentUserId() {
        UserPrincipal principal = getCurrentUserPrincipal();
        return principal != null ? principal.getUserId() : null;
    }

    public static Long getCurrentHrId() {
        UserPrincipal principal = getCurrentUserPrincipal();
        return principal != null ? principal.getHrId() : null;
    }

    public static Long getCurrentEmployeeId() {
        UserPrincipal principal = getCurrentUserPrincipal();
        return principal != null ? principal.getEmployeeId() : null;
    }
}
