import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import "../styles/SelectTemplate.scss";
import { Button, CardActions } from "@mui/material";
import img from "../assets/section3.jpg";
import TemplateDetails from "./TemplateDetails";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/image4.jpg";
import image2 from "../assets/image5.jpg";
import image3 from "../assets/image8.jpg";

function SelectTemplate() {
  const navigate = useNavigate();
  const [showTemplateDetails, setTemplateDetails] = useState({});
  const [data, setData] = useState([
    {
      cover: image1,
      title: "Company",
      info: "Use transferable tokens to represent ownership stake in your organization. Decisions are made based on stake-weighted voting.",
    },
    {
      cover: image2,
      title: "Membership",
      info: "Use a non-transferable token to represent membership. Decisions are made based on one-member-one-vote governance.",
    },
    {
      cover: image3,
      title: "Reputation",
      info: "Use non-transferable tokens to represent reputation. Decisions are made using reputation-weighted voting.",
    },
  ]);
  return (
    <div className="select-main">
      <h1>Select Template</h1>
      <p>Create your DataDao with pre configured template</p>
      <div className="templates-div">
        {data.map((item, key) => {
          return (
            <Card
              sx={{
                width: "100%",
                maxWidth: 400,
                minHeight: 450,
                maxHeight: 450,
                backgroundColor: "#000000",
                border: "1px solid #1d130D",
                color: "#ffffff",
              }}
              className={` ${
                key === 0 ? "card-template" : "card-template disable"
              }`}
              key={key}
            >
              <CardActionArea
                onClick={
                  key === 0
                    ? () => {
                        navigate("/create-data-dao/select-template/details", {
                          state: {
                            cover: item.cover,
                            title: item.title,
                            info: item.info,
                          },
                        });
                      }
                    : ""
                }
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={item.cover}
                  alt="green iguana"
                  className="cover-image-card"
                />
                <CardContent sx={{}}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ textAlign: "center" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="template-info"
                    sx={{ color: "#ffffff" }}
                  >
                    {item.info}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                sx={{
                  width: "max-content",
                  margin: "0px auto",
                  alignSelf: "flex-end",
                  marginTop: "auto",
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  className="card-show-more-btn"
                  onClick={async () => {
                    navigate("/create-data-dao/select-template/details", {
                      state: {
                        cover: item.cover,
                        title: item.title,
                        info: item.info,
                      },
                    });
                  }}
                >
                  Show More
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default SelectTemplate;
