import './Guide.scss';
import { Col, Row, Typography, Image } from 'antd';
import { useTranslation } from "react-i18next"
import { ReactComponent as ArrowRightIcon } from 'assets/images/arrow-right.svg';
import WalletImg from 'assets/images/wallet.png';
import HomeImg from 'assets/images/home.png';
import EmailImg from 'assets/images/email.png';
import { Icon } from '@iconify/react';

const { Title, Paragraph } = Typography

function Guide() {
  const { t } = useTranslation();
  return (
    <div className="guide">
      <Title level={2} strong>{t("createSell")}</Title>
      <Row gutter={[29, 29]}>
        <Col lg={8} md={24} sm={24}>
          <div className="card">
            <Paragraph className="step" type="secondary">{t("step01")}</Paragraph>
            <Title className="title" level={3} strong>{t("connectYourDeFiWallet")}</Title>
            <Paragraph className="description" type="secondary">
              {t("signVerification")}
            </Paragraph>
            <div className='icon'>
              <Icon icon="akar-icons:arrow-up-right" color="var(--white72Color)" height="24" />
            </div>
            <div className="ribon">
              <Image preview={false} src={WalletImg}/>
            </div>
          </div>
        </Col>
        <Col lg={8} md={24} sm={24}>
          <div className="card">
            <Paragraph className="step" type="secondary">{t("step02")}</Paragraph>
            <Title className="title" level={3} strong>{t("mintAndTrade")}</Title>
            <Paragraph className="description" type="secondary">
              {t("dependingOnTheMainnet")}
              {t("youHaveBNBWallet")}
            </Paragraph>
            <div className='icon'>
              <Icon icon="akar-icons:arrow-up-right" color="var(--white72Color)" height="24" />
            </div>
            <div className="ribon">
              <Image preview={false} src={HomeImg}/>
            </div>
          </div>
        </Col>
        <Col lg={8} md={24} sm={24}>
          <div className="card">
            <Paragraph className="step" type="secondary">{t("step03")}</Paragraph>
            <Title className="title" level={3} strong>{t("getRewards")}</Title>
            <Paragraph className="description" type="secondary">
              {t("readyGetReward")}
            </Paragraph>
            <div className='icon'>
              <Icon icon="akar-icons:arrow-up-right" color="var(--white72Color)" height="24" />
            </div>
            <div className="ribon">
              <Image preview={false} src={EmailImg}/>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Guide;