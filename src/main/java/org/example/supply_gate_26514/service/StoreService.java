package org.example.supply_gate_26514.service;

import org.example.supply_gate_26514.dto.StoreDto;
import org.example.supply_gate_26514.dto.StoreResponseDto;
import org.example.supply_gate_26514.mapper.StoreMapper;
import org.example.supply_gate_26514.model.Store;
import org.example.supply_gate_26514.model.User;
import org.example.supply_gate_26514.repository.StoreRepository;
import org.example.supply_gate_26514.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private StoreMapper storeMapper;
    @Autowired
    private UserRepository userRepository;


    public List<StoreResponseDto> getAllStores() {
        return storeRepository.findAll().stream().map(storeMapper::transformStoreDtoToStoreResponseDto).collect(Collectors.toList());
    }
    public StoreResponseDto addStore(StoreDto storeDto) {
        var store=storeMapper.transformStoreToStoreDto(storeDto);
        var savedStore=storeRepository.save(store);
        return storeMapper.transformStoreDtoToStoreResponseDto(savedStore);
    }

    public StoreResponseDto updateStore(UUID storeId, StoreDto storeDto) {
        var existingStore=storeRepository.findById(storeId).orElse(new Store());
        existingStore.setPhoneNumber(storeDto.phoneNumber());
        existingStore.setStoreName(storeDto.storeName());
        existingStore.setStoreEmail(storeDto.storeEmail());
        var newUser=userRepository.findById(storeId).orElse(new User());
        existingStore.setUser(newUser);
        var updatedStore=storeRepository.save(existingStore);
        return storeMapper.transformStoreDtoToStoreResponseDto(updatedStore);
    }
    public String deleteStore(UUID storeId) {
        storeRepository.deleteById(storeId);
        return "Store deleted";
    }
}
