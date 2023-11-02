import React, {useEffect} from "react";
import Card from "react-bootstrap/Card";
import { lastUpdated } from "../helperFunctions";
import "../styles/blogCard.css";

export default function BlogCard({ blog }) {
  let url = "/blog/" + blog.blog_id;
  useEffect(() => {
    console.log("Got blog",blog);
    console.log("Got blog",blog);
  
  }, [])
  
  return (
    <div>
      <a href={url}>
        <Card className="bg-dark text-black mycard">
          <Card.Img
            src={
              blog.img_url != null
                ? blog.img_url
                : "https://placehold.co/600x400"
            }
            alt="Card image"
          />
          <Card.ImgOverlay className="card-overlay">
            <div className="flex d-flex flex-column justify-content-around align-items-center h-100">
              <div className="top">
                <div className="flex d-flex flex-column align-items-center">
                  <Card.Title className="card-title">
                    {blog.blog_title}
                  </Card.Title>
                </div>
                <div className="flex d-flex flex-column align-items-center">
                  <Card.Text>By {blog.creator_name}</Card.Text>
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
