package com.qmul.messaging.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.model.PrivateMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import com.qmul.messaging.app.repository.PrivateMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private GlobalMessageRepository globalMessageRepository;

    @Autowired
    private PrivateMessageRepository privateMessageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        globalMessageRepository.deleteAll();
        privateMessageRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "user2")
    public void getGlobalMessages_withExistingMessages_returnsMessages() throws Exception {
        GlobalMessage message = new GlobalMessage("test content", "user1", "1234567890");
        globalMessageRepository.save(message);

        String expectedJson = objectMapper.writeValueAsString(java.util.List.of(message));

        mockMvc.perform(get("/messages/global"))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    @WithMockUser(username = "user1")
    public void getPrivateMessages_withSession_returnsMessages() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "user1");

        PrivateMessage message = new PrivateMessage("test content", "user1", "user2", "user1-user2", "1234567890");
        privateMessageRepository.save(message);

        String expectedJson = objectMapper.writeValueAsString(java.util.List.of(message));

        mockMvc.perform(get("/messages/private-chat/user2")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    @WithMockUser(username = "user1")
    public void createGlobalMessage_valid_returnsOkAndMessage() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("content", "test message");
        payload.put("senderId", "user1");
        payload.put("timestamp", "1234567890");

        String json = objectMapper.writeValueAsString(payload);

        mockMvc.perform(post("/messages/global")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("test message"));
    }

    @Test
    @WithMockUser
    public void createGlobalMessage_nullContent_returnsBadRequest() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("content", null);
        payload.put("senderId", "user1");

        String json = objectMapper.writeValueAsString(payload);

        mockMvc.perform(post("/messages/global")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user1")
    void getPrivateChatWithUser_noSession_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/messages/private-chat/user2"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user1")
    void deleteGlobalMessage_userOwnsMessage_messageDeleted() throws Exception {
        GlobalMessage message = new GlobalMessage("test content", "user1", "1234567890");
        globalMessageRepository.save(message);

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "user1");

        mockMvc.perform(delete("/messages/global/" + message.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(content().string("Message deleted"));
    }

    @Test
    @WithMockUser(username = "user2")
    void deleteGlobalMessage_userNotOwner_forbidden() throws Exception {
        GlobalMessage message = new GlobalMessage("test content", "user1", "1234567890");
        globalMessageRepository.save(message);

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "user2");

        mockMvc.perform(delete("/messages/global/" + message.getId())
                        .session(session))
                .andExpect(status().isForbidden())
                .andExpect(content().string("You can only delete your own messages"));
    }

    @Test
    @WithMockUser(username = "user1")
    void deleteGlobalMessage_messageNotFound_notFound() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "user1");

        mockMvc.perform(delete("/messages/global/doesnotexist")
                        .session(session))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user1")
    void deletePrivateMessage_userOwnsMessage_messageDeleted() throws Exception {
        PrivateMessage message = new PrivateMessage("test content", "user1", "user2", "user1-user2", "1234567890");
        privateMessageRepository.save(message);

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "user1");

        mockMvc.perform(delete("/messages/private/" + message.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(content().string("Message deleted"));
    }

    @Test
    @WithMockUser(username = "user2")
    void deletePrivateMessage_userNotOwner_forbidden() throws Exception {
        PrivateMessage message = new PrivateMessage("test content", "user1", "user2", "user1-user2", "1234567890");
        privateMessageRepository.save(message);

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "user2");

        mockMvc.perform(delete("/messages/private/" + message.getId())
                        .session(session))
                .andExpect(status().isForbidden())
                .andExpect(content().string("You can only delete your own messages"));
    }

    @Test
    @WithMockUser(username = "user1")
    void deletePrivateMessage_messageNotFound_notFound() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "user1");

        mockMvc.perform(delete("/messages/private/doesnotexist")
                        .session(session))
                .andExpect(status().isNotFound());
    }

}