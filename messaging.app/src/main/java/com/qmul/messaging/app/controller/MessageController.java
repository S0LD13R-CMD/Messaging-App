package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.model.PrivateMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import com.qmul.messaging.app.repository.PrivateMessageRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final GlobalMessageRepository globalMessageRepository;
    private final PrivateMessageRepository privateMessageRepository;

    public MessageController(GlobalMessageRepository globalMessageRepository, PrivateMessageRepository privateMessageRepository) {
        this.globalMessageRepository = globalMessageRepository;
        this.privateMessageRepository = privateMessageRepository;
    }

    @GetMapping("/global")
    public List<GlobalMessage> getAllMessages() {
        return globalMessageRepository.findAll();
    }

    @PostMapping("/global")
    public ResponseEntity<GlobalMessage> createMessage(@RequestBody GlobalMessage message) {
        try {
            GlobalMessage savedMessage = globalMessageRepository.save(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/private")
    public List<PrivateMessage> getAllPrivateMessages() {
        return privateMessageRepository.findAll();
    }

    @PostMapping("/private")
    public ResponseEntity<PrivateMessage> createForumMessage(@RequestBody PrivateMessage message) {
        try {
            PrivateMessage savedMessage = privateMessageRepository.save(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/private-chat/{username}")
    public ResponseEntity<List<PrivateMessage>> getPrivateChatWithUser(
            @PathVariable String username, HttpSession session) {
        String currentUser = (String) session.getAttribute("username");
        if (currentUser == null) return ResponseEntity.status(401).build();

        String roomId = Stream.of(currentUser, username)
                .sorted()
                .collect(Collectors.joining("-"));

        List<PrivateMessage> messages = privateMessageRepository
                .findByPrivateChatroomIdOrderByTimestampAsc(roomId);

        return ResponseEntity.ok(messages);
    }
}
