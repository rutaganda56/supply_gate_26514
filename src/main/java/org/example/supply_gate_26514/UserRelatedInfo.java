package org.example.supply_gate_26514;

import org.example.supply_gate_26514.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserRelatedInfo implements UserDetails {
  private User user;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return user.getUsername();
    }

    @Override
    public String getUsername() {
        return user.getPassword();
    }
}
