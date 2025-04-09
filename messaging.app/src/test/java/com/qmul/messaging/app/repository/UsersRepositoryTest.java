//package com.qmul.messaging.app.repository;
//
//import com.qmul.messaging.app.model.Users;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@DataMongoTest
//class UsersRepositoryTest {
//
//    @Autowired
//    private UsersRepository usersRepository;
//
//    @BeforeEach
//    void setUp() {
//        usersRepository.deleteAll();
//
//        Users userOne = new Users("testUserOne", "passwordHashOne");
//        Users userTwo = new Users("testUserTwo", "passwordHashTwo");
//
//        usersRepository.save(userOne);
//        usersRepository.save(userTwo);
//    }
//
//    @Test
//    void findByUsernameIgnoreCase_usernameExists_returnsUser() {
//        Users user = usersRepository.findByUsernameIgnoreCase("testuserone");
//        assertEquals("testUserOne", user.getUsername());
//
//        user = usersRepository.findByUsernameIgnoreCase("TESTUSERONE");
//        assertEquals("testUserOne", user.getUsername());
//    }
//
//    @Test
//    void findByUsernameIgnoreCase_usernameDoesNotExist_returnsNull() {
//        Users user = usersRepository.findByUsernameIgnoreCase("nonexistent");
//        assertNull(user);
//    }
//
//    @Test
//    void existsByUsernameIgnoreCase_usernameExists_returnsTrue() {
//        assertTrue(usersRepository.existsByUsernameIgnoreCase("testUserOne"));
//        assertTrue(usersRepository.existsByUsernameIgnoreCase("TESTUSERONE"));
//    }
//
//    @Test
//    void existsByUsernameIgnoreCase_usernameDoesNotExist_returnsFalse() {
//        assertFalse(usersRepository.existsByUsernameIgnoreCase("nonexistent"));
//    }
//}