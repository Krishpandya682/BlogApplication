package com.example.blogApplication.user;

import com.example.blogApplication.BlogApplication;
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

    @PostMapping()
    public ResponseEntity<String> addNewUser(@RequestBody User user) {

        return userService.addNewUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return userService.getUser(Integer.parseInt(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return userService.deleteUser(Integer.parseInt(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable String id, @RequestBody User user) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return userService.updateUser(Integer.parseInt(id), user);
    }
}
