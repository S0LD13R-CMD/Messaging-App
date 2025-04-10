package com.qmul.messaging.app.service;

import com.qmul.messaging.app.model.Users;
import com.qmul.messaging.app.repository.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void loadUserByUsername_userExists_returnsUserDetails() {
        Users user = new Users();
        user.setUsername("testUser");
        user.setPasswordHash("testPasswordHash");

        when(usersRepository.findByUsernameIgnoreCase("testUser")).thenReturn(user);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("testUser");

        assertEquals("testUser", userDetails.getUsername());
        assertEquals("testPasswordHash", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().isEmpty());
    }

    @Test
    void loadUserByUsername_userDoesNotExist_throwsUsernameNotFoundException() {
        when(usersRepository.findByUsernameIgnoreCase("testUser")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername("testUser");
        });
    }
}
