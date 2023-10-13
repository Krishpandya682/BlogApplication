package com.example.blogApplication.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table
public class User {
	
	@Id
	@SequenceGenerator(
			name = "user_sequence",
			sequenceName = "user_sequence",
			allocationSize = 1
			)
	@GeneratedValue(
			strategy = GenerationType.SEQUENCE,
			generator = "user_sequence"
			)
    private int id;           // User's unique identifier

    private String name;      // User's name

    private String firebaseId; // User's Firebase ID

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    private String email;
    public User(){}


    // Constructor to create a User object
    public User(String name, int id, String firebaseId, String email) {
        this.name = name;
        this.id = id;
        this.firebaseId = firebaseId;
        this.email = email;
    }
    // Getter method for retrieving the user's name
    public String getName() {
        return name;
    }

    // Setter method to update the user's name
    public void setName(String name) {
        this.name = name;
    }

    // Getter method for retrieving the user's unique identifier
    public int getId() {
        return id;
    }

    // Setter method to update the user's unique identifier
    public void setId(int id) {
        this.id = id;
    }

    // Getter method for retrieving the user's Firebase ID
    public String getFirebaseId() {
        return firebaseId;
    }

    // Setter method to update the user's Firebase ID
    public void setFirebaseId(String firebaseId) {
        this.firebaseId = firebaseId;
    }

    // A method to provide a string representation of the User object
    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", id=" + id +
                ", firebaseId='" + firebaseId + '\'' +
                '}';
    }
}