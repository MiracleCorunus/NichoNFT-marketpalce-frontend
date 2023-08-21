import React, { useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./ImageCarousel.scss";

// import image1 from "../assets/image1.png";
// import image2 from "../assets/image2.png";
// import image3 from "../assets/image3.png";
// import image4 from "../assets/image4.png";
// import image5 from "../assets/image5.png";

const responsive = {
  0: { items: 1 },
  400: { items: 2 },
  800: { items: 3 },
};

const ImageCarousel = ({ imageList, setImageUrl }) => {
  const [mainIndex, setMainIndex] = useState(0);
  //   const imageSet = [image1, image2, image3, image4, image5];

  const items = imageList
    ? imageList.map((img, index) => (
        <div key={index} className="carousel-container">
          <img
            onClick={() => {
              setImageUrl(img);
              setMainIndex(index);
            }}
            src={img}
            className="carousel-container-image"
            width={360}
            height={360}
          />
        </div>
      ))
    : null;

  return (
    <>
      {items !== null ? (
        <AliceCarousel
          //   animationType=""
          animationDuration={1000}
          activeIndex={mainIndex}
          autoWidth
          autoPlay
          autoPlayInterval={2000}
          infinite
          mouseTracking
          items={items}
          disableDotsControls
          responsive={responsive}
        />
      ) : null}
    </>
  );
};

export default ImageCarousel;
