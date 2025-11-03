package org.example.supply_gate_26514.contoller;

import org.example.supply_gate_26514.dto.ProductDto;
import org.example.supply_gate_26514.dto.ProductResponseDto;
import org.example.supply_gate_26514.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;


    @GetMapping("/getProducts")
    public Page<ProductResponseDto> getAllProducts(
            @PageableDefault(size = 10, sort = "productName") Pageable pageable) {
        return productService.getAllProducts(pageable);
    }
    @PostMapping("createAProduct")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponseDto createProduct(@RequestBody ProductDto productDto) {
        return productService.addAProduct(productDto);
    }
    @PutMapping("{id}")
    public ProductResponseDto updateProduct(@PathVariable("id") UUID id, @RequestBody ProductDto productDto) {
        return productService.updateProduct(id,productDto);
    }
    @DeleteMapping("deleteProduct/{id}")
    public void deleteProduct(@PathVariable("id") UUID id) {
        productService.deleteProduct(id);
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
