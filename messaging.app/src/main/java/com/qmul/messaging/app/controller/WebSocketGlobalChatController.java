package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketGlobalChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GlobalMessageRepository globalMessageRepository;

    @MessageMapping("/global")
    public void handleGlobalMessage(GlobalMessage message, Principal principal) {
        message.setSenderId(principal.getName());
        message.setTimestamp(String.valueOf(System.currentTimeMillis()));
        globalMessageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/global", message);
    }
}
