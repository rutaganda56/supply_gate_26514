package org.example.supply_gate_26514.contoller;

import jakarta.validation.Valid;
import org.example.supply_gate_26514.dto.UserDto;
import org.example.supply_gate_26514.dto.UserResponseDto;
import org.example.supply_gate_26514.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping(value = "/addAUser", consumes = "application/json" , produces = MediaType.APPLICATION_JSON_VALUE)
    public UserResponseDto addUser(@RequestBody @Valid UserDto userDto) {
        return userService.registerUser(userDto);
    }
    @GetMapping( value = "/getAllUsers", consumes = "application/json" , produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers();
    }
    @PutMapping(value = "/updateUser/{id}", consumes = "application/json" , produces = MediaType.APPLICATION_JSON_VALUE)
    public UserResponseDto updateUser(@PathVariable("id")UUID userId, @RequestBody @Valid UserDto userDto) {

      return userService.updateUser(userId, userDto);
    }
    @DeleteMapping(value = "/deleteUser/{id}")
    public void deleteUser(@PathVariable("id")UUID userId) {
        userService.deleteUser(userId);
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
