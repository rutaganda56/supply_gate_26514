package org.example.supply_gate_26514.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
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
}
