package com.example.blogApplication.categories;

import com.example.blogApplication.DTOs.BlogCategoriesDTO;
import com.example.blogApplication.DTOs.BlogCreatorDTO;
import com.example.blogApplication.blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<List<BlogCreatorDTO>> getBlogByCategory(@PathVariable String catId) {
        try {
            int categoryId = Integer.parseInt(catId);
            return blogService.getBlogByCategory(categoryId);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/blogCategories/{blogId}")
    public ResponseEntity<List<Category>> getBlogCategories(@PathVariable String blogId) {
        return categoryService.getBlogCategories(Integer.parseInt(blogId));
//		return null;
    }

    @PostMapping("/{blogId}/{catId}")
    public ResponseEntity<Void> addCategoryToBlog(@PathVariable String catId, @PathVariable String blogId) {
        try {
            categoryService.findCategoryById(Integer.parseInt(catId));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {
            blogService.addCategoryToBlog(catId, blogId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/")
    public ResponseEntity<Integer> addNewBlog(@RequestBody Category category) {

        return categoryService.addNewCategory(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable int id) {
        return categoryService.deleteCategory(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable int id) {
        return categoryService.getCategoryById(id);
    }

    @GetMapping("/")
    public ResponseEntity<List<Category>> getCategory() {
        return categoryService.getCategories();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCategory(@PathVariable int id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }

    @PostMapping("/AddBlogCategories")
    public ResponseEntity<Void> addBlogCategories(@RequestBody BlogCategoriesDTO blogCategories) {
        return blogService.addCategoriesToBlog(blogCategories);
    }


}
