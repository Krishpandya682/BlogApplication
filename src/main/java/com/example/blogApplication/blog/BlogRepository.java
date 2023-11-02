package com.example.blogApplication.blog;

import com.example.blogApplication.DTOs.BlogCreatorDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {

    List<Blog> findAllByCreatorIdOrderByCreatedDesc(int creatorId);

    List<Blog> findAllByOrderByCreatedDesc();

}
