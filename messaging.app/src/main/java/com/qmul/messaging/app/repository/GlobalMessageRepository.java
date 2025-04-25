package com.qmul.messaging.app.repository;

import com.qmul.messaging.app.model.GlobalMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GlobalMessageRepository extends MongoRepository<GlobalMessage, String> {

    @Query("{ 'content' : { $regex: ?0, $options: 'i' } }")
    List<GlobalMessage> findByContentContaining(String content);

    List<GlobalMessage> findBySenderId(String sender_id);

    List<GlobalMessage> findByTimestamp(String timestamp);

    List<GlobalMessage> findBySenderIdAndTimestampBetween(String sender_id, String startTimestamp, String endTimestamp);

    List<GlobalMessage> findByTimestampLessThanOrderByTimestampDesc(String timestamp, Pageable pageable);
}
