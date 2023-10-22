package com.example.blogApplication.blog;

import com.example.blogApplication.DTOs.BlogCreatorDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

	private final BlogRepository blogRepository;


	@PersistenceContext
	private EntityManager entityManager;
	@Autowired
	public BlogService(BlogRepository blogRepositoryRepository) {
		this.blogRepository = blogRepositoryRepository;
	}


	public List<Blog> getBlogs() {
		// TODO Auto-generated method stub
		return blogRepository.findAll();
	}

	public List<Blog> getBlogByCreator(int creatorId) {
		// TODO Auto-generated method stub
		return blogRepository.findAllByCreatorIdOrderByCreatedDesc(creatorId);
	}

	public int addNewBlog(Blog blog) {

		return blogRepository.save(blog).getId();

	}

	public List<Blog> getBlogsDesc() {
		return blogRepository.findAllByOrderByCreatedDesc();
	}

	public Blog getBlog(int id) {
		Optional<Blog> blog = blogRepository.findById(id);
		if (!blog.isPresent()) {
			throw new IllegalArgumentException("Blog does not exist");
		} else {
			return blog.get();
		}
	}

	public void deleteBlog(int id) {
		blogRepository.deleteById(id);
	}

	public void updateBlog(int id, Blog blog) {
		Blog b = blogRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Blog does not exist with id: " + id));
		if (blog.getUrl() != null) {
			b.setUrl(blog.getUrl());
		}

		if (blog.getTitle() != null) {
			b.setTitle(blog.getTitle());
		}

		if (blog.getContent() != null) {
			b.setContent(blog.getContent());
		}
		blogRepository.save(b);
	}


	public BlogCreatorDTO getBlogAndCreator(int blogId) {
		String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
				"FROM Blog b LEFT JOIN b.creator u " +
				"WHERE b.id = :blogId";
		TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);
		query.setParameter("blogId", blogId);
		try {
			return query.getSingleResult();
		} catch (NoResultException e) {
			throw e; // Handle the case where the blog with the given ID doesn't exist.
		}
	}

	public List<BlogCreatorDTO> getBlogsCreatorDtoDesc() {
		String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
				"FROM Blog b LEFT JOIN b.creator u ORDER BY b.created DESC";
		TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);

		try {
			return query.getResultList();
		} catch (NoResultException e) {
			throw e; // Handle the case where the blog with the given ID doesn't exist.
		}
	}
}
