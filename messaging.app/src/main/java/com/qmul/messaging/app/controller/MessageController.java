package com.qmul.messaging.app.controller;

import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.model.PrivateMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import com.qmul.messaging.app.repository.PrivateMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// FOR ABDUL - This is the controller class that handles all the routes for messages
// The routes are defined using the @GetMapping and @PostMapping annotations
// These APIS should ONLY, and ONLY be ACCESSED WITHIN A CHAT.

@RestController
@RequestMapping("/messages")  // All routes start with /messages
public class MessageController {

    private final GlobalMessageRepository globalMessageRepository;
    private final PrivateMessageRepository privateMessageRepository;

    public MessageController(GlobalMessageRepository globalMessageRepository, PrivateMessageRepository privateMessageRepository) {
        this.globalMessageRepository = globalMessageRepository;
        this.privateMessageRepository = privateMessageRepository;
    }

    /////////////////////////////// GLOBAL MESSAGES /////////////////////////////////
    // GET /messages -> Fetch all messages
    @GetMapping("/global")
    public List<GlobalMessage> getAllMessages() {
        return globalMessageRepository.findAll();
    }

    // POST /messages -> Save a new message
    @PostMapping("/global")
    public ResponseEntity<GlobalMessage> createMessage(@RequestBody GlobalMessage message) {
        try {
            GlobalMessage savedMessage = globalMessageRepository.save(message);
            return ResponseEntity.ok(savedMessage); // Returns 200 OK with the saved message
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Returns 500 Internal Server Error if something fails
        }
    }

    /////////////////////////////// PRIVATE MESSAGES API /////////////////////////////////
    // Change this to find all by ids
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

}
