package com.example.blogApplication.user;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

	@PostMapping
	public void addNewUser(@RequestBody User user){
		userService.addNewUser(user);
	}
}
