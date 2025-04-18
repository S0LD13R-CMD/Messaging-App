package com.qmul.messaging.app.RepositoryTests;

import com.qmul.messaging.app.model.PrivateMessage;
import com.qmul.messaging.app.repository.PrivateMessageRepository;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataMongoTest
public class PrivateMessageRepositoryTest {

    @Autowired
    private PrivateMessageRepository privateMessageRepository;

   // @BeforeEach
    void setUp()
    {
        privateMessageRepository.deleteAll();

        privateMessageRepository.save(new PrivateMessage("Hello World", "user123", "user456", "chatroom123", "2025-03-07T10:00:00Z"));
        privateMessageRepository.save(new PrivateMessage("Goodbye", "user456", "user123", "chatroom123", "2025-03-07T11:00:00Z"));
    }

    //@Test
    public void testFindBySenderId()
    {
        List<PrivateMessage> messages = privateMessageRepository.findBySenderId("user123");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello World");
    }

   // @Test
    public void testFindByReceiverId()
    {
        List<PrivateMessage> messages = privateMessageRepository.findByReceiverId("user456");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello World");
    }

   // @Test
    public void testFindByPrivateChatroomId()
    {
        List<PrivateMessage> messages = privateMessageRepository.findByPrivateChatroomId("chatroom123");
        assertThat(messages).hasSize(2);
    }

   // @Test
    public void testFindByTimestamp()
    {
        List<PrivateMessage> messages = privateMessageRepository.findByTimestamp("2025-03-07T10:00:00Z");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello World");
    }

   //  @Test
    public void testFindBySenderIdAndReceiverId()
    {
        List<PrivateMessage> messages = privateMessageRepository.findBySenderIdAndReceiverId("user123", "user456");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello World");
    }

   // @Test
    public void testFindByPrivateChatroomIdAndTimestampBetween()
    {
        List<PrivateMessage> messages = privateMessageRepository.findByPrivateChatroomIdAndTimestampBetween("chatroom123", "2025-03-07T09:00:00Z", "2025-03-07T12:00:00Z");
        assertThat(messages).hasSize(2);
    }
}
