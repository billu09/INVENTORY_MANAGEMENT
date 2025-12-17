package com.demo.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demo.inventory.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    // REQUIRED for Admin -> Companies
    List<User> findByRole(String role);
}
