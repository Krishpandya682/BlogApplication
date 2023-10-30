package com.example.blogApplication.comments;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findAllByCommentorIdOrderByCreatedDesc(int creatorId, Pageable pageable);

    List<Comment> findAllByOrderByCreatedDesc();

    List<Comment> findAllByBlogIdOrderByCreatedDesc(int blogId);

    int countByReplyTo(int replyTo);
}
