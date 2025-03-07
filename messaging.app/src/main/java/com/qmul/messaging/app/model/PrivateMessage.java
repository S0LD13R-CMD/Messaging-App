package com.qmul.messaging.app.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "private-messages")
public class PrivateMessage {

    @Id
    private String id;
    private String content;
    private String senderId;
    private String receiverId;
    private String privateChatroomId;
    private String timestamp;

    public PrivateMessage() {}

    public PrivateMessage(String content, String senderId, String receiverId, String privateChatroomId, String timestamp) {
        this.content = content;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.privateChatroomId = privateChatroomId;
        this.timestamp = timestamp;
    }
}
