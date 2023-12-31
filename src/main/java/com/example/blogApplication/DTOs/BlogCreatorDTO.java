package com.example.blogApplication.DTOs;

import com.example.blogApplication.categories.Category;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class BlogCreatorDTO {
    private final Set<Category> categories = new HashSet<>();
    private String blog_title;
    private String creator_name;
    private LocalDateTime updated;
    private int blog_id;
    private int user_id;
    private String img_url;
    private String user_profile_pic;
    private String content;

    public BlogCreatorDTO(String blog_title, String creator_name, LocalDateTime updated, int blog_id, int user_id, String imgUrl, String userProfilePic, String content) {
        this.blog_title = blog_title;
        this.creator_name = creator_name;
        this.updated = updated;
        this.blog_id = blog_id;
        this.user_id = user_id;
        this.img_url = imgUrl;
        this.user_profile_pic = userProfilePic;
        this.content = content;
//        System.out.println("Concat worked as:- "+concat);
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void addCategories(Category category) {
        this.categories.add(category);
    }

    public String getBlog_title() {
        return blog_title;
    }

    public void setBlog_title(String blog_title) {
        this.blog_title = blog_title;
    }

    public String getCreator_name() {
        return creator_name;
    }

    public void setCreator_name(String creator_name) {
        this.creator_name = creator_name;
    }

    public LocalDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(LocalDateTime updated) {
        this.updated = updated;
    }

    public int getBlog_id() {
        return blog_id;
    }

    public void setBlog_id(int blog_id) {
        this.blog_id = blog_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImg_url() {
        return img_url;
    }

    public void setImg_url(String img_url) {
        this.img_url = img_url;
    }

    public String getUser_profile_pic() {
        return user_profile_pic;
    }

    public void setUser_profile_pic(String user_profile_pic) {
        this.user_profile_pic = user_profile_pic;
    }
}
