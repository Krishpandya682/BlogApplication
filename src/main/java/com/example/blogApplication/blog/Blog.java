package com.example.blogApplication.blog;
import jakarta.persistence.*;

import java.util.Date;

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
    private int creator_id;

    private String title;
    private String content;
    private Date publicationDate;

    public Blog(){}
    // Constructor to create a new blog post with a title and content
    public Blog(int id,int creator, String title, String content) {
        this.id = id;
    	this.creator_id = creator;
        this.title = title;
        this.content = content;
        this.publicationDate = new Date(); // Initialize with the current date and time
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

    // Getter method for retrieving the publication date of the blog post
    public Date getPublicationDate() {
        return publicationDate;
    }

    // Setter method to update the publication date of the blog post
    public void setPublicationDate(Date publicationDate) {
        this.publicationDate = publicationDate;
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
                ", publicationDate=" + publicationDate +
                ", creator=" + creator_id +
                '}';
    }
}

