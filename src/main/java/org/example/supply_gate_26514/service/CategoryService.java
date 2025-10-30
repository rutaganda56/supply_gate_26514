package org.example.supply_gate_26514.service;

import org.example.supply_gate_26514.dto.CategoryDto;
import org.example.supply_gate_26514.dto.CategoryResponseDto;
import org.example.supply_gate_26514.mapper.CategoryMapper;
import org.example.supply_gate_26514.model.Category;
import org.example.supply_gate_26514.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(categoryMapper::transformCategoryDtoToCategoryResponseDto).collect(Collectors.toList());
    }

    public CategoryResponseDto getCategoryById(UUID id) {
        return categoryRepository.findById(id).stream().map(categoryMapper::transformCategoryDtoToCategoryResponseDto).findFirst().orElse(null);
    }
    public CategoryResponseDto addCategory(CategoryDto categoryDto) {
        var category=categoryMapper.transformCategoryToCategoryDto(categoryDto);
        var savedCategory=categoryRepository.save(category);
        return categoryMapper.transformCategoryDtoToCategoryResponseDto(savedCategory);
    }

    public CategoryResponseDto updateCategory(UUID id, CategoryDto categoryDto) {
        var existingCategory=categoryRepository.findById(id).orElse(new Category());
        existingCategory.setCategoryName(categoryDto.categoryName());
            var savedCategory=categoryRepository.save(existingCategory);
        return categoryMapper.transformCategoryDtoToCategoryResponseDto(savedCategory);

    }
    public String deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
        return "Deleted Category successfully";
    }
}
