package com.example.blogApplication.comments;

import com.example.blogApplication.BlogApplication;
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
        if(!BlogApplication.isInteger(commentorId)){
            return ResponseEntity.badRequest().build();
        }
        return commentService.getCommentByCommentor(Integer.parseInt(commentorId));
    }

    @PostMapping("/blog/{blogId}/user/{userId}")
    public ResponseEntity<Integer> addNewComment(@PathVariable String blogId, @PathVariable String userId, @RequestBody Comment comment) {
        System.out.println("Calling posNewComment:-" + comment);
        if(!BlogApplication.isInteger(blogId)){
            return ResponseEntity.badRequest().build();
        }
        if(!BlogApplication.isInteger(userId)){
            return ResponseEntity.badRequest().build();
        }
        ResponseEntity<User> userResponse = userService.getUser(Integer.parseInt(userId));

        if (userResponse.getStatusCode().is2xxSuccessful()) {
            User commentor = userResponse.getBody();
            System.out.println("Commentor is:" + commentor);
            ResponseEntity<Blog> blogResponse = blogService.getBlog(Integer.parseInt(blogId));
            if (blogResponse.getStatusCode().is2xxSuccessful()) {
                Blog blog = blogResponse.getBody();

                System.out.println("Blog is:" + blog);
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
    public ResponseEntity<Comment> getComment(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return commentService.getComment(Integer.parseInt(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return commentService.deleteComment(Integer.parseInt(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Comment comment) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return commentService.updateComment(Integer.parseInt(id), comment);
    }

    @GetMapping("/user/{userId}/comments")
    public ResponseEntity<List<Comment>> getAllCommentsByUser(@PathVariable(value = "userId") String userId) {
        if (!BlogApplication.isInteger(userId)) {
            return ResponseEntity.badRequest().build();
        }
        ResponseEntity<List<Comment>> commentsByCommentor = commentService.getCommentByCommentor(Integer.parseInt(userId));

        if (commentsByCommentor.getStatusCode() == HttpStatus.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentsByCommentor;
    }

    @GetMapping("/user/{userId}/comments/{limit}")
    public ResponseEntity<List<Comment>> getAllCommentsByUserLimit(@PathVariable(value = "userId") String userId, @PathVariable(value = "limit") int limit) {
        if (!BlogApplication.isInteger(userId)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            userService.getUser(Integer.parseInt(userId));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentByCommentorLimit(Integer.parseInt(userId), limit);

    }


    @GetMapping("/blog/{blogId}/comments")
    public ResponseEntity<List<Comment>> getAllCommentsOnBlog(@PathVariable(value = "blogId") String blogId) {
        if (!BlogApplication.isInteger(blogId)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            blogService.getBlog(Integer.parseInt(blogId));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentOnBlog(Integer.parseInt(blogId));

    }

    @GetMapping("/blog/{blogId}/commentsWithUser")
    public ResponseEntity<List<CommentCommentorDTO>> getCommentsWithUsersOnBlog(@PathVariable(value = "blogId") String blogId) {
        if(!BlogApplication.isInteger(blogId)){
            return ResponseEntity.badRequest().build();
        }
        try {
            blogService.getBlog(Integer.parseInt(blogId));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentsWithUsersOnBlog(Integer.parseInt(blogId));

    }

    @GetMapping("/{commentId}/repliesWithUser")
    public ResponseEntity<List<CommentCommentorDTO>> getCommentsWithUsersReplies(@PathVariable(value = "commentId") String commentId) {
        if(!BlogApplication.isInteger(commentId)){
            return ResponseEntity.badRequest().build();
        }
        try {
            commentService.getComment(Integer.parseInt(commentId));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return commentService.getCommentsWithUsersReplies(Integer.parseInt(commentId));

    }

    @GetMapping("/{commentId}/CommentCommentorInfo")
    public ResponseEntity<CommentCommentorDTO> getCommentAndCommentor(@PathVariable String commentId) {
        if(!BlogApplication.isInteger(commentId)){
            return ResponseEntity.badRequest().build();
        }
        return commentService.getCommentAndCommentor(Integer.parseInt(commentId));
    }

    @GetMapping("/{commentId}/NumReplies")
    public ResponseEntity<Integer> getRepliesCount(@PathVariable String commentId) {
        if(!BlogApplication.isInteger(commentId)){
            return ResponseEntity.badRequest().build();
        }
        return commentService.getRepliesCount(Integer.parseInt(commentId));


    }
}
