package com.example.blogApplication.DTOs;

import java.util.List;

public class BlogCategoriesDTO {

    private int blogId;
    private List<Integer> categories;

    public BlogCategoriesDTO(int blogId, List<Integer> categories) {
        this.blogId = blogId;
        this.categories = categories;
    }

    public int getBlogId() {
        return blogId;
    }

    public void setBlogId(int blogId) {
        this.blogId = blogId;
    }

    public List<Integer> getCategories() {
        return categories;
    }

    public void setCategories(List<Integer> categories) {
        this.categories = categories;
    }
}
