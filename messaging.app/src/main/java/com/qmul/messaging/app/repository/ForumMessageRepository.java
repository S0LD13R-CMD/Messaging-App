package com.qmul.messaging.app.repository;

import com.qmul.messaging.app.model.ForumMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForumMessageRepository extends MongoRepository<ForumMessage, String> {

    List<ForumMessage> findBySenderId(String sender_id);

    List<ForumMessage> findByReceiverId(String receiver_id);

    List<ForumMessage> findByThreadId(String thread_id);

    List<ForumMessage> findByTimestamp(String timestamp);

    List<ForumMessage> findBySenderIdAndReceiverId(String sender_id, String receiver_id);

    List<ForumMessage> findByThreadIdAndTimestampBetween(String thread_id, String startTimestamp, String endTimestamp);
}
