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
    private String senderId;
    private String receiverId;
    private String threadId;
    private String timestamp;

    public ForumMessage() {}

    public ForumMessage(String senderId, String receiverId, String threadId, String timestamp) {
        this.senderId = senderId;        this.receiverId = receiverId;
        this.threadId = threadId;
        this.timestamp = timestamp;
    }
}
