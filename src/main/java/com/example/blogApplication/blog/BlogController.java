package com.example.blogApplication.blog;

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
        return blogService.getBlogByCreator(Integer.parseInt(creatorId));
    }


    @PostMapping("/{userId}")
    public ResponseEntity<Integer> addNewBlog(@PathVariable int userId, @RequestBody Blog blog) {
        ResponseEntity<User> userResponse = userService.getUser(userId);
        if (userResponse.getStatusCode() == HttpStatus.OK) {
            User creator = userResponse.getBody();
            blog.setCreator(creator);
            return blogService.addNewBlog(blog);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlog(@PathVariable int id) {
        return blogService.getBlog(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable int id) {
        return blogService.deleteBlog(id);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBlog(@PathVariable int id, @RequestBody Blog blog) {
        return blogService.updateBlog(id, blog);
    }

    @GetMapping("/user/{userId}/blogs")
    public ResponseEntity<List<BlogCreatorDTO>> getAllBlogsByUser(@PathVariable(value = "userId") int userId) {
        try {
            userService.getUser(userId);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return blogService.getBlogByCreator(userId);
    }


    @GetMapping("/category/{catId}/blogs")
    public ResponseEntity<List<BlogCreatorDTO>> getAllBlogsByCategory(@PathVariable(value = "catId") int catId) {
        try {
            categoryService.getCategoryById(catId);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return blogService.getBlogByCategory(catId);

    }


    @GetMapping("/{blogId}/BlogCreatorInfo")
    public ResponseEntity<BlogCreatorDTO> getBlogAndCreator(@PathVariable int blogId) {
        return blogService.getBlogAndCreator(blogId);
    }

}
