package org.example.supply_gate_26514.contoller;

import jakarta.validation.Valid;
import org.example.supply_gate_26514.dto.StoreDto;
import org.example.supply_gate_26514.dto.StoreResponseDto;
import org.example.supply_gate_26514.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping("/stores")
    public List<StoreResponseDto> getStores() {
        return storeService.getAllStores();
    }
    @PostMapping("/createStore")
    @ResponseStatus(HttpStatus.CREATED)
    public StoreResponseDto createStore(@Valid @RequestBody StoreDto storeDto) {
        return storeService.addStore(storeDto);
    }
    @PutMapping("/{id}")
    public StoreResponseDto updateStore(@PathVariable UUID id, @Valid @RequestBody StoreDto storeDto) {
        return storeService.updateStore(id,storeDto);
    }
    @DeleteMapping("/deleteStore/{id}")
    public void deleteStore(@PathVariable("id") UUID id) {
        storeService.deleteStore(id);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        var errors = new HashMap<String, String>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            var fieldName = ((FieldError) error).getField();
            var errorMsg = error.getDefaultMessage();
            errors.put(fieldName, errorMsg);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}
