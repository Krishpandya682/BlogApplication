package com.example.blogApplication.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

//    @Query("SELECT * FROM User u WHERE u.Email = ?1")
    Optional<User> findByEmail(String email);

    Optional<User> findByFirebaseId(String firebaseId);

}
