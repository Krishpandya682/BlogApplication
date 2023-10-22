package com.example.blogApplication.comments;

import com.example.blogApplication.DTOs.CommentCommentorDTO;
import com.example.blogApplication.blog.BlogService;
import com.example.blogApplication.user.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
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
    public List<Comment> getAllComments() {
        return commentService.getComments();
    }

    @GetMapping("/desc")
    public List<Comment> getAllCommentsDesc() {
        return commentService.getCommentsDesc();
    }

    @GetMapping("/getCommentCardsInfo")
    public List<CommentCommentorDTO> getAllCommentCardsDesc() {
        return commentService.getCommentsCommentorDtoDesc();
    }

    @GetMapping("/byCommentor/{commentorId}")
    public List<Comment> getCommentByCommentor(@PathVariable String commentorId) {
        return commentService.getCommentByCommentor(Integer.parseInt(commentorId));
    }

    @PostMapping("/blog/{blogId}/user/{userId}")
    public int addNewComment(@PathVariable(value = "userId") int userId,@PathVariable(value = "blogId") int blogId, @RequestBody Comment comment) {
        comment.setCommentor(userService.getUser(userId));
        comment.setBlog(blogService.getBlog(blogId));
        return commentService.addNewComment(comment);
    }

    @GetMapping("/{id}")
    public Comment getComment(@PathVariable int id) {
        return commentService.getComment(id);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable int id) {
        commentService.deleteComment(id);
    }

    @PutMapping("/{id}")
    public void updateComment(@PathVariable int id, @RequestBody Comment comment) {
        commentService.updateComment(id, comment);
    }

    @GetMapping("/user/{userId}/comments")
    public List<Comment> getAllCommentsByUser(@PathVariable(value = "userId") int userId) {
        try {
            userService.getUser(userId);
        } catch (Error e) {
            throw e;
        }

        List<Comment> comments = commentService.getCommentByCommentor(userId);
        return comments;
    }
    @GetMapping("/blog/{blogId}/comments")
    public List<Comment> getAllCommentsOnBlog(@PathVariable(value = "blogId") int blogId) {
        try {
            blogService.getBlog(blogId);
        } catch (Error e) {
            throw e;
        }

        List<Comment> comments = commentService.getCommentOnBlog(blogId);
        return comments;
    }

    @GetMapping("/{commentId}/CommentCommentorInfo")
    public CommentCommentorDTO getCommentAndCommentor(@PathVariable int commentId) {
        return commentService.getCommentAndCommentor(commentId);


    }
}
