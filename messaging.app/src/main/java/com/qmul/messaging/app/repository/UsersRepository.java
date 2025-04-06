package com.qmul.messaging.app.repository;

import com.qmul.messaging.app.model.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends MongoRepository<Users, String> {
    Users findByUsernameIgnoreCase(String username);
    Boolean existsByUsernameIgnoreCase(String username);
}