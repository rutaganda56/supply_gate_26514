package org.example.supply_gate_26514.model;

import jakarta.persistence.*;

import java.util.UUID;
@Entity
@Table(name ="categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID categoryId;
    @Enumerated(EnumType.STRING)
    private CategoryEnum categoryType;

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public CategoryEnum getCategoryType() {
        return categoryType;
    }

    public void setCategoryType(CategoryEnum categoryType) {
        this.categoryType = categoryType;
    }

    public Category() {
    }
}
