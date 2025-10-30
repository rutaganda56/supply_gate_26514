package org.example.supply_gate_26514.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

public record StoreDto(
        @NotEmpty
        String storeName,
        @Pattern(regexp = "^[0-9]{10}$")
        String phoneNumber,
        @Email
        String storeEmail
) {
}
