package com.example.blogApplication.categories;

import com.example.blogApplication.DTOs.BlogCategoriesDTO;
import com.example.blogApplication.blog.Blog;
import com.example.blogApplication.blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "api/v1/category")
public class CategoryController {

	private final CategoryService categoryService;

	private final BlogService blogService;
	
	@Autowired
	public CategoryController(CategoryService categoryService, BlogService blogService) {
		this.blogService = blogService;
		this.categoryService = categoryService;
	}

	@GetMapping("/blogByCategory/{catId}")
	public List<Blog> getBlogByCategory(@PathVariable String catId) {
		return blogService.getBlogByCategory(Integer.parseInt(catId));
//		return null;
	}


	@GetMapping("/blogCategories/{blogId}")
	public List<Category> getBlogCategories(@PathVariable String blogId) {
		return categoryService.getBlogCategories(Integer.parseInt(blogId));
//		return null;
	}




	@PostMapping("/{blogId}/{catId}")
	public void addCategoryToBlog(@PathVariable String catId, @PathVariable String blogId) {
		categoryService.findCategoryById(Integer.parseInt(catId));
		 blogService.addCategoryToBlog(catId, blogId);
	}

	@PostMapping("/")
	public int addNewBlog( @RequestBody Category category) {

		return categoryService.addNewCategory(category);
	}

	@DeleteMapping("/{id}")
	public void deleteCategory(@PathVariable int id) {
		categoryService.deleteCategory(id);
	}

	@GetMapping("/{id}")
	public Category getCategoryById(@PathVariable int id) {
		return  categoryService.getCategoryById(id).orElseThrow(()->{throw new IllegalArgumentException("Category Does Not Exist");});
	}

	@GetMapping("/")
	public List<Category> getCategory() {
		return  categoryService.getCategories();
	}

	@PutMapping("/{id}")
	public void updateCategory(@PathVariable int id, @RequestBody Category category) {
		categoryService.updateCategory(id, category);
	}

	@PostMapping("/AddBlogCategories")
	public void addBlogCategories(@RequestBody BlogCategoriesDTO blogCategories){
		blogService.addCategoriesToBlog(blogCategories);
	}


}
