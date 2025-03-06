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
    private String sender_id;
    private String receiver_id;
    private String private_chatroom_id;
    private String timestamp;

    public PrivateMessage() {}

    public PrivateMessage(String content, String sender_id, String receiver_id, String private_chatroom_id, String timestamp) {
        this.content = content;
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.private_chatroom_id = private_chatroom_id;
        this.timestamp = timestamp;
    }
}
