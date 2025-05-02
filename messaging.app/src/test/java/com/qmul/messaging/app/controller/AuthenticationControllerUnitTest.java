package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.Users;
import com.qmul.messaging.app.repository.UsersRepository;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerUnitTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private HttpSession session;

    @InjectMocks
    private AuthenticationController authenticationController;

    private Map<String, String> credentials(String username, String password) {
        Map<String, String> map = new HashMap<>();
        map.put("username", username);
        map.put("password", password);
        return map;
    }

    @Test
    public void register_blankUsernameOrPassword_returnsBadRequest() {
        ResponseEntity<?> resp = authenticationController.register(credentials("", "pass"));
        assertEquals(400, resp.getStatusCodeValue());

        resp = authenticationController.register(credentials("user", ""));
        assertEquals(400, resp.getStatusCodeValue());
    }

    @Test
    public void register_usernameTooShort_returnsBadRequest() {
        ResponseEntity<?> resp = authenticationController.register(credentials("ab", "Test@1234"));
        assertEquals(400, resp.getStatusCodeValue());
        assertTrue(resp.getBody().toString().contains("Invalid username"));
    }

    @Test
    public void register_usernameTooLong_returnsBadRequest() {
        ResponseEntity<?> resp = authenticationController.register(credentials("awoehfbiueguergiuerguergher9ugher98gher9ghergegegegerge", "Test@1234"));
        assertEquals(400, resp.getStatusCodeValue());
        assertTrue(resp.getBody().toString().contains("Invalid username"));
    }

    @Test
    public void register_invalidUsernameCharacters_returnsBadRequest() {
        ResponseEntity<?> resp = authenticationController.register(credentials("user@name", "Test@1234"));
        assertEquals(400, resp.getStatusCodeValue());
        assertTrue(resp.getBody().toString().contains("Invalid username"));
    }

    @Test
    public void register_passwordTooShort_returnsBadRequest() {
        ResponseEntity<?> resp = authenticationController.register(credentials("validuser", "short"));
        assertEquals(400, resp.getStatusCodeValue());
        assertTrue(resp.getBody().toString().contains("Invalid password"));
    }

    @Test
    public void register_passwordTooLong_returnsBadRequest() {
        ResponseEntity<?> resp = authenticationController.register(credentials("validuser", "ihf9shf9eh9heg9e8hge9ghergher8ghe9ge8gehge98hger98ghe9g8erhg9e8hg9er8hg9e8rhg9erg9e8rhg9er8gher8gh98erhg98ehrg98ergr"));
        assertEquals(400, resp.getStatusCodeValue());
        assertTrue(resp.getBody().toString().contains("Invalid password"));
    }

    @Test
    public void register_duplicateUsername_returnsBadRequest() {
        when(usersRepository.existsByUsernameIgnoreCase("existinguser")).thenReturn(true);
        ResponseEntity<?> resp = authenticationController.register(credentials("existinguser", "Test@1234"));
        assertEquals(400, resp.getStatusCodeValue());
    }

    @Test
    public void register_validInput_returnsOk() {
        when(usersRepository.existsByUsernameIgnoreCase("newuser")).thenReturn(false);
        when(passwordEncoder.encode("Test@1234")).thenReturn("hashed");
        ResponseEntity<?> resp = authenticationController.register(credentials("newuser", "Test@1234"));
        assertEquals(200, resp.getStatusCodeValue());
        assertTrue(resp.getBody().toString().contains("User registered successfully"));
    }

    @Test
    public void getAllUsers_withSession_returnsUserList() {
        when(session.getAttribute("username")).thenReturn("currentUser");
        when(usersRepository.findAll()).thenReturn(
                java.util.List.of(new Users("user1", "pass"), new Users("currentUser", "pass"))
        );
        ResponseEntity<?> resp = authenticationController.getAllUsers(session);
        assertEquals(200, resp.getStatusCodeValue());
        assertTrue(resp.getBody().toString().contains("user1"));
    }

    @Test
    public void logout_validSession_returnsOk() {
        ResponseEntity<?> resp = authenticationController.logout(session);
        assertEquals(200, resp.getStatusCodeValue());
        assertEquals("Logout successful", resp.getBody());
        verify(session).invalidate();
    }

}