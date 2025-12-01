package org.example.supply_gate_26514.service;

import org.example.supply_gate_26514.dto.UserDto;
import org.example.supply_gate_26514.dto.UserResponseDto;
import org.example.supply_gate_26514.mapper.UserMapper;
import org.example.supply_gate_26514.model.Location;
import org.example.supply_gate_26514.model.User;
import org.example.supply_gate_26514.model.UserEnum;
import org.example.supply_gate_26514.repository.LocationRepository;
import org.example.supply_gate_26514.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private JWTService jwtService;

    private BCryptPasswordEncoder passwordEncoder= new BCryptPasswordEncoder(12);

    public String login(User user) {
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if(authentication.isAuthenticated()) {
            return  jwtService.generateToken(user.getUsername());
        }
        return  " login was not successfully made. recheck your credentials";
    }

    public UserResponseDto registerUser(UserDto userDto) {
      var user= userMapper.transformUserToUserDto(userDto);
      user.setPassword(passwordEncoder.encode(user.getPassword()));
      var savedUser = userRepository.save(user);
      return userMapper.transformUserDtoToUserResponseDto(savedUser);
    }
    public List<UserResponseDto> getAllUsers(){
        return userRepository.findAll().stream().map(userMapper::transformUserDtoToUserResponseDto).collect(Collectors.toList());
    }
    public UserResponseDto updateUser(UUID userId, UserDto userDto) {
        var existingUser= userRepository.findById(userId).orElse(new User());
        var newLocation= locationRepository.findById(userDto.locationId()).orElse(new Location());
        existingUser.setLocation(newLocation);
        existingUser.setUserType(UserEnum.valueOf(userDto.userType()));
        existingUser.setFirstName(userDto.firstname());
        existingUser.setLastName(userDto.lastname());
        existingUser.setEmail(userDto.email());
        existingUser.setPhoneNumber(userDto.phoneNumber());
        existingUser.setPassword(userDto.password());
        var updatedUser = userRepository.save(existingUser);
        return userMapper.transformUserDtoToUserResponseDto(updatedUser);
    }
    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
        ResponseEntity.ok().body("User deleted successfully");
    }
}
