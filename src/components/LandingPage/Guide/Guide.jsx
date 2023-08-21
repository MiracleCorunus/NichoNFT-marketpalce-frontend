import "./Guide.scss";
import { Col, Row, Typography, Image } from "antd";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowRightIcon } from "assets/images/arrow-right.svg";
import Count1 from "assets/images/new/01.png";
import Count2 from "assets/images/new/02.png";
import Count3 from "assets/images/new/03.png";
import Bg1 from "assets/images/new/bg_01.png";
import Bg2 from "assets/images/new/bg_02.png";
import Bg3 from "assets/images/new/bg_03.png";
import Icon1 from "assets/images/new/icon_01.png";
import Icon2 from "assets/images/new/icon_02.png";
import Icon3 from "assets/images/new/icon_03.png";
import DiamondImg from "assets/images/new/img_csndiamond.png";

import { Icon } from "@iconify/react";

const { Title, Paragraph } = Typography;

function Guide() {
  const { t } = useTranslation();
  return (
    <div className="guide-comp dark-black">
      <div className="center-page">
        <Image preview={false} width={57} height={56} src={DiamondImg} />
        <Title level={2} strong>
          {t("earnWithNicho")}
        </Title>
        <Row gutter={[29, 29]}>
          <Col lg={8} md={24} sm={24}>
            <div
              className="card card1"
              style={{
                background: `url(${Bg1}) bottom right no-repeat`,
              }}
            >
              <img className="count-bg" src={Count1} alt="Nicho AI NFT" />
              <Title className="title" level={3} strong>
                NFTs
              </Title>
              <Image preview={false} width={56} height={56} src={Icon1} />
              <Paragraph className="description" type="secondary">
                {t("NichoNFTFeatureRich")}
              </Paragraph>
            </div>
          </Col>

          <Col lg={8} md={24} sm={24}>
            <div
              className="card card2"
              style={{
                background: `url(${Bg2}) bottom right no-repeat`,
              }}
            >
              <img className="count-bg" src={Count2} alt="Nicho AI NFT" />
              <Title className="title" level={3} strong>
                AI
              </Title>
              <Image preview={false} width={57} height={56} src={Icon2} />
              <Paragraph className="description" type="secondary">
                {t("aiDescription")}
              </Paragraph>
            </div>
          </Col>
          {/* <Col lg={8} md={24} sm={24}>
            <div className="card card2"  style={{
              background: `url(${Bg2}) bottom right no-repeat`
            }}>
              <img  className="count-bg" src={Count2} alt="Nicho AI NFT" />
              <Title className="title" level={3} strong>Games</Title>
              <Image preview={false} width={57} height={56} src={Icon2} />
              <Paragraph className="description" type="secondary">
              {t("inNichoUser")}
              </Paragraph>
            </div>
          </Col> */}

          <Col lg={8} md={24} sm={24}>
            <div
              className="card card3"
              style={{
                background: `url(${Bg3}) bottom right no-repeat`,
              }}
            >
              <img className="count-bg" src={Count3} alt="Nicho AI NFT" />
              <Title className="title" level={3} strong>
                {t("NichoPlanet")}
              </Title>
              <Image preview={false} width={57} height={56} src={Icon3} />
              <Paragraph className="description" type="secondary">
                {t("NichoPlanetIs")}
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Guide;
