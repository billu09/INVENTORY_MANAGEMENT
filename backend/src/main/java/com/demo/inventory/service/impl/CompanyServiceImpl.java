package com.demo.inventory.service.impl;

import com.demo.inventory.model.User;
import com.demo.inventory.repository.UserRepository;
import com.demo.inventory.service.CompanyService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final UserRepository userRepository;

    public CompanyServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= ADMIN =================

    @Override
    public List<User> getAllCompanies() {
        return userRepository.findByRole("ROLE_COMPANY");
    }

    @Override
    public User updateStatus(Long id, boolean active) {
        User company = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!"ROLE_COMPANY".equals(company.getRole())) {
            throw new RuntimeException("User is not a company");
        }

        company.setActive(active);
        return userRepository.save(company);
    }

    // ================= COMPANY =================

    @Override
    public User getCompanyByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!"ROLE_COMPANY".equals(user.getRole())) {
            throw new RuntimeException("User is not a company");
        }

        return user;
    }
}
