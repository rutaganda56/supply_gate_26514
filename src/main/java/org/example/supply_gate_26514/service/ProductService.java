package org.example.supply_gate_26514.service;

import org.example.supply_gate_26514.dto.ProductDto;
import org.example.supply_gate_26514.dto.ProductResponseDto;
import org.example.supply_gate_26514.mapper.ProductMapper;
import org.example.supply_gate_26514.model.Category;
import org.example.supply_gate_26514.model.Product;
import org.example.supply_gate_26514.model.Store;
import org.example.supply_gate_26514.repository.CategoryRepository;
import org.example.supply_gate_26514.repository.ProductRepository;
import org.example.supply_gate_26514.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll().stream().map(productMapper::transformToProductResponseDto).collect(Collectors.toList());
    }
    public ProductResponseDto getProductById(UUID id) {
        return productRepository.findById(id).map(productMapper::transformToProductResponseDto).orElse(null);
    }
    public ProductResponseDto addAProduct(ProductDto productDto) {
        var product=productMapper.transformToProductDto(productDto);
        var savedProduct=productRepository.save(product);
        return productMapper.transformToProductResponseDto(savedProduct);
    }
    public ProductResponseDto updateProduct(UUID id, ProductDto productDto) {
        var existingProduct=productRepository.findById(id).orElse(new Product());
        existingProduct.setProductName(productDto.productName());
        existingProduct.setProductDescription(productDto.productDescription());
        existingProduct.setProductPrice(productDto.productPrice());
        var newStore =storeRepository.findById(productDto.storeId()).orElse(new Store());
        existingProduct.setStore(newStore);
        var newCategory =categoryRepository.findById(productDto.categoryId()).orElse(new Category());
        existingProduct.setCategory(newCategory);
        var updatedProduct=productRepository.save(existingProduct);

        return productMapper.transformToProductResponseDto(productRepository.save(updatedProduct));
    }
}
