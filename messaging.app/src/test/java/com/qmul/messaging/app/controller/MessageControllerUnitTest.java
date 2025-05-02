package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.model.PrivateMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import com.qmul.messaging.app.repository.PrivateMessageRepository;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageControllerUnitTest {

    @Mock
    private GlobalMessageRepository globalMessageRepository;
    @Mock
    private PrivateMessageRepository privateMessageRepository;
    @Mock
    private HttpSession httpSession;

    @InjectMocks
    private MessageController messageController;

    @Test
    public void retrieveGlobalMessages_noBeforeParam_returnsAllMessages() {
        List<GlobalMessage> messages = List.of(new GlobalMessage("content", "user", "1"));
        Page<GlobalMessage> page = new PageImpl<>(messages);
        when(globalMessageRepository.findAll(any(Pageable.class))).thenReturn(page);

        ResponseEntity<List<GlobalMessage>> resp = messageController.retrieveGlobalMessages(null, 100);
        assertEquals(200, resp.getStatusCodeValue());
        assertEquals(1, resp.getBody().size());
    }

    @Test
    public void retrieveGlobalMessages_withBeforeParam_returnsFilteredMessages() {
        List<GlobalMessage> messages = List.of(new GlobalMessage("content", "user", "1"));
        when(globalMessageRepository.findByTimestampLessThanOrderByTimestampDesc(eq("2"), any(Pageable.class))).thenReturn(messages);

        ResponseEntity<List<GlobalMessage>> resp = messageController.retrieveGlobalMessages("2", 100);
        assertEquals(200, resp.getStatusCodeValue());
        assertEquals(1, resp.getBody().size());
    }

    @Test
    public void retrieveGlobalMessages_repositoryThrowsException_returns500() {
        when(globalMessageRepository.findAll(any(Pageable.class))).thenThrow(new RuntimeException("fail"));
        ResponseEntity<List<GlobalMessage>> resp = messageController.retrieveGlobalMessages(null, 100);
        assertEquals(500, resp.getStatusCodeValue());
    }

    @Test
    public void getPrivateChatWithUser_noSession_returns401() {
        when(httpSession.getAttribute("username")).thenReturn(null);
        ResponseEntity<List<PrivateMessage>> resp = messageController.getPrivateChatWithUser("other", httpSession);
        assertEquals(401, resp.getStatusCodeValue());
    }

    @Test
    public void getPrivateChatWithUser_validSession_returnsMessages() {
        when(httpSession.getAttribute("username")).thenReturn("user1");
        List<PrivateMessage> messages = List.of(new PrivateMessage("hi", "user1", "other", "room", "1"));
        when(privateMessageRepository.findByPrivateChatroomIdOrderByTimestampAsc(anyString())).thenReturn(messages);

        ResponseEntity<List<PrivateMessage>> resp = messageController.getPrivateChatWithUser("other", httpSession);
        assertEquals(200, resp.getStatusCodeValue());
        assertEquals(1, resp.getBody().size());
    }

    @Test
    public void getPrivateChatWithUser_emptyUsername_returnsEmptyList() {
        when(httpSession.getAttribute("username")).thenReturn("user1");
        ResponseEntity<List<PrivateMessage>> resp = messageController.getPrivateChatWithUser("", httpSession);
        assertEquals(200, resp.getStatusCodeValue());
        assertTrue(resp.getBody().isEmpty());
    }
}