import React from "react";
import Card from "react-bootstrap/Card";
import "./styles/blogCard.scss";
import moment from "moment";
import api from "../api/axiosConfig";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import {lastUpdated} from './helperFunctions'


export default function BlogCard({ blog }) {

  let url = "/blogs/" + blog.blog_id;


  return (
    <div>
      <a href={url}>
        BlogCard
        <Card className="bg-dark text-black mycard">
          <Card.Img src={blog.img_url!=null?blog.img_url:"https://placehold.co/600x400"} alt="Card image" />
          <Card.ImgOverlay className="card-overlay">
            <div className="flex d-flex flex-column justify-content-around align-items-center h-100">
              <div className="top">
                <div className="flex d-flex flex-column align-items-center">
                  <Card.Title className="card-title">{blog.blog_title}</Card.Title>
                </div>
                <div className="flex d-flex flex-column align-items-center">
                  <Card.Text>
                    By {blog.creator_name}
                  </Card.Text>
                </div>
              </div>
              <div className="bottom">
                <Card.Text className="bottom">
                  Last updated {lastUpdated(blog.updated)}
                </Card.Text>
              </div>
            </div>
          </Card.ImgOverlay>
        </Card>
      </a>
    </div>
  );
}
