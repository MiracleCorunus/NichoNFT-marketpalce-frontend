import { Row, Image } from 'antd';
import './LeftContent.scss';
import bgImage from 'assets/images/new/nicho_bg.png'

import ImgBg from 'assets/images/new/LandingPage/home_img_bg.png';
import Icon1 from 'assets/images/new/LandingPage/home_img_icon1.png';
import Icon2 from 'assets/images/new/LandingPage/home_img_icon2.png';
import Icon3 from 'assets/images/new/LandingPage/home_img_icon3.png';


function LeftContent() {

  return(
    <div className="left-content">
      <Row justify='center'>
        <Image src={ bgImage } preview={ false } className="nicho-logo"/>
      </Row>
      

      <div className='animation-logo'>
        <img className="right-img1" src={Icon1} alt="Nicho AI NFT" />
        <img className="right-img2" src={Icon2} alt="Nicho AI NFT" />
        <img className="right-img3" src={Icon3} alt="Nicho AI NFT" />
        <Row className="top-img" align='bottom' justify='center'>
          <Image preview={false} width={720} height={420} src={ImgBg} />
        </Row>
      </div>
    </div>
  );
}

export default LeftContent;