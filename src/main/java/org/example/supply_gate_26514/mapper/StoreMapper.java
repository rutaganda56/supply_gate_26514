package org.example.supply_gate_26514.mapper;

import org.example.supply_gate_26514.dto.StoreDto;
import org.example.supply_gate_26514.dto.StoreResponseDto;
import org.example.supply_gate_26514.model.Store;
import org.example.supply_gate_26514.model.User;
import org.springframework.stereotype.Service;

@Service
public class StoreMapper {

    public Store transformStoreToStoreDto(StoreDto storeDto){
        Store store = new Store();
        store.setStoreName(storeDto.storeName());
        store.setStoreEmail(storeDto.storeEmail());
        store.setPhoneNumber(storeDto.phoneNumber());
        User user=new User();
        user.setUserId(storeDto.userId());
        store.setUser(user);
        return store;
    }
    public StoreResponseDto transformStoreDtoToStoreResponseDto(Store store) {
        return new StoreResponseDto(store.getStoreName());
    }
}
