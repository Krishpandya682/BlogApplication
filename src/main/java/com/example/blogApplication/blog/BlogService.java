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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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


    public ResponseEntity<List<Blog>> getBlogs() {
        List<Blog> blogs = blogRepository.findAll();
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }

    public ResponseEntity<List<BlogCreatorDTO>> getBlogByCreator(int creatorId) {
        String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
                "FROM Blog b LEFT JOIN b.creator u " +
                "WHERE u.id = :creatorId " +
                "ORDER BY b.created DESC";
        TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);
        query.setParameter("creatorId", creatorId);
        try {
            List<BlogCreatorDTO> blogs = query.getResultList();
            return new ResponseEntity<>(blogs, HttpStatus.OK);
        } catch (NoResultException e) {
            // Handle the case where the blog with the given ID doesn't exist.
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    public ResponseEntity<Integer> addNewBlog(Blog blog) {
        int newBlogId = blogRepository.save(blog).getId();
        return new ResponseEntity<>(newBlogId, HttpStatus.CREATED);
    }

    public ResponseEntity<List<Blog>> getBlogsDesc() {
        List<Blog> blogs = blogRepository.findAllByOrderByCreatedDesc();
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }

    public ResponseEntity<Blog> getBlog(int id) {
        Optional<Blog> blog = blogRepository.findById(id);

        if (blog.isPresent()) {
            return new ResponseEntity<>(blog.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Void> deleteBlog(int id) {
        if (!blogRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Blog b = blogRepository.findById(id).get();
        b.getCategories().clear();  // Assuming this is intended to clear categories
        blogRepository.deleteById(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

// Assuming this code is inside a service or controller class

    public ResponseEntity<Void> updateBlog(int id, Blog blog) {
        Blog b = blogRepository.findById(id).orElse(null);
        if (b == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

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
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<BlogCreatorDTO> getBlogAndCreator(int blogId) {
        String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
                "FROM Blog b LEFT JOIN b.creator u " +
                "WHERE b.id = :blogId";
        TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);
        query.setParameter("blogId", blogId);

        try {
            BlogCreatorDTO b = query.getSingleResult();
            for (Category c : categoryRepository.findAllByBlogsId(blogId)) {
                b.addCategories(c);
            }
            return new ResponseEntity<>(b, HttpStatus.OK);
        } catch (NoResultException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<BlogCreatorDTO>> getBlogsCreatorDtoDesc() {
        String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
                "FROM Blog b LEFT JOIN b.creator u " +
                "ORDER BY b.created DESC";
        TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);

        try {
            List<BlogCreatorDTO> blogCreatorDTOs = query.getResultList();
            return new ResponseEntity<>(blogCreatorDTOs, HttpStatus.OK);
        } catch (NoResultException e) {
            // Handle the case where the blog with the given ID doesn't exist.
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

// Assuming this code is inside a service class

    public ResponseEntity<List<BlogCreatorDTO>> getBlogByCategory(int catId) {
        String jpqlQuery = "SELECT NEW com.example.blogApplication.DTOs.BlogCreatorDTO(b.title, u.name, b.updated, b.id, u.id, b.url, u.profile_pic, b.content) " +
                "FROM Blog b LEFT JOIN b.creator u " +
                "LEFT JOIN b.categories cat " +
                "WHERE cat.id = :catId " +
                "ORDER BY b.created DESC";

        TypedQuery<BlogCreatorDTO> query = entityManager.createQuery(jpqlQuery, BlogCreatorDTO.class);
        query.setParameter("catId", catId);

        try {
            List<BlogCreatorDTO> blogs = query.getResultList();
            return new ResponseEntity<>(blogs, HttpStatus.OK);
        } catch (NoResultException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    public void addCategoryToBlog(String catId, String blogId) {
        Optional<Blog> b = blogRepository.findById(Integer.valueOf(blogId));
        if (!b.isPresent()) {
            throw new IllegalArgumentException("The blog does not exist");
        } else {

        }
    }

    public ResponseEntity<Void> addCategoriesToBlog(BlogCategoriesDTO blogCategories) {
        try {
            Blog b = blogRepository.findById(blogCategories.getBlogId()).orElseThrow(() -> new IllegalArgumentException("Blog not found"));
            b.getCategories().clear();
            for (int c : blogCategories.getCategories()) {
                Category cat = categoryRepository.findById(c).orElseThrow(() -> new IllegalArgumentException("Category not found"));
                b.getCategories().add(cat);
            }
            blogRepository.save(b);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
