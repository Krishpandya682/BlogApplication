package com.example.blogApplication.comments;

import com.example.blogApplication.DTOs.CommentCommentorDTO;
import com.example.blogApplication.comments.Comment;
import com.example.blogApplication.comments.CommentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;


    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    public CommentService(CommentRepository commentRepositoryRepository) {
        this.commentRepository = commentRepositoryRepository;
    }


    public List<Comment> getComments() {
        // TODO Auto-generated method stub
        return commentRepository.findAll();
    }

    public List<Comment> getCommentByCommentor(int commentorId) {
        // TODO Auto-generated method stub
        return commentRepository.findAllByCommentorIdOrderByCreatedDesc(commentorId);
    }

    public int addNewComment(Comment comment) {

        return commentRepository.save(comment).getId();

    }

    public List<Comment> getCommentsDesc() {
        return commentRepository.findAllByOrderByCreatedDesc();
    }

    public Comment getComment(int id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (!comment.isPresent()) {
            throw new IllegalArgumentException("Comment does not exist");
        } else {
            return comment.get();
        }
    }

    public void deleteComment(int id) {
        commentRepository.deleteById(id);
    }

    public void updateComment(int id, Comment comment) {
        Comment b = commentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Comment does not exist with id: " + id));
        if (comment.getComment() != null) {
            b.setComment(comment.getComment());
        }
        commentRepository.save(b);
    }


    public CommentCommentorDTO getCommentAndCommentor(int commentId) {
        String jpqlQuery = "SELECT NEW com.example.commentApplication.DTOs.CommentCommentorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
                "FROM Comment b LEFT JOIN b.commentor u " +
                "WHERE b.id = :commentId";
        TypedQuery<CommentCommentorDTO> query = entityManager.createQuery(jpqlQuery, CommentCommentorDTO.class);
        query.setParameter("commentId", commentId);
        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            throw e; // Handle the case where the comment with the given ID doesn't exist.
        }
    }

    public List<CommentCommentorDTO> getCommentsCommentorDtoDesc() {
        String jpqlQuery = "SELECT NEW com.example.commentApplication.DTOs.CommentCommentorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
                "FROM Comment b LEFT JOIN b.commentor u ORDER BY b.created DESC";
        TypedQuery<CommentCommentorDTO> query = entityManager.createQuery(jpqlQuery, CommentCommentorDTO.class);

        try {
            return query.getResultList();
        } catch (NoResultException e) {
            throw e; // Handle the case where the comment with the given ID doesn't exist.
        }
    }

    public List<Comment> getCommentOnBlog(int blogId) {
        return commentRepository.findAllByBlogIdOrderByCreatedDesc(blogId);
    }
}
