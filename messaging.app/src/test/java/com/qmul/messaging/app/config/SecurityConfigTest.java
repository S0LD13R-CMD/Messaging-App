package com.qmul.messaging.app.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    public void globalChatEndpoint_whenAuthenticated_thenAllowAccess() throws Exception {
        mockMvc.perform(get("/messages/global"))
                .andExpect(status().isOk());
    }

    @Test
    public void globalChatEndpoint_whenUnauthenticated_thenReturn403() throws Exception {
        mockMvc.perform(get("/messages/global"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    public void privateChatEndpoint_whenAuthenticated_thenAllowAccess() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("username", "testuser");
        mockMvc.perform(get("/messages/private-chat/testuser").session(session))
                .andExpect(status().isOk());
    }

    @Test
    public void privateChatEndpoint_whenUnauthenticated_thenReturn403() throws Exception {
        mockMvc.perform(get("/messages/private-chat/testsuser"))
                .andExpect(status().isForbidden());
    }
}