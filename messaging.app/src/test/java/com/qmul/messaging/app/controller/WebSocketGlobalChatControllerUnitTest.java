package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WebSocketGlobalChatControllerUnitTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private GlobalMessageRepository globalMessageRepository;

    @InjectMocks
    private WebSocketGlobalChatController controller;

    @Test
    void handleGlobalMessage_withPrincipal_setsSenderAndSavesAndBroadcasts() {
        GlobalMessage message = new GlobalMessage();
        Principal principal = () -> "testUser";

        controller.handleGlobalMessage(message, principal);

        verify(globalMessageRepository).save(message);
        verify(messagingTemplate).convertAndSend("/topic/global", message);

        assertEquals("testUser", message.getSenderId());
        assertNotNull(message.getTimestamp());
    }

    @Test
    void handleGlobalMessage_withoutPrincipal_setsNullSenderAndSavesAndBroadcasts() {
        GlobalMessage message = new GlobalMessage();

        controller.handleGlobalMessage(message, null);

        verify(globalMessageRepository).save(message);
        verify(messagingTemplate).convertAndSend("/topic/global", message);

        assertNull(message.getSenderId());
        assertNotNull(message.getTimestamp());
    }
}
