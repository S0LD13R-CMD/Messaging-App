package com.qmul.messaging.app.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "global-messages")
public class GlobalMessage {

    @Id
    private String id;
    private String content;
    private String senderId;
    private String timestamp;

    public GlobalMessage() {}

    public GlobalMessage(String content, String senderId, String timestamp) {
        this.content = content;
        this.senderId = senderId;
        this.timestamp = timestamp;
    }
}
