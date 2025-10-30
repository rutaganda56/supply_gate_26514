package org.example.supply_gate_26514.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table
public class Image {
    public UUID getImageId() {
        return imageId;
    }
    @OneToOne(mappedBy = "image", cascade = CascadeType.ALL)
    @JsonManagedReference("image-product")
    private Product product;

    public Image() {
    }

    public void setImageId(UUID imageId) {
        this.imageId = imageId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID imageId;
    private String imageUrl;
}
