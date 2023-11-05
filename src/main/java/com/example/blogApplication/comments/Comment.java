package com.example.blogApplication.comments;

import com.example.blogApplication.blog.Blog;
import com.example.blogApplication.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table
public class Comment {


    @Id
    @SequenceGenerator(
            name = "comment_sequence",
            sequenceName = "comment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "comment_sequence"
    )
    // Instance variables to store the blog post's information
    private int id;
    private int replyTo;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "commentor_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User commentor;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "blog_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Blog blog;
    @CreationTimestamp
    private LocalDateTime created;
    @Column(columnDefinition = "TEXT")
    private String comment;
    @UpdateTimestamp
    private LocalDateTime updated;

    public Comment() {
    }

    // Constructor to create a new blog post with a title and content
    public Comment(int id, int replyTo, User commentor, String title, String comment, String url, Blog blog) {
        this.id = id;
        this.replyTo = replyTo;
        this.commentor = commentor;

        this.comment = comment;

        this.blog = blog;
    }

    public int getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(int replyTo) {
        this.replyTo = replyTo;
    }

    public Blog getBlog() {
        return blog;
    }

    public void setBlog(Blog blog) {
        this.blog = blog;
    }

    public User getCommentor() {
        return commentor;
    }

    public void setCommentor(User commentor) {
        this.commentor = commentor;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }


    public LocalDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(LocalDateTime updated) {
        this.updated = updated;
    }


    // Getter method for retrieving the content of the blog post
    public String getComment() {
        return comment;
    }

    // Setter method to update the content of the blog post
    public void setComment(String comment) {
        this.comment = comment;
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
        return "Comment{" +
                ", content='" + comment + '\'' +
                ", creator=" + commentor +
                '}';
    }
}

