package com.example.blogApplication.blog;

import com.example.blogApplication.comments.Comment;
import com.example.blogApplication.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
public class Blog {


    @Id
    @SequenceGenerator(
            name = "blgo_sequence",
            sequenceName = "blog_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "blog_sequence"
    )
    // Instance variables to store the blog post's information
	private int id;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User creator;
    private String url;
    @CreationTimestamp
    private LocalDateTime created;

    @OneToMany
    private List<Comment> commentList;
    private String title;
    private String content;
    @UpdateTimestamp
    private LocalDateTime updated;

    public Blog() {
    }

    // Constructor to create a new blog post with a title and content
    public Blog(int id, User creator, String title, String content, String url) {
        this.id = id;
        this.creator = creator;
        this.title = title;
        this.content = content;
        this.url = url;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public LocalDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(LocalDateTime updated) {
        this.updated = updated;
    }

    // Getter method for retrieving the title of the blog post
    public String getTitle() {
        return title;
    }

    // Setter method to update the title of the blog post
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter method for retrieving the content of the blog post
    public String getContent() {
        return content;
    }

    // Setter method to update the content of the blog post
    public void setContent(String content) {
        this.content = content;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // A method to provide a string representation of the blog post
    @Override
    public String toString() {
        return "Blog{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", creator=" + creator +
                '}';
    }
}

