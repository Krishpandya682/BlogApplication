import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import { lastUpdated } from "../helperFunctions";
import "../styles/blogCard.css";

// Placeholder image URL
const placeholder_img =
  "https://firebasestorage.googleapis.com/v0/b/blogapplication-c76e2.appspot.com/o/images%2Fblog_images%2Fblackbg.jpeg?alt=media&token=17a76af9-b488-4caf-a0a6-f5330f01d8a9&_gl=1*10agr9o*_ga*MTA4OTUzOTMwMi4xNjk3OTUwMjQw*_ga_CW55HF8NVT*MTY5OTEzNzM1My4zMy4xLjE2OTkxMzkwNDUuNDAuMC4w";

// BlogCard component
export default function BlogCard({ blog, index }) {
  let url = "/blog/" + blog.blog_id;

  // useEffect hook to log the blog object when the component mounts
  useEffect(() => {
    console.log("Got blog", blog);
  }, []);

  return (
    <div className="card_container">
      <a href={url}>
        <Card className="bg-dark text-black mycard">
          <div>
            <div className="image_container">
              {/* Render the blog's image or a placeholder image if it's not available */}
              <Card.Img
                src={blog.img_url != null ? blog.img_url : placeholder_img}
                alt="Card image"
              />
            </div>
            <Card.ImgOverlay className="card-overlay">
              <div className="flex d-flex flex-column justify-content-around align-items-center h-100">
                <div className="top">
                  <div className="flex d-flex flex-column align-items-center">
                    {/* Display the blog's title */}
                    <Card.Title className="card-title">
                      {blog.blog_title}
                    </Card.Title>
                  </div>
                  <div className="flex d-flex flex-column align-items-center">
                    {/* Display the creator's name */}
                    <Card.Text>By {blog.creator_name}</Card.Text>
                  </div>
                </div>
                <div className="bottom">
                  <Card.Text className="bottom">
                    {/* Display the last updated time */}
                    Last updated {lastUpdated(blog.updated)}
                  </Card.Text>
                </div>
              </div>
            </Card.ImgOverlay>
          </div>
        </Card>
      </a>
    </div>
  );
}
