package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.Users;
import com.qmul.messaging.app.repository.UsersRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    private static final String USERNAME_REGEX = "^[a-zA-Z0-9_]{3,20}$";

    private static final String PASSWORD_REGEX = "^[a-zA-Z0-9@#$%^&+=!.,:;()\\[\\]{}\\-_]{8,50}$";

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        final String username = request.get("username");
        final String password = request.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body("Username and password must not be blank.");
        }

        if (!usernameValidityChecker(username)) {
            return ResponseEntity.badRequest().body("Invalid username. Use 3–20 characters: letters, numbers, or underscores.");
        }

        if (!passwordValidityChecker(password)) {
            return ResponseEntity.badRequest().body("Invalid password. Must be 8–50 characters and contain only permitted characters.");
        }

        if (usersRepository.existsByUsernameIgnoreCase(username)) {
            return ResponseEntity.badRequest().body("Username is already in use.");
        }

        String hashedPassword = passwordEncoder.encode(password);
        Users newUser = new Users(username, hashedPassword);
        usersRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        final String username = request.get("username");
        final String password = request.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body("Username and password must not be blank.");
        }

        if (!usernameValidityChecker(username)) {
            return ResponseEntity.badRequest().body("Invalid username.");
        }

        if (!passwordValidityChecker(password)) {
            return ResponseEntity.badRequest().body("Invalid password.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
            session.setAttribute("username", username);
            return ResponseEntity.ok("Login successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }

    //to be removed for production use, only for testing authentication
    @GetMapping("/session")
    public ResponseEntity<?> checkSession(HttpSession session) {
        Object username = session.getAttribute("username");
        return ResponseEntity.ok("sessionId: " + session.getId() + ", username: " + username);
    }

    private boolean usernameValidityChecker(String username) {
        return username != null && username.matches(USERNAME_REGEX);
    }

    private boolean passwordValidityChecker(String password) {
        return password != null && password.matches(PASSWORD_REGEX);
    }

}
