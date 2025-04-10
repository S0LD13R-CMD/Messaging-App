package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.PrivateMessage;
import com.qmul.messaging.app.repository.PrivateMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketPrivateChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private PrivateMessageRepository privateMessageRepository;

    @MessageMapping("/private")
    public void handlePrivateMessage(PrivateMessage message, Principal principal) {
        String sender = principal.getName();
        message.setSenderId(sender);
        message.setTimestamp(String.valueOf(System.currentTimeMillis()));
        privateMessageRepository.save(message);

        messagingTemplate.convertAndSendToUser(sender, "/queue/private", message);
        messagingTemplate.convertAndSendToUser(message.getReceiverId(), "/queue/private", message);
    }
}
