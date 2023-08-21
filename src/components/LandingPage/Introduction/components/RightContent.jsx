import { Image, Row } from 'antd';
import './RightContent.scss';
import ImgBg from 'assets/images/new/LandingPage/home_img_bg.png';
import Icon1 from 'assets/images/new/LandingPage/home_img_icon1.png';
import Icon2 from 'assets/images/new/LandingPage/home_img_icon2.png';
import Icon3 from 'assets/images/new/LandingPage/home_img_icon3.png';

function RightContent() {
  return (
    <div className="right-content">
      <img className="right-img1" src={Icon1} alt="Nicho AI NFT" />
      <img className="right-img2" src={Icon2} alt="Nicho AI NFT" />
      <img className="right-img3" src={Icon3} alt="Nicho AI NFT" />
      <Row className="top-img" align='bottom' justify='center'>
        <Image preview={false} width={720} height={420} src={ImgBg} />
      </Row>
    </div>
  );
}

export default RightContent;
