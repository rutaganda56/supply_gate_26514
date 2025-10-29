package org.example.supply_gate_26514.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table
public class Image {
    public UUID getImageId() {
        return imageId;
    }

    public Image() {
    }

    public void setImageId(UUID imageId) {
        this.imageId = imageId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID imageId;
    private String imageUrl;
}
