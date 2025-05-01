package com.qmul.messaging.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qmul.messaging.app.model.Users;
import com.qmul.messaging.app.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        usersRepository.deleteAll();
    }

    @Test
    public void register_validCredentials_returnsOk() throws Exception {
        String json = objectMapper.writeValueAsString(Map.of(
                "username", "testUser",
                "password", "Test123!"
        ));

        mockMvc.perform(post("/authentication/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    public void register_existingUsername_returnsBadRequest() throws Exception {
        usersRepository.save(new Users("testUser", passwordEncoder.encode("Test123!")));

        String json = objectMapper.writeValueAsString(Map.of(
                "username", "testUser",
                "password", "Test123!"
        ));

        mockMvc.perform(post("/authentication/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username is already in use."));
    }

    @Test
    public void login_validCredentials_returnsOk() throws Exception {
        usersRepository.save(new Users("testUser", passwordEncoder.encode("Test123!")));

        String json = objectMapper.writeValueAsString(Map.of(
                "username", "testUser",
                "password", "Test123!"
        ));

        mockMvc.perform(post("/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Login successful"));
    }

    @Test
    public void login_invalidCredentials_returnsUnauthorized() throws Exception {
        String json = objectMapper.writeValueAsString(Map.of(
                "username", "testUser",
                "password", "wrongpassword"
        ));

        mockMvc.perform(post("/authentication/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void register_blankUsername_returnsBadRequest() throws Exception {
        String json = objectMapper.writeValueAsString(Map.of(
                "username", "",
                "password", "Test123!"
        ));

        mockMvc.perform(post("/authentication/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username and password must not be blank."));
    }

    @Test
    public void register_invalidUsername_returnsBadRequest() throws Exception {
        String json = objectMapper.writeValueAsString(Map.of(
                "username", "e@",
                "password", "Test123!"
        ));

        mockMvc.perform(post("/authentication/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void logout_validSession_returnsOk() throws Exception {
        mockMvc.perform(post("/authentication/logout"))
                .andExpect(status().isOk())
                .andExpect(content().string("Logout successful"));
    }

    @Test
    @WithMockUser(username = "testUser")
    public void getAllUsers_withSession_returnsUserList() throws Exception {
        usersRepository.save(new Users("user1", "password1"));
        usersRepository.save(new Users("user2", "password2"));

        String response = mockMvc.perform(get("/authentication/users"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response).contains("user1", "user2");
    }
}
