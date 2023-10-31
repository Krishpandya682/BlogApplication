package com.example.blogApplication.categories;

import com.example.blogApplication.blog.Blog;
import com.example.blogApplication.user.User;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table
public class Category {


    @Id
    @SequenceGenerator(
            name = "category_sequence",
            sequenceName = "category_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "category_sequence"
    )
    // Instance variables to store the blog post's information
	private int id;
    private String categoryName;

    @ManyToMany(mappedBy = "categories")
    private List<Blog> blogs;

    public Category() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    // Constructor to create a new blog post with a title and content
    public Category(int id, String categoryName) {
        this.id = id;

        this.categoryName = categoryName;
    }

}

