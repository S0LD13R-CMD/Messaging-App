package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")  // All routes start with /messages
public class MessageController {

    private final GlobalMessageRepository messageRepository;

    public MessageController(GlobalMessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // GET /messages -> Fetch all messages
    @GetMapping
    public List<GlobalMessage> getAllMessages() {
        return messageRepository.findAll();
    }

    // POST /messages -> Save a new message
    @PostMapping
    public ResponseEntity<GlobalMessage> createMessage(@RequestBody GlobalMessage message) {
        try {
            GlobalMessage savedMessage = messageRepository.save(message);
            return ResponseEntity.ok(savedMessage); // Returns 200 OK with the saved message
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Returns 500 Internal Server Error if something fails
        }
    }

}
