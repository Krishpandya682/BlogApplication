package com.example.blogApplication.DTOs;

import java.time.LocalDateTime;

public class CommentCommentorDTO {

    private String commentor_name;
    private LocalDateTime updated;
    private int blog_id;

    public int getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(int replyTo) {
        this.replyTo = replyTo;
    }

    public int getComment_id() {
        return comment_id;
    }

    public void setComment_id(int comment_id) {
        this.comment_id = comment_id;
    }

    public CommentCommentorDTO( int commentId, String commentor_name, LocalDateTime updated, int blog_id, int user_id,  String user_profile_pic, String comment, int replyTo) {


        this.comment_id = commentId;
        this.commentor_name = commentor_name;
        this.updated = updated;
        this.blog_id = blog_id;
        this.user_id = user_id;
        this.user_profile_pic = user_profile_pic;
        this.comment = comment;
        this.replyTo = replyTo;
    }

    private int user_id;
    private int comment_id;
    private String user_profile_pic;
    private String comment;
    private int replyTo;

    public String getCommentor_name() {
        return commentor_name;
    }

    public void setCommentor_name(String commentor_name) {
        this.commentor_name = commentor_name;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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


    public String getUser_profile_pic() {
        return user_profile_pic;
    }

    public void setUser_profile_pic(String user_profile_pic) {
        this.user_profile_pic = user_profile_pic;
    }
}
