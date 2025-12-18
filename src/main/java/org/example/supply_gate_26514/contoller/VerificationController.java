package org.example.supply_gate_26514.contoller;

import org.example.supply_gate_26514.dto.VerificationResponseDto;
import org.example.supply_gate_26514.dto.VerificationReviewDto;
import org.example.supply_gate_26514.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    /**
     * Get all verifications (paginated with search).
     * Requires authentication.
     * 
     * @param pageable Pagination parameters (page, size, sort)
     * @param search Optional search term to filter verifications
     */
    @GetMapping
    public ResponseEntity<Page<VerificationResponseDto>> getAllVerifications(
            @PageableDefault(size = 20, sort = "submittedDate") Pageable pageable,
            @RequestParam(required = false) String search) {
        try {
            Page<VerificationResponseDto> verifications = verificationService.getAllVerifications(pageable, search);
            return ResponseEntity.ok(verifications);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    /**
     * Get current user's verification.
     * Requires authentication.
     */
    @GetMapping("/my-verification")
    public ResponseEntity<VerificationResponseDto> getMyVerification() {
        try {
            Optional<VerificationResponseDto> verification = verificationService.getMyVerification();
            if (verification.isPresent()) {
                return ResponseEntity.ok(verification.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    /**
     * Review verification (approve or reject).
     * SECURITY: Only INDUSTRY_WORKER role can review verifications.
     * 
     * @param verificationId The verification ID to review
     * @param reviewDto Review data containing status (APPROVED/REJECTED) and optional rejectionReason
     * @return Updated VerificationResponseDto
     */
    @PostMapping("/{verificationId}/review")
    public ResponseEntity<VerificationResponseDto> reviewVerification(
            @PathVariable("verificationId") java.util.UUID verificationId,
            @RequestBody VerificationReviewDto reviewDto) {
        try {
            VerificationResponseDto updated = verificationService.reviewVerification(verificationId, reviewDto);
            return ResponseEntity.ok(updated);
        } catch (IllegalStateException e) {
            // Role mismatch or authorization failure
            String errorMessage = e.getMessage();
            if (errorMessage != null && (
                errorMessage.toLowerCase().contains("required role") ||
                errorMessage.toLowerCase().contains("does not have") && errorMessage.toLowerCase().contains("role") ||
                errorMessage.toLowerCase().contains("role assigned")
            )) {
                // Return 403 FORBIDDEN - authorization failure, not authentication failure
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            // Other IllegalStateException cases (e.g., verification not found)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (IllegalArgumentException e) {
            // Invalid status or other validation errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            // Authentication failure or other errors
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
