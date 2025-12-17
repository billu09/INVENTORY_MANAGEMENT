package com.demo.inventory.service;

import com.demo.inventory.model.User;
import java.util.List;

public interface CompanyService {

    // ================= ADMIN =================

    // Get all registered companies (users with ROLE_COMPANY)
    List<User> getAllCompanies();

    // Activate / Deactivate company
    User updateStatus(Long id, boolean active);

    // ================= COMPANY =================

    // Get logged-in company profile
    User getCompanyByUsername(String username);
}
