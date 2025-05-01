package com.qmul.messaging.app.RepositoryTests;

import com.qmul.messaging.app.model.Users;
import com.qmul.messaging.app.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
@ActiveProfiles("test")
class UsersRepositoryTest {

    @Autowired
    private UsersRepository usersRepository;

    @BeforeEach
    void setup() {
        usersRepository.deleteAll();
    }

    @Test
    public void saveAndFindUser_validUser_userIsFound() {
        Users user = new Users("flapdoodle", "hashedPassword");
        usersRepository.save(user);

        Users foundUser = usersRepository.findByUsernameIgnoreCase("flapdoodle");
        assertNotNull(foundUser);
        assertEquals("flapdoodle", foundUser.getUsername());
    }

    @Test
    public void existsByUsernameIgnoreCase_existingUser_returnsTrue() {
        Users user = new Users("flapdoodletest1", "hashedPassword");
        usersRepository.save(user);

        Boolean exists = usersRepository.existsByUsernameIgnoreCase("flapdoodletest1");
        assertTrue(exists);
    }

    @Test
    public void existsByUsernameIgnoreCase_nonExistingUser_returnsFalse() {
        Boolean notExists = usersRepository.existsByUsernameIgnoreCase("nonexistentUser");
        assertFalse(notExists);
    }

    @Test
    public void findByUsernameIgnoreCase_caseInsensitiveMatch_userIsFound() {
        Users user = new Users("TestUser", "hashedPassword");
        usersRepository.save(user);

        Users foundUser = usersRepository.findByUsernameIgnoreCase("testuser");
        assertNotNull(foundUser);
        assertEquals("TestUser", foundUser.getUsername());
    }
}
