package com.qmul.messaging.app.repository;

import com.qmul.messaging.app.model.ForumMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumMessageRepository extends MongoRepository<ForumMessage, String> {
}
