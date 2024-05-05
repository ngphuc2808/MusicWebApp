"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import Slider, { CustomArrowProps, Settings } from "react-slick";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";

import { convertStrToSlugify } from "@/utils/api";

interface IProps {
  data: ITrackTop[];
  title: string;
  custom?: boolean;
}

const MainSlider = (props: IProps) => {
  const { data, title, custom } = props;

  const NextArrow = (props: CustomArrowProps) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    );
  };

  const PrevArrow = (props: CustomArrowProps) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };

  const settings: Settings = {
    infinite: data.length > 3,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        margin: "0 50px",
        marginBottom: custom ? "88px" : 0,
        ".track": {
          padding: "0 10px",

          img: {
            height: 150,
            width: 150,
          },
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((it) => (
          <div className="track" key={it._id}>
            <div
              style={{
                position: "relative",
                width: 150,
                height: 150,
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${it.imgUrl}`}
                fill
                style={{
                  objectFit: "contain",
                }}
                alt="track-img"
              />
            </div>
            <Link
              href={`/track/${convertStrToSlugify(it.title)}-${
                it._id
              }.html?audio=${it.trackUrl}`}
              className="track"
              key={it._id}
            >
              <h4>{it.title}</h4>
            </Link>
            <h5>{it.description}</h5>
          </div>
        ))}
      </Slider>
      <Divider />
    </Box>
  );
};

export default MainSlider;
