package com.example.blogApplication.blog;

import com.example.blogApplication.BlogApplication;
import com.example.blogApplication.DTOs.BlogCreatorDTO;
import com.example.blogApplication.categories.CategoryService;
import com.example.blogApplication.user.User;
import com.example.blogApplication.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "api/v1/blog")
public class BlogController {

    private final BlogService blogService;

    private final UserService userService;
    private final CategoryService categoryService;


    @Autowired
    public BlogController(BlogService blogService, UserService userService, CategoryService categoryService) {
        this.blogService = blogService;
        this.userService = userService;
        this.categoryService = categoryService;
    }

    @GetMapping()
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return blogService.getBlogs();
    }

    @GetMapping("/desc")
    public ResponseEntity<List<Blog>> getAllBlogsDesc() {
        return blogService.getBlogsDesc();
    }

    @GetMapping("/getBlogCardsInfo")
    public ResponseEntity<List<BlogCreatorDTO>> getAllBlogCardsDesc() {
        return blogService.getBlogsCreatorDtoDesc();
    }

    @GetMapping("/byCreator/{creatorId}")
    public ResponseEntity<List<BlogCreatorDTO>> getBlogByCreator(@PathVariable String creatorId) {
        if (!BlogApplication.isInteger(creatorId)) {
            return ResponseEntity.badRequest().build();
        }
        return blogService.getBlogByCreator(Integer.parseInt(creatorId));
    }


    @PostMapping("/{userId}")
    public ResponseEntity<Integer> addNewBlog(@PathVariable String userId, @RequestBody Blog blog) {
        if (!BlogApplication.isInteger(userId)) {
            return ResponseEntity.badRequest().build();
        }
        ResponseEntity<User> userResponse = userService.getUser(Integer.parseInt(userId));
        if (userResponse.getStatusCode() == HttpStatus.OK) {
            User creator = userResponse.getBody();
            blog.setCreator(creator);
            return blogService.addNewBlog(blog);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlog(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return blogService.getBlog(Integer.parseInt(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return blogService.deleteBlog(Integer.parseInt(id));

    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBlog(@PathVariable String id, @RequestBody Blog blog) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return blogService.updateBlog(Integer.parseInt(id), blog);
    }

    @GetMapping("/user/{userId}/blogs")
    public ResponseEntity<List<BlogCreatorDTO>> getAllBlogsByUser(@PathVariable(value = "userId") String userId) {
        if (!BlogApplication.isInteger(userId)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            userService.getUser(Integer.parseInt(userId));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return blogService.getBlogByCreator(Integer.parseInt(userId));
    }


    @GetMapping("/category/{catId}/blogs")
    public ResponseEntity<List<BlogCreatorDTO>> getAllBlogsByCategory(@PathVariable(value = "catId") String catId) {
        if (!BlogApplication.isInteger(catId)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            categoryService.getCategoryById(Integer.parseInt(catId));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return blogService.getBlogByCategory(Integer.parseInt(catId));

    }


    @GetMapping("/{blogId}/BlogCreatorInfo")
    public ResponseEntity<BlogCreatorDTO> getBlogAndCreator(@PathVariable String blogId) {
        if (!BlogApplication.isInteger(blogId)) {
            return ResponseEntity.badRequest().build();
        }
        return blogService.getBlogAndCreator(Integer.parseInt(blogId));
    }

}
