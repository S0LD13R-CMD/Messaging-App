package com.qmul.messaging.app.RepositoryTests;

import com.qmul.messaging.app.model.GlobalMessage;
import com.qmul.messaging.app.repository.GlobalMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataMongoTest
@ActiveProfiles("test")
class GlobalMessageRepositoryTest {

    @Autowired
    private GlobalMessageRepository globalMessageRepository;

    @BeforeEach
    void setUp() {
        globalMessageRepository.deleteAll();

        globalMessageRepository.save(new GlobalMessage("Hello World", "user123", "2025-03-07T10:00:00Z"));
        globalMessageRepository.save(new GlobalMessage("Goodbye", "user456", "2025-03-07T11:00:00Z"));
    }

    @Test
    void testFindBySenderId() {
        List<GlobalMessage> messages = globalMessageRepository.findBySenderId("user123");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello World");
    }

    @Test
    void testFindByContentContaining() {
        List<GlobalMessage> messages = globalMessageRepository.findByContentContaining("Hello");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getSenderId()).isEqualTo("user123");
    }

    @Test
    void testFindByTimestamp() {
        List<GlobalMessage> messages = globalMessageRepository.findByTimestamp("2025-03-07T10:00:00Z");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello World");
    }

    @Test
    void testFindBySenderIdAndTimestampBetween() {
        List<GlobalMessage> messages = globalMessageRepository.findBySenderIdAndTimestampBetween("user123", "2025-03-07T09:00:00Z", "2025-03-07T11:00:00Z");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello World");
    }

    @Test
    void testFindByTimestampLessThanOrderByTimestampDesc() {
        Pageable pageable = PageRequest.of(0, 10);
        List<GlobalMessage> messages = globalMessageRepository
                .findByTimestampLessThanOrderByTimestampDesc("2025-03-07T11:30:00Z", pageable);

        assertThat(messages).hasSize(2);
        assertThat(messages.get(0).getTimestamp()).isEqualTo("2025-03-07T11:00:00Z");
        assertThat(messages.get(1).getTimestamp()).isEqualTo("2025-03-07T10:00:00Z");
    }

    @Test
    void testFindAll() {
        List<GlobalMessage> messages = globalMessageRepository.findAll();
        assertThat(messages).hasSize(2);
    }
}
