package com.qmul.messaging.app.repository;

import com.qmul.messaging.app.model.PrivateMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivateMessageRepository extends MongoRepository<PrivateMessage, String> {
}
