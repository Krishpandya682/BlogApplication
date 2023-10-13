package com.example.blogApplication.blog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BlogService {

	private final BlogRepository blogRepository;

	@Autowired
	public BlogService(BlogRepository blogRepositoryRepository) {
		this.blogRepository = blogRepositoryRepository;
	}


	public List<Blog> getBlogs() {
		// TODO Auto-generated method stub
		return blogRepository.findAll();
	}
}
