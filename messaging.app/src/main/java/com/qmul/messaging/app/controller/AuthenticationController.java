package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.Users;
import com.qmul.messaging.app.repository.UsersRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (usersRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already in use.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        Users newUser = new Users(request.getUsername(), hashedPassword);
        usersRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully");
    }

    @Data
    static class RegisterRequest {
        private String username;
        private String password;
    }
}
