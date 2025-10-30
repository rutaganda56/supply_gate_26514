package org.example.supply_gate_26514.dto;

import jakarta.validation.constraints.NotEmpty;

public record ProductResponseDto(
        @NotEmpty
        String productName,
        Double productPrice,
        @NotEmpty
        String quantity
) {
}
