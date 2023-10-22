package com.example.blogApplication.comments;

import com.example.blogApplication.blog.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findAllByCommentorIdOrderByCreatedDesc(int creatorId);

    List<Comment> findAllByOrderByCreatedDesc();

    List<Comment> findAllByBlogIdOrderByCreatedDesc(int blogId);
}
