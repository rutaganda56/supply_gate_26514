package org.example.supply_gate_26514.repository;

import org.example.supply_gate_26514.model.Verification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, UUID> {
    /**
     * Finds verification by user ID.
     * Used to check if a supplier is verified.
     */
    Optional<Verification> findByUser_UserId(UUID userId);
    
    /**
     * Finds verifications with search across multiple fields.
     * Searches in: supplier name, email, company name, status
     */
    @Query("SELECT v FROM Verification v " +
           "LEFT JOIN v.user u " +
           "WHERE (LOWER(CONCAT(COALESCE(u.firstName, ''), ' ', COALESCE(u.lastName, ''))) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(COALESCE(u.email, '')) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(COALESCE(v.companyName, '')) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(CAST(v.status AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Verification> findBySearch(@Param("search") String search, Pageable pageable);
}
