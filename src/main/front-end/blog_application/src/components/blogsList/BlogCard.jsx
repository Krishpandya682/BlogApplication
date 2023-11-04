import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import { lastUpdated } from "../helperFunctions";
import "../styles/blogCard.css";

const placeholder_img =
  "https://firebasestorage.googleapis.com/v0/b/blogapplication-c76e2.appspot.com/o/images%2Fblog_images%2Fblack-contour-f41038db.svg?alt=media&token=05ad6dd7-2535-43ab-8bdf-96c2ede306aa&_gl=1*rxzluh*_ga*MTA4OTUzOTMwMi4xNjk3OTUwMjQw*_ga_CW55HF8NVT*MTY5OTA5MTEzNy4yOC4xLjE2OTkwOTI1ODEuNTMuMC4w";
export default function BlogCard({ blog, index }) {
  let url = "/blog/" + blog.blog_id;
  useEffect(() => {
    console.log("Got blog", blog);
    console.log("Got blog", blog);
  }, []);

  return (
    <div className="card_container">
      <a href={url}>
        <Card className="bg-dark text-black mycard">
          <div>
            <div className="image_container">
              <Card.Img
                src={blog.img_url != null ? blog.img_url : placeholder_img}
                alt="Card image"
              />
            </div>
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
          </div>
        </Card>
      </a>
    </div>
  );
}
