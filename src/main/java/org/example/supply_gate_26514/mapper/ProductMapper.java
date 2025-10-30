package org.example.supply_gate_26514.mapper;

import org.example.supply_gate_26514.dto.ProductDto;
import org.example.supply_gate_26514.dto.ProductResponseDto;
import org.example.supply_gate_26514.model.Category;
import org.example.supply_gate_26514.model.Product;
import org.example.supply_gate_26514.model.Store;
import org.springframework.stereotype.Service;

@Service
public class ProductMapper {

    public Product transformToProductDto(ProductDto productDto) {
        Product product = new Product();
        product.setProductDescription(productDto.productDescription());
        product.setProductName(productDto.productName());
        product.setProductPrice(productDto.productPrice());
        product.setQuantity(productDto.quantity());
        Category category = new Category();
        category.setCategoryId(productDto.categoryId());
        product.setCategory(category);
        Store store = new Store();
        store.setStoreId(productDto.storeId());
        product.setStore(store);
        return product;
    }
    public ProductResponseDto transformToProductResponseDto(Product product) {
        return new ProductResponseDto(product.getProductName(), product.getProductPrice(), product.getQuantity());
    }

}
