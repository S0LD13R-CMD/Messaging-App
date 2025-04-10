package com.qmul.messaging.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketEchoTestController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/test-echo")
    public void echoUsername(Principal principal) {
        String username = principal != null ? principal.getName() : "anonymous";
        messagingTemplate.convertAndSendToUser(username, "/queue/test-echo", "👋 Hello " + username);
    }
}
