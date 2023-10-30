package com.example.blogApplication.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "api/v1/user")
public class UserController {

	private UserService userService;
	
	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping()
	public List<User> getAllUsers() {
		return userService.getUsers();

	}

	@GetMapping("/fbUser/{firebaseId}")
	public User getFirebaseUsers(@PathVariable String firebaseId) {
		return userService.getFbUser(firebaseId);
	}

	@PostMapping
	public void addNewUser(@RequestBody User user){
		userService.addNewUser(user);
	}

	@GetMapping("/{id}")
	public User getUser(@PathVariable int id) {
		return userService.getUser(id);
	}

	@DeleteMapping("/{id}")
	public void deleteUser(@PathVariable int id) {
		userService.deleteUser(id);
	}

	@PutMapping("/{id}")
	public void updateUser(@PathVariable int id, @RequestBody User user) {

		System.out.println(user);
		userService.updateUser(id, user);
	}
}
