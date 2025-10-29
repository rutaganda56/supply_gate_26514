package org.example.supply_gate_26514.model;

import jakarta.persistence.*;
import java.util.UUID;
@Entity
@Table(name = "Administative_structure")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID structureId;
    private String structureCode;
    private String structureName;
    @ManyToOne
    @JoinColumn(name="parent_id")
    private  Location parent;
    @Enumerated(EnumType.STRING)
    private LocationEnum locationEnum;

    public UUID getStructureId() {
        return structureId;
    }

    public String getStructureCode() {
        return structureCode;
    }

    public String getStructureName() {
        return structureName;
    }

    public Location getParent() {
        return parent;
    }

    public LocationEnum getLocationEnum() {
        return locationEnum;
    }

    public void setStructureId(UUID structureId) {
        this.structureId = structureId;
    }

    public void setStructureCode(String structureCode) {
        this.structureCode = structureCode;
    }

    public void setStructureName(String structureName) {
        this.structureName = structureName;
    }

    public void setParent(Location parent) {
        this.parent = parent;
    }

    public void setLocationEnum(LocationEnum locationEnum) {
        this.locationEnum = locationEnum;
    }

    public Location() {
    }

    public Location(UUID structureId, String structureCode, String structureName, Location parent, LocationEnum locationEnum) {
        this.structureId = structureId;
        this.structureCode = structureCode;
        this.structureName = structureName;
        this.parent = parent;
        this.locationEnum = locationEnum;
    }
}

