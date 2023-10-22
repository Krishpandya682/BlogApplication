package com.example.blogApplication.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository){

		this.userRepository = userRepository;

	}
	public List<User> getUsers() {
		return userRepository.findAll();
	}

	public void addNewUser(User user) {

		if(userRepository.findByEmail(user.getEmail()).isPresent()){
			throw new IllegalArgumentException("Email already exists");
		};
		userRepository.save(user);

	}

	public User getFbUser(String firebaseId) {
		Optional<User> user = userRepository.findByFirebaseId(firebaseId);
		if (!user.isPresent()) {
			throw new IllegalArgumentException("User does not exist");
		} else {
			return user.get();
		}

	}

	public void deleteUser(int userId) {
		userRepository.deleteById(userId);
	}

	public void updateUser(int id, User user) {
		User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User does not exist with id: " + id));

		if (user.getName() != null) {
			u.setName(user.getName());
		}
		if (user.getEmail() != null) {
			u.setEmail(user.getEmail());
		}
		if (user.getFirebaseId() != null) {
			u.setFirebaseId(user.getFirebaseId());
		}
		userRepository.save(u);
	}

	public User getUser(int id) {
		return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User does not exist with id:" + id));
	}


}
