package com.example.blogApplication.comments;

import com.example.blogApplication.DTOs.CommentCommentorDTO;
import com.example.blogApplication.blog.Blog;
import com.example.blogApplication.blog.BlogService;
import com.example.blogApplication.user.User;
import com.example.blogApplication.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "api/v1/comment")
public class CommentController {

    private final CommentService commentService;
    private final BlogService blogService;

    private final UserService userService;


    public CommentController(CommentService commentService, BlogService blogService, UserService userService) {
        this.commentService = commentService;
        this.blogService = blogService;
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<Comment>> getAllComments() {
        return commentService.getComments();
    }

    @GetMapping("/desc")
    public ResponseEntity<List<Comment>> getAllCommentsDesc() {
        return commentService.getCommentsDesc();
    }

    @GetMapping("/getCommentCardsInfo")
    public ResponseEntity<List<CommentCommentorDTO>> getAllCommentCardsDesc() {
        return commentService.getCommentsCommentorDtoDesc();
    }

    @GetMapping("/byCommentor/{commentorId}")
    public ResponseEntity<List<Comment>> getCommentByCommentor(@PathVariable String commentorId) {
        return commentService.getCommentByCommentor(Integer.parseInt(commentorId));
    }

    public ResponseEntity<Integer> addNewComment(int blogId, int userId, Comment comment) {
        ResponseEntity<User> userResponse = userService.getUser(userId);

        if (userResponse.getStatusCode().is2xxSuccessful()) {
            User commentor = userResponse.getBody();

            ResponseEntity<Blog> blogResponse = blogService.getBlog(blogId);
            if (blogResponse.getStatusCode().is2xxSuccessful()) {
                Blog blog = blogResponse.getBody();
                comment.setCommentor(commentor);
                comment.setBlog(blog);
                int newCommentId = commentService.addNewComment(comment);
                return new ResponseEntity<>(newCommentId, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getComment(@PathVariable int id) {
        return commentService.getComment(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable int id) {
        return commentService.deleteComment(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable int id, @RequestBody Comment comment) {
        return commentService.updateComment(id, comment);
    }

    @GetMapping("/user/{userId}/comments")
    public ResponseEntity<List<Comment>> getAllCommentsByUser(@PathVariable(value = "userId") int userId) {
        ResponseEntity<List<Comment>> commentsByCommentor = commentService.getCommentByCommentor(userId);

        if (commentsByCommentor.getStatusCode() == HttpStatus.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentsByCommentor;
    }

    @GetMapping("/user/{userId}/comments/{limit}")
    public ResponseEntity<List<Comment>> getAllCommentsByUserLimit(@PathVariable(value = "userId") int userId, @PathVariable(value = "limit") int limit) {
        try {
            userService.getUser(userId);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentByCommentorLimit(userId, limit);

    }


    @GetMapping("/blog/{blogId}/comments")
    public ResponseEntity<List<Comment>> getAllCommentsOnBlog(@PathVariable(value = "blogId") int blogId) {
        try {
            blogService.getBlog(blogId);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentOnBlog(blogId);

    }

    @GetMapping("/blog/{blogId}/commentsWithUser")
    public ResponseEntity<List<CommentCommentorDTO>> getCommentsWithUsersOnBlog(@PathVariable(value = "blogId") int blogId) {
        try {
            blogService.getBlog(blogId);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentsWithUsersOnBlog(blogId);

    }

    @GetMapping("/{commentId}/repliesWithUser")
    public ResponseEntity<List<CommentCommentorDTO>> getCommentsWithUsersReplies(@PathVariable(value = "commentId") int commentId) {
        try {
            commentService.getComment(commentId);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentsWithUsersReplies(commentId);

    }

    @GetMapping("/{commentId}/CommentCommentorInfo")
    public ResponseEntity<CommentCommentorDTO> getCommentAndCommentor(@PathVariable int commentId) {
        return commentService.getCommentAndCommentor(commentId);
    }

    @GetMapping("/{commentId}/NumReplies")
    public ResponseEntity<Integer> getRepliesCount(@PathVariable int commentId) {
        return commentService.getRepliesCount(commentId);


    }
}
