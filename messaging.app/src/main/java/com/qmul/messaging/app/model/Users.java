package com.qmul.messaging.app.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "users")
public class Users {

    @Id
    private String id;
    private String username;
    private String passwordHash;

    public Users() {}

    public Users(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }
}
