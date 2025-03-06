package com.qmul.messaging.app.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "forum-messages")
public class ForumMessage {

    @Id
    private String id;
    private String sender_id;
    private String receiver_id;
    private String thread_id;
    private String timestamp;

    public ForumMessage() {}

    public ForumMessage(String sender_id, String receiver_id, String thread_id, String timestamp) {
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.thread_id = thread_id;
        this.timestamp = timestamp;
    }
}
