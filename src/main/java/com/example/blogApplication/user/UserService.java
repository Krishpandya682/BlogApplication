package com.example.blogApplication.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;

    }

    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);

    }

    public ResponseEntity<String> addNewUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        } else {
            userRepository.save(user);
            return new ResponseEntity<>("User created", HttpStatus.CREATED);
        }
    }

    public ResponseEntity<User> getFbUser(String firebaseId) {
        Optional<User> user = userRepository.findByFirebaseId(firebaseId);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Void> deleteUser(int userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Indicates successful deletion
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // User with provided ID not found
        }
    }

    public ResponseEntity<Void> updateUser(int id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);

        if (existingUser != null) {
            if (user.getName() != null) {
                existingUser.setName(user.getName());
            }
            if (user.getEmail() != null) {
                existingUser.setEmail(user.getEmail());
            }
            if (user.getFirebaseId() != null) {
                existingUser.setFirebaseId(user.getFirebaseId());
            }
            if (user.getProfile_pic() != null) {
                existingUser.setProfile_pic(user.getProfile_pic());
            }
            if (user.getBio() != null) {
                existingUser.setBio(user.getBio());
            }

            userRepository.save(existingUser);
            return new ResponseEntity<>(HttpStatus.OK); // Indicates successful update
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // User with provided ID not found
        }
    }


    public ResponseEntity<User> getUser(int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
