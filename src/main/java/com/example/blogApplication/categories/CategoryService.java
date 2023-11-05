package com.example.blogApplication.categories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;


    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    public ResponseEntity<Integer> addNewCategory(Category category) {
        int newCategoryId = categoryRepository.save(category).getId();
        return new ResponseEntity<>(newCategoryId, HttpStatus.CREATED);
    }

    public ResponseEntity<Void> deleteCategory(int id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Void> updateCategory(int id, Category category) {
        Optional<Category> c = categoryRepository.findById(id);

        if (c.isPresent()) {
            c.get().setCategoryName(category.getCategoryName());
            categoryRepository.save(c.get());
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Category findCategoryById(int catId) {
        return categoryRepository.findById(catId).orElseThrow();
    }

    public ResponseEntity<Category> getCategoryById(int id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            return new ResponseEntity<>(category.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryRepository.findAll();
        if (!categories.isEmpty()) {
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<Category>> getBlogCategories(int blogId) {
        List<Category> categories = categoryRepository.findAllByBlogsId(blogId);
        if (categories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(categories, HttpStatus.OK);
        }
    }
}


