package org.example.supply_gate_26514.repository;

import org.example.supply_gate_26514.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Boolean existsByUserId(UUID userId);

    User findByUsername(String username);
}
