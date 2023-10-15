package com.example.blogApplication.blog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@CrossOrigin
@RestController
@RequestMapping(path = "api/v1/blog")
public class BlogController {
	
private BlogService blogService;
	
	@Autowired
	public BlogController(BlogService blogService) {
		this.blogService = blogService;
	}
	
	@GetMapping()
	public List<Blog> getAllBlogs() {
		return blogService.getBlogs();
	}
	
	
}
