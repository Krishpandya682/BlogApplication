package com.example.blogApplication.blog;

import com.example.blogApplication.DTOs.BlogCreatorDTO;
import com.example.blogApplication.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "api/v1/blog")
public class BlogController {

	private final BlogService blogService;

	private final UserService userService;
	
	@Autowired
	public BlogController(BlogService blogService, UserService userService) {
		this.blogService = blogService;
		this.userService = userService;
	}

	@GetMapping()
	public List<Blog> getAllBlogs() {
		return blogService.getBlogs();
	}

	@GetMapping("/desc")
	public List<Blog> getAllBlogsDesc() {
		return blogService.getBlogsDesc();
	}

	@GetMapping("/getBlogCardsInfo")
	public List<BlogCreatorDTO> getAllBlogCardsDesc() {
		return blogService.getBlogsCreatorDtoDesc();
	}

	@GetMapping("/byCreator/{creatorId}")
	public List<Blog> getBlogByCreator(@PathVariable String creatorId) {
		return blogService.getBlogByCreator(Integer.parseInt(creatorId));
	}

	@PostMapping("/{userId}")
	public int addNewBlog(@PathVariable int userId, @RequestBody Blog blog) {
		blog.setCreator(userService.getUser(userId));
		return blogService.addNewBlog(blog);
	}

	@GetMapping("/{id}")
	public Blog getBlog(@PathVariable int id) {
		return blogService.getBlog(id);
	}

	@DeleteMapping("/{id}")
	public void deleteBlog(@PathVariable int id) {
		blogService.deleteBlog(id);
	}

	@PutMapping("/{id}")
	public void updateBlog(@PathVariable int id, @RequestBody Blog blog) {
		blogService.updateBlog(id, blog);
	}

	@GetMapping("/user/{userId}/blogs")
	public List<Blog> getAllBlogsByUser(@PathVariable(value = "userId") int userId) {
		try {
			userService.getUser(userId);
		} catch (Error e) {
			throw e;
		}

		List<Blog> blogs = blogService.getBlogByCreator(userId);
		return blogs;
	}

	@GetMapping("/{blogId}/BlogCreatorInfo")
	public BlogCreatorDTO getBlogAndCreator(@PathVariable int blogId) {
		return blogService.getBlogAndCreator(blogId);
	}

}
