package com.dayflow.service.ai;

import com.dayflow.entity.HRPolicy;
import com.dayflow.repository.HRPolicyRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class PolicyRagService {

    private final HRPolicyRepository hrPolicyRepository;

    public PolicyRagService(HRPolicyRepository hrPolicyRepository) {
        this.hrPolicyRepository = hrPolicyRepository;
    }

    public String searchRelevantPolicies(String query) {
        List<HRPolicy.PolicyVisibility> employeeAllowedVisibilities = Arrays.asList(
                HRPolicy.PolicyVisibility.ALL,
                HRPolicy.PolicyVisibility.EMPLOYEE
        );

        List<HRPolicy> policies = hrPolicyRepository.findByVisibilityIn(employeeAllowedVisibilities);

        if (policies.isEmpty()) {
            return "I couldn't find this information in the available HR policies.";
        }

        StringBuilder context = new StringBuilder("Authorized Employee HR Policies:\n");
        String lowerQuery = query.toLowerCase();

        boolean foundMatch = false;
        for (HRPolicy policy : policies) {
            String lowerContent = (policy.getTitle() + " " + policy.getContent() + " " + policy.getCategory()).toLowerCase();
            if (lowerContent.contains(lowerQuery) || lowerQuery.contains("policy") || lowerQuery.contains("rule") || lowerQuery.contains("hours") || lowerQuery.contains("leave")) {
                context.append("--- Policy: ").append(policy.getTitle()).append(" ---\n")
                        .append(policy.getContent()).append("\n\n");
                foundMatch = true;
            }
        }

        if (!foundMatch) {
            return "I couldn't find this information in the available HR policies.";
        }

        return context.toString();
    }
}
