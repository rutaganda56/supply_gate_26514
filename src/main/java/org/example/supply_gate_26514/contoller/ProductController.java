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


    /**
     * Get all products (paginated with search).
     * For anonymous users: Returns all products by default, with optional filter for verified suppliers only.
     * 
     * @param pageable Pagination parameters (page, size, sort)
     * @param search Optional search term to filter products
     * @param verifiedOnly Optional filter to show only products from verified suppliers (default: false)
     * @return Page of products (all products by default, or only verified if verifiedOnly=true)
     */
    @GetMapping("/getProducts")
    public Page<ProductResponseDto> getAllProducts(
            @PageableDefault(size = 10, sort = "productName") Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "false") boolean verifiedOnly) {
        // If verifiedOnly is true, filter to only verified suppliers
        // Otherwise, return all products in the system
        if (verifiedOnly) {
            return productService.getPublicProducts(pageable, search);
        } else {
            return productService.getAllProducts(pageable, search);
        }
    }
    
    /**
     * Get all products including unverified suppliers (for authenticated admin/internal use).
     * SECURITY: This endpoint should be protected and only accessible to authorized users.
     * Currently kept for backward compatibility but should be secured in production.
     * 
     * @param pageable Pagination parameters
     * @param search Optional search term
     * @return Page of all products (including unverified)
     */
    @GetMapping("/all")
    public Page<ProductResponseDto> getAllProductsIncludingUnverified(
            @PageableDefault(size = 10, sort = "productName") Pageable pageable,
            @RequestParam(required = false) String search) {
        // For internal/admin use - shows all products regardless of verification status
        return productService.getAllProducts(pageable, search);
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
