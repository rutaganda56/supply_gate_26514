package org.example.supply_gate_26514.service;

import org.example.supply_gate_26514.dto.VerificationResponseDto;
import org.example.supply_gate_26514.dto.VerificationReviewDto;
import org.example.supply_gate_26514.model.Verification;
import org.example.supply_gate_26514.model.VerificationStatus;
import org.example.supply_gate_26514.model.User;
import org.example.supply_gate_26514.model.UserEnum;
import org.example.supply_gate_26514.repository.VerificationRepository;
import org.example.supply_gate_26514.repository.UserRepository;
import org.example.supply_gate_26514.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityUtils securityUtils;

    /**
     * Gets all verifications (paginated) with optional search.
     * 
     * @param pageable Pagination parameters
     * @param search Optional search term to filter verifications
     * @return Paginated verifications
     */
    public Page<VerificationResponseDto> getAllVerifications(Pageable pageable, String search) {
        Page<Verification> verifications;
        if (search != null && !search.trim().isEmpty()) {
            verifications = verificationRepository.findBySearch(search.trim(), pageable);
        } else {
            verifications = verificationRepository.findAll(pageable);
        }
        
        return verifications.map(this::mapToResponseDto);
    }

    /**
     * Gets verification for the current authenticated user.
     * 
     * @return VerificationResponseDto or null if not found
     */
    public Optional<VerificationResponseDto> getMyVerification() {
        try {
            UUID userId = securityUtils.getCurrentUserId();
            Optional<Verification> verification = verificationRepository.findByUser_UserId(userId);
            return verification.map(this::mapToResponseDto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Reviews a verification (approves or rejects it).
     * SECURITY: Only INDUSTRY_WORKER role can review verifications.
     * 
     * @param verificationId The verification ID to review
     * @param reviewDto Review data containing status and optional rejectionReason
     * @return Updated VerificationResponseDto
     * @throws IllegalStateException if user doesn't have INDUSTRY_WORKER role
     * @throws IllegalArgumentException if verification not found or invalid status
     */
    @Transactional
    public VerificationResponseDto reviewVerification(UUID verificationId, VerificationReviewDto reviewDto) {
        // SECURITY: Require INDUSTRY_WORKER role
        securityUtils.requireRole(UserEnum.INDUSTRY_WORKER);
        
        // Get the current reviewer (industry worker)
        User reviewer = securityUtils.getCurrentUser();
        
        // Find the verification
        Verification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found with ID: " + verificationId));
        
        // Validate status
        VerificationStatus newStatus = reviewDto.status();
        if (newStatus != VerificationStatus.APPROVED && newStatus != VerificationStatus.REJECTED) {
            throw new IllegalArgumentException("Review status must be APPROVED or REJECTED, got: " + newStatus);
        }
        
        // Validate that verification is in a reviewable state
        if (verification.getStatus() == VerificationStatus.NOT_SUBMITTED) {
            throw new IllegalArgumentException("Cannot review verification that has not been submitted");
        }
        
        // Update verification status atomically
        verification.setStatus(newStatus);
        verification.setReviewedBy(reviewer);
        verification.setLastUpdatedDate(LocalDateTime.now());
        
        // Set rejection reason if rejected
        if (newStatus == VerificationStatus.REJECTED) {
            String rejectionReason = reviewDto.rejectionReason();
            if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
                throw new IllegalArgumentException("Rejection reason is required when rejecting a verification");
            }
            verification.setRejectionReason(rejectionReason.trim());
        } else {
            // Clear rejection reason if approved
            verification.setRejectionReason(null);
        }
        
        // Save the updated verification
        Verification saved = verificationRepository.save(verification);
        
        return mapToResponseDto(saved);
    }

    /**
     * Maps Verification entity to VerificationResponseDto.
     */
    private VerificationResponseDto mapToResponseDto(Verification verification) {
        User user = verification.getUser();
        String supplierName = "";
        String email = "";
        String businessType = null;
        
        if (user != null) {
            supplierName = ((user.getFirstName() != null ? user.getFirstName() : "") + 
                           " " + (user.getLastName() != null ? user.getLastName() : "")).trim();
            if (supplierName.isEmpty()) {
                supplierName = user.getUsername();
            }
            email = user.getEmail();
            // businessType could be derived from user's companyName or other fields
            businessType = user.getCompanyName();
        }
        
        UUID reviewedById = null;
        if (verification.getReviewedBy() != null) {
            reviewedById = verification.getReviewedBy().getUserId();
        }
        
        return new VerificationResponseDto(
                verification.getVerificationId(),
                user != null ? user.getUserId() : null,
                supplierName,
                email,
                businessType,
                verification.getStatus(),
                verification.getBusinessLicenseUrl(),
                verification.getTaxCertificateUrl(),
                verification.getBankStatementUrl(),
                verification.getIdentityProofUrl(),
                verification.getSubmittedDate(),
                verification.getLastUpdatedDate(),
                verification.getRejectionReason(),
                reviewedById,
                verification.getCompanyName()
        );
    }
}
