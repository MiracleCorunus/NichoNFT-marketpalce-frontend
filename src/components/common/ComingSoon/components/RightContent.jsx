import { Image, Row, Typography, Button, Space, Col } from 'antd';
import { useTranslation } from "react-i18next"
import './RightContent.scss';
import bgImage from 'assets/images/new/nicho_bg.png';
import TwitterIcon from 'assets/images/new/twitter.png';
import TelegramIcon from 'assets/images/new/telegram.png';
import GithubIcon from 'assets/images/new/github.png';
import MediumIcon from 'assets/images/new/medium.png';

const { Title, Paragraph } = Typography;

const countDownList = ['2', '2', '0', '9', '1', '2'];
const openLink = (link) => {
  window.location.href = link;
}

function RightContent() {
  const { t } = useTranslation();
  return (
    <div className="right-content">
      <Title level={1}>{t("weAreComingSoon")}</Title>
      <Space align='center' direction='vertical' style={{ width: '100%', marginTop: '30px'}}>
        <Space size={20} direction='vertical'>
          <Title level={4}>
            {t("NichoBook")} - 
            <a href="http://doc.nichonft.com" className='guide'>{t("clickHere")}</a>
          </Title>

          <Title level={4}>
            {t("testVersion")} - 
            <a href="https://test.nichonft.com" className='guide'>{t("clickHere")}</a>
          </Title>
        </Space>
      </Space>
      <div className="status-wrap">
        <div className="status-item-top">
          {/* <Paragraph strong>Launch Date</Paragraph>
          <div className="mint-list">
            {countDownList && countDownList.map((item, index) => (
              <span className="mint-item">{item}</span>
            ))}
          </div> */}
        </div>
      </div>
      
      <Row justify='center'>
        <Image src={ bgImage } preview={ false } className="nicho-logo"/>
      </Row>

      <div className="social-group">
        <Space direction='horizontal'>
          <Button shape="circle" onClick={() => openLink("https://twitter.com/nichonft")}>
            <Image preview={false} width={24} height={24} src={TwitterIcon} />
          </Button>
          <Button shape="circle" onClick={() => openLink("https://t.me/nichonft")}>
            <Image preview={false} width={24} height={24} src={TelegramIcon} />
          </Button>
          <Button shape="circle" onClick={() => openLink("https://github.com/NichoNFT")}>
            <Image preview={false} width={24} height={24} src={GithubIcon} />
          </Button>
          <Button className="medium-wrap" shape="circle" onClick={() => openLink("https://medium.com/@nichonft")}>
            <Image preview={false} width={22} height={19} src={MediumIcon} />
          </Button>
        </Space>
        <Paragraph>© Copyright 2022 - NichoNFT</Paragraph>
      </div>
    </div>
  );
}

export default RightContent;
