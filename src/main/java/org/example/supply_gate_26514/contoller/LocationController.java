package org.example.supply_gate_26514.contoller;

import org.example.supply_gate_26514.model.Location;
import org.example.supply_gate_26514.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/location")
public class LocationController {
    @Autowired
    private LocationService locationService;
    @PostMapping(value = "/addOrganisationStructure", consumes = "application/json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addOrganisationStructure(String parentCode, Location location) {
    String result = locationService.saveGovernmentStructure(parentCode, location);
    if(result.equals("lower GovernmentStructure saved successfully")) {
    return new ResponseEntity<>(result, HttpStatus.OK);
    } else if (result.equals("one more GovernmentStructure already exists.")) {
        return new ResponseEntity<>(result, HttpStatus.CONFLICT);
    } else if (result.equals("no higher organisation structure exists.")) {
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    } else if (result.equals("higher GovernmentStructure saved successfully")) {
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    } else {
        return new ResponseEntity<>(result, HttpStatus.FOUND);
    }
}
}
