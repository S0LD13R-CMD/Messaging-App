package com.qmul.messaging.app.repository;

import com.qmul.messaging.app.model.PrivateMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrivateMessageRepository extends MongoRepository<PrivateMessage, String> {

    @Query("{ 'content' : { $regex: ?0, $options: 'i' } }")
    List<PrivateMessage> findByContentContaining(String content);

    List<PrivateMessage> findBySenderId(String sender_id);

    List<PrivateMessage> findByReceiverId(String receiver_id);

    List<PrivateMessage> findByPrivateChatroomId(String private_chatroom_id);

    List<PrivateMessage> findByTimestamp(String timestamp);

    List<PrivateMessage> findBySenderIdAndReceiverId(String sender_id, String receiver_id);

    List<PrivateMessage> findByPrivateChatroomIdAndTimestampBetween(String private_chatroom_id, String startTimestamp, String endTimestamp);
    List<PrivateMessage> findByPrivateChatroomIdOrderByTimestampAsc(String privateChatroomId);
}
