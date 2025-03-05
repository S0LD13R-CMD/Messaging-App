package com.qmul.messaging.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoDB extends MongoRepository<String, String> {
}
