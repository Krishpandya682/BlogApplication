package com.example.blogApplication.categories;

import com.example.blogApplication.BlogApplication;
import com.example.blogApplication.DTOs.BlogCategoriesDTO;
import com.example.blogApplication.DTOs.BlogCreatorDTO;
import com.example.blogApplication.blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
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
        if (!BlogApplication.isInteger(catId)) {
            return ResponseEntity.badRequest().build();
        }
        return blogService.getBlogByCategory(Integer.parseInt(catId));

    }

    @GetMapping("/blogCategories/{blogId}")
    public ResponseEntity<List<Category>> getBlogCategories(@PathVariable String blogId) {
        if (!BlogApplication.isInteger(blogId)) {
            return ResponseEntity.badRequest().build();
        }
        return categoryService.getBlogCategories(Integer.parseInt(blogId));

    }

    @PostMapping("/")
    public ResponseEntity<Integer> addNewBlog(@RequestBody Category category) {

        return categoryService.addNewCategory(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return categoryService.deleteCategory(Integer.parseInt(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return categoryService.getCategoryById(Integer.parseInt(id));
    }

    @GetMapping("/")
    public ResponseEntity<List<Category>> getCategory() {
        return categoryService.getCategories();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCategory(@PathVariable String id, @RequestBody Category category) {
        if (!BlogApplication.isInteger(id)) {
            return ResponseEntity.badRequest().build();
        }
        return categoryService.updateCategory(Integer.parseInt(id), category);
    }

    @PostMapping("/AddBlogCategories")
    public ResponseEntity<Void> addBlogCategories(@RequestBody BlogCategoriesDTO blogCategories) {
        return blogService.addCategoriesToBlog(blogCategories);
    }


}
