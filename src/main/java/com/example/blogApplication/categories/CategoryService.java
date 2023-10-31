package com.example.blogApplication.categories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
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



	public int addNewCategory(Category category) {
		return categoryRepository.save(category).getId();
	}

	public void deleteCategory(int id) {
		categoryRepository.deleteById(id);
	}

	public void updateCategory(int id, Category category) {
		Optional<Category> c = categoryRepository.findById(id);

		if(!c.isPresent()){
			throw new IllegalArgumentException("Category does not exist");

		}else {
			c.get().setCategoryName(category.getCategoryName());
		}
		categoryRepository.save(c.get());

	}

	public Category findCategoryById(int catId) {
		return categoryRepository.findById(catId).orElseThrow();
	}

	public Optional<Category> getCategoryById(int id) {
		return categoryRepository.findById(id);
	}

	public List<Category> getCategories() {
		return categoryRepository.findAll();
	}

	public List<Category> getBlogCategories(int blogId) {
		return categoryRepository.findAllByBlogsId(blogId);
	}
}


