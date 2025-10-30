package org.example.supply_gate_26514.contoller;

import jakarta.validation.Valid;
import org.example.supply_gate_26514.dto.CategoryDto;
import org.example.supply_gate_26514.dto.CategoryResponseDto;
import org.example.supply_gate_26514.service.CategoryService;
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
@RequestMapping("api/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;
    @GetMapping("categories")
    public List<CategoryResponseDto> getCategories() {
        return categoryService.getAllCategories();
    }
    @PostMapping("createCategory")
    public CategoryResponseDto createCategory(@Valid @RequestBody CategoryDto dto){
        return categoryService.addCategory(dto);
    }
    @PutMapping("/{id}")
    public CategoryResponseDto updateCategory(@PathVariable("id") UUID id, @Valid @RequestBody CategoryDto categoryDto){
        return categoryService.updateCategory(id, categoryDto);
    }
    @DeleteMapping("deleteCategory/{id}")
    public void deleteCategory(@PathVariable("id") UUID id){
        categoryService.deleteCategory(id);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
        var errors=new HashMap<String,String>();
        ex.getBindingResult().getAllErrors().forEach(error->{
            var fieldName= ((FieldError) error).getField();
            var errorMsg=error.getDefaultMessage();
            errors.put(fieldName,errorMsg);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
