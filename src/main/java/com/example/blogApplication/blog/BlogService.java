package com.example.blogApplication.blog;

import com.example.blogApplication.DTOs.BlogCategoriesDTO;
import com.example.blogApplication.DTOs.BlogCreatorDTO;
import com.example.blogApplication.categories.Category;
import com.example.blogApplication.categories.CategoryRepository;
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
	private final CategoryRepository categoryRepository;


	@PersistenceContext
	private EntityManager entityManager;
	@Autowired
	public BlogService(BlogRepository blogRepositoryRepository, CategoryRepository categoryRepository) {
		this.blogRepository = blogRepositoryRepository;
		this.categoryRepository = categoryRepository;
	}


	public List<Blog> getBlogs() {
		// TODO Auto-generated method stub
		return blogRepository.findAll();
	}

	public List<BlogCreatorDTO> getBlogByCreator(int creatorId) {
		// TODO Auto-generated method stub
		String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
				"FROM Blog b LEFT JOIN b.creator u " +
				"WHERE u.id = :creatorId " +
				"ORDER BY b.created DESC" ;
		TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);
		query.setParameter("creatorId", creatorId);
		try {
			return query.getResultList();
		} catch (NoResultException e) {
			throw e; // Handle the case where the blog with the given ID doesn't exist.
		}
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
		Blog b = blogRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Blog Does Not Exist"));
		b.getCategories().clear();
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
			BlogCreatorDTO b = query.getSingleResult();
			for (Category c:categoryRepository.findAllByBlogsId(blogId)
				 ) {
				b.addCategories(c);
			}
			return b;
		} catch (NoResultException e) {
			throw e; // Handle the case where the blog with the given ID doesn't exist.
		}
	}

	public List<BlogCreatorDTO> getBlogsCreatorDtoDesc() {
		String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
				"FROM Blog b LEFT JOIN b.creator u " +
				"ORDER BY b.created DESC";
		TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);

		try {
			return query.getResultList();
		} catch (NoResultException e) {
			throw e; // Handle the case where the blog with the given ID doesn't exist.
		}
	}

	public List<BlogCreatorDTO> getBlogByCategory(int catId) {
//		String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
//				"FROM Blog b LEFT JOIN b.creator u " +
//				"LEFT JOIN b.categories cat " +
//				"WHERE cat.id = :catId "+
//				"ORDER BY b.created DESC";
//		TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);
		String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
				"FROM Blog b LEFT JOIN b.creator u " +
				"LEFT JOIN b.categories cat " +
				"WHERE cat.id = :catId "+
				"ORDER BY b.created DESC";

		TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);
		query.setParameter("catId", catId);

		try {
			return query.getResultList();
//			return null;
		} catch (NoResultException e) {
			throw e; // Handle the case where the blog with the given ID doesn't exist.
		}
	}


	public void addCategoryToBlog(String catId, String blogId) {
		Optional<Blog> b = blogRepository.findById(Integer.valueOf(blogId));
		if(!b.isPresent()){
			throw new IllegalArgumentException("The blog does not exist");
		}else{

		}
	}


	public void addCategoriesToBlog(BlogCategoriesDTO blogCategories) {
		Blog b = blogRepository.findById(blogCategories.getBlogId()).orElseThrow(()->{throw new IllegalArgumentException("Blog not found!!");});
		b.getCategories().clear();
		for (int c: blogCategories.getCategories()
			 ) {
			Category cat = categoryRepository.findById(c).orElseThrow(()->{throw new IllegalArgumentException("Category not found!!");});
			b.getCategories().add(cat);
		}
		blogRepository.save(b);
	}
}
