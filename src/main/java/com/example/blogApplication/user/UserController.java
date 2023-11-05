package com.example.blogApplication.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "api/v1/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getUsers();

    }

    @GetMapping("/fbUser/{firebaseId}")
    public ResponseEntity<User> getFirebaseUsers(@PathVariable String firebaseId) {
        return userService.getFbUser(firebaseId);
    }

    @PostMapping
    public ResponseEntity<String> addNewUser(@RequestBody User user) {
        return userService.addNewUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable int id) {
        return userService.getUser(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable int id, @RequestBody User user) {

        return userService.updateUser(id, user);
    }
}
