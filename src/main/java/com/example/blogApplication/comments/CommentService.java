package com.example.blogApplication.comments;

import com.example.blogApplication.DTOs.CommentCommentorDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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


    public ResponseEntity<List<Comment>> getComments() {
        List<Comment> comments = commentRepository.findAll();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }


    public ResponseEntity<List<Comment>> getCommentByCommentor(int commentorId) {
        List<Comment> comments = commentRepository.findAllByCommentorIdOrderByCreatedDesc(commentorId, Pageable.unpaged());
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    public int addNewComment(Comment comment) {

        return commentRepository.save(comment).getId();

    }

    public ResponseEntity<List<Comment>> getCommentsDesc() {
        List<Comment> comments = commentRepository.findAllByOrderByCreatedDesc();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    public ResponseEntity<Comment> getComment(int id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            return new ResponseEntity<>(comment.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Void> deleteComment(int id) {
        ResponseEntity<List<CommentCommentorDTO>> repliesResponse = this.getCommentsWithUsersReplies(id);

        if (repliesResponse.getStatusCode() == HttpStatus.OK) {
            List<CommentCommentorDTO> replies = repliesResponse.getBody();
            for (CommentCommentorDTO reply : replies) {
                deleteComment(reply.getComment_id());
            }
        } else if (repliesResponse.getStatusCode() == HttpStatus.NOT_FOUND) {
            // No replies found, proceed with comment deletion
            commentRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Indicates successful deletion
        }

        commentRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Indicates successful deletion
    }

    public ResponseEntity<Comment> updateComment(int id, Comment comment) {
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment does not exist with id: " + id));

        if (comment.getComment() != null) {
            existingComment.setComment(comment.getComment());
        }

        Comment updatedComment = commentRepository.save(existingComment);
        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
    }


    public ResponseEntity<CommentCommentorDTO> getCommentAndCommentor(int commentId) {
        String jpqlQuery = "SELECT NEW com.example.commentApplication.DTOs.CommentCommentorDTO(b.id, u.name, b.updated, b.id, u.id, u.profile_pic, b.comment, b.replyTo) " +
                "FROM Comment b JOIN b.commentor u " +
                "WHERE b.id = :commentId";
        TypedQuery<CommentCommentorDTO> query = entityManager.createQuery(jpqlQuery, CommentCommentorDTO.class);
        query.setParameter("commentId", commentId);

        try {
            CommentCommentorDTO commentInfo = query.getSingleResult();
            return new ResponseEntity<>(commentInfo, HttpStatus.OK);
        } catch (NoResultException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    public ResponseEntity<List<CommentCommentorDTO>> getCommentsCommentorDtoDesc() {
        String jpqlQuery = "SELECT NEW com.example.commentApplication.DTOs.CommentCommentorDTO( b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
                "FROM Comment b JOIN b.commentor u ORDER BY b.created DESC";
        TypedQuery<CommentCommentorDTO> query = entityManager.createQuery(jpqlQuery, CommentCommentorDTO.class);

        List<CommentCommentorDTO> comments = query.getResultList();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    public ResponseEntity<List<Comment>> getCommentOnBlog(int blogId) {
        List<Comment> comments = commentRepository.findAllByBlogIdOrderByCreatedDesc(blogId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    public ResponseEntity<List<CommentCommentorDTO>> getCommentsWithUsersOnBlog(int blogId) {
        String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.CommentCommentorDTO(c.id, u.name, c.updated, b.id, u.id, u.profile_pic, c.comment, c.replyTo) " +
                "FROM Comment c JOIN c.commentor u " +
                "JOIN c.blog b " +
                "WHERE b.id = :blogId " +
                "AND c.replyTo = -1 " +
                "ORDER BY c.created DESC ";
        TypedQuery<CommentCommentorDTO> query = entityManager.createQuery(jpqlQuery, CommentCommentorDTO.class);
        query.setParameter("blogId", blogId);

        List<CommentCommentorDTO> commentsWithUsers = query.getResultList();
        return new ResponseEntity<>(commentsWithUsers, HttpStatus.OK);
    }

    public ResponseEntity<List<Comment>> getCommentByCommentorLimit(int commentorId, int limit) {
        List<Comment> comments = commentRepository.findAllByCommentorIdOrderByCreatedDesc(commentorId, PageRequest.of(0, limit));
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    public ResponseEntity<List<CommentCommentorDTO>> getCommentsWithUsersReplies(int commentId) {
        String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.CommentCommentorDTO(c.id, u.name, c.updated, b.id, u.id, u.profile_pic, c.comment, c.replyTo) " +
                "FROM Comment c JOIN c.commentor u " +
                "JOIN c.blog b " +
                "WHERE c.replyTo = :commentId " +
                "ORDER BY c.created DESC ";
        TypedQuery<CommentCommentorDTO> query = entityManager.createQuery(jpqlQuery, CommentCommentorDTO.class);
        query.setParameter("commentId", commentId);

        List<CommentCommentorDTO> commentRepliesWithUsers = query.getResultList();
        return new ResponseEntity<>(commentRepliesWithUsers, HttpStatus.OK);
    }

    public ResponseEntity<Integer> getRepliesCount(int commentId) {
        if (commentRepository.existsById(commentId)) {
            int count = commentRepository.countByReplyTo(commentId);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
