package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.PrivateMessage;
import com.qmul.messaging.app.repository.PrivateMessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WebSocketPrivateChatControllerUnitTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private PrivateMessageRepository privateMessageRepository;

    @InjectMocks
    private WebSocketPrivateChatController webSocketPrivateChatController;

    @Test
    public void handlePrivateMessage_withValidPrincipal_andReceiver_sendsToBothUsers() {
        PrivateMessage message = new PrivateMessage();
        message.setReceiverId("testUser1");
        Principal principal = () -> "testUser2";

        webSocketPrivateChatController.handlePrivateMessage(message, principal);

        verify(privateMessageRepository).save(message);
        verify(messagingTemplate).convertAndSendToUser("testUser2", "/queue/private", message);
        verify(messagingTemplate).convertAndSendToUser("testUser1", "/queue/private", message);

        assertEquals("testUser2", message.getSenderId());
        assertNotNull(message.getTimestamp());
    }

    @Test
    public void handlePrivateMessage_withValidPrincipal_butNoReceiver_sendsOnlyToSender() {
        PrivateMessage message = new PrivateMessage();
        Principal principal = () -> "testUser";

        webSocketPrivateChatController.handlePrivateMessage(message, principal);

        verify(privateMessageRepository).save(message);
        verify(messagingTemplate).convertAndSendToUser("testUser", "/queue/private", message);

        assertEquals("testUser", message.getSenderId());
        assertNotNull(message.getTimestamp());
    }

    @Test
    public void handlePrivateMessage_withNullPrincipal_setsSenderToNull() {
        PrivateMessage message = new PrivateMessage();

        webSocketPrivateChatController.handlePrivateMessage(message, null);

        verify(privateMessageRepository).save(message);
        verify(messagingTemplate).convertAndSendToUser(null, "/queue/private", message);

        assertNull(message.getSenderId());
        assertNotNull(message.getTimestamp());
    }
}
