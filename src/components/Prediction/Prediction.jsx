import { useEffect, useState } from "react";
import { Row, Image } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import "./Prediction.scss";

import ComingSoonTxt from 'components/common/ComingSoonTxt'

import topImg from "assets/images/new/prediction/top_img.png";
import timeIcon from "assets/images/new/prediction/time_icon.png";
import banner1 from "assets/images/new/prediction/banner1.png";
import banner2 from "assets/images/new/prediction/banner2.png";
import arrowLeftImg from "assets/images/new/prediction/arrow_l.png";
import arrowRightImg from "assets/images/new/prediction/arrow_r.png";


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
      >
        <Image preview={false} src={arrowRightImg} width="28"/>
      </div>
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <div
        className={className}
        onClick={onClick}
      >
        <Image preview={false} src={arrowLeftImg} width="28"/>
      </div>
    );
  }


const Prediction = () => {
    // const { user, Moralis, isInitialized } = useMoralis();

    // useEffect(() => {
    //     if (!isInitialized || !user) return;
    // }, [user, isInitialized]);

    return (
        <div className="prediction center-page2">
            
            <Row justify="center">
                <Image preview={false} src={topImg} width="756"/>
            </Row>

            <Row justify="center">
                <div className="title-wrap">
                    <Image preview={false} src={timeIcon} width="36"/>
                    24:00:00
                </div>
            </Row>

            <div style={{margin: '40px auto 0'}}>
                <Slider {...settings} >
                    <div>
                        <Image preview={false} src={banner1} width="392" height="547"/>
                    </div>
                    <div>
                        <Image preview={false} src={banner2} width="392" height="547"/>
                    </div>
                    <div>
                        <Image preview={false} src={banner1} width="392" height="547"/>
                    </div>
                </Slider>
            </div>
            
            <ComingSoonTxt />
        </div>
    );
};

export default Prediction;
