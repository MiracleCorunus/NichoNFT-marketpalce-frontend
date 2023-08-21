import "./Partners.scss";
import { Col, Row, Typography, Button, Image } from "antd";
import Web3in from "assets/images/new/partners/web3in.svg";
import Ethereum from "assets/images/new/partners/ETH.svg";
// import Fantom from 'assets/images/new/partners/Fantom.svg';
// import Polygon  from 'assets/images/new/partners/polygon.svg';
import Jinse from "assets/images/new/partners/jinse.svg";
// import Solana from 'assets/images/new/partners/sol.svg';
// import Taocapital  from 'assets/images/new/partners/ARTCAPITAL.svg';
// import Benzinga  from 'assets/images/new/partners/benzi.svg';
// import Digitaljournal  from 'assets/images/new/partners/DJ.svg';
import VrtualCaim from "assets/images/new/partners/VIRTUM.svg";
import Magiccoat from "assets/images/new/partners/MAGICCOAT.svg";
// import Marketwatch from 'assets/images/new/partners/MW.svg';
import Bnbchain from "assets/images/new/partners/binance.svg";
// import Avax from 'assets/images/new/partners/avax.svg';
// import Dailyherald from 'assets/images/new/partners/DailyHerland.svg';
import Curtin from "assets/images/new/partners/Curtin.svg";
import NAVDEX from "assets/images/new/partners/NAVDEX.svg";
import web3in2 from "assets/images/new/partners/web3in2.svg";
import Blockchain from "assets/images/new/partners/blockchain.svg";
import KingData from "assets/images/new/partners/kingdata.svg";
import ChainCatch from "assets/images/new/partners/CHAINCATCHER.svg";
// import Curtin from "assets/images/new/partners/CURTIN_NEW.svg";
import Dji from "assets/images/new/partners/DJI.svg";
import Uestc from "assets/images/new/partners/UESTC.svg";
import HoubiLogo from "assets/images/new/partners/houbiLogo.svg";
import OpenaiLogo from "assets/images/new/partners/openaiLogo.svg";
import stabilityaiLogo from "assets/images/new/partners/stabilityaiLogo.svg";

// import BIQUAN from 'assets/images/new/partners/17.png';

import SmileImg from "assets/images/new/smile_icon.png";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const Common = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ImageWrapper = styled(Common)`
  width: 231px;
  // width: 265px;
  // height: 120px;
  // border-radius: 45px;
  // background: #bf86ff7a;
  background: rgb(27, 29, 39);
  cursor: pointer;
  transition: all 0.2s ease-out;
  border: 1px solid rgb(27, 29, 39);
  opacity: 0.6;
  transform: scale(1);
  &:hover {
    // transform: scale(1.05);
    background: rgb(22, 24, 34);
    border: 1px solid rgb(119, 116, 255);
    box-shadow: 0px 2px 30px rgba(89, 86, 229, 0.5);
    border-radius: 6.14px;
    //transition: none;
    //transform:none;
    box-sizing: border-box;
    opacity: 1;
    transform: scale(1.05);
    transition: all 0.3s;
  }
`;

const { Title } = Typography;

function Partners() {
  const { t } = useTranslation();
  const imageList = [
    { url: Web3in, link: "https://www.web3in.tech/" },
    { url: Ethereum, link: "https://ethereum.org/" },
    // { url: Fantom, link: 'https://fantom.foundation/' },
    // { url: Polygon, link: 'https://polygon.technology/' },
    // { url: Jinse, link: "https://www.jinse.com/news/blockchain/1202567.html" },
    // { url: Solana, link: 'https://solana.com/zh' },
    // { url: Taocapital, link: 'https://www.taocapital.com.au/' },
    // { url: Benzinga, link: 'https://www.benzinga.com/pressreleases/22/04/ab26425755/nicho-nft-marketplace-bringing-nft-to-daily-life' },
    // { url: Digitaljournal, link: 'https://www.digitaljournal.com/pr/nicho-nft-marketplace-bringing-nft-to-daily-life' },
    // { url: VrtualCaim, link: "https://virtualcaim.com/" },
    { url: Magiccoat, link: "https://themagiccoat.com/" },
    // { url: Marketwatch, link: 'https://www.marketwatch.com/press-release/nicho-nft-marketplace-bringing-nft-to-daily-life-2022-04-01' },
    { url: Bnbchain, link: "https://www.bnbchain.world/en/smartChain" },
    // { url: Avax, link: 'https://www.avax.network/' },
    // { url: Dailyherald, link: 'http://finance.dailyherald.com/dailyherald/news/read/42304957' },
    // { url: Curtin, link: 'https://research.curtin.edu.au/businesslaw/our-research/centres-and-institutes/blockchain-research-and-development-laboratory' },
    // { url: NAVDEX, link: 'https://www.dexnav.com/' },
    { url: web3in2, link: "https://www.web3in.tech/" },
    { url: Blockchain, link: "https://blockchainaustralia.org/" },
    {
      url: KingData,
      link: "https://twitter.com/KingData_com/status/1596789091621695489?s=20&t=lBFdLm-nlbdlQYT_CdAskA",
    },
    { url: ChainCatch, link: "http://www.lianbushou.com/" },
    { url: HoubiLogo, link: "https://www.huobi.com/en-us/" },
    { url: OpenaiLogo, link: "https://openai.com/" },
    { url: stabilityaiLogo, link: "https://stability.ai/" },
    // {
    //   url: Curtin,
    //   link: "https://research.curtin.edu.au/businesslaw/our-research/centres-and-institutes/blockchain-research-and-development-laboratory/our-people/",
    // },
    // {
    //   url: Dji,
    //   link: "https://www.digitaljournal.com/pr/nicho-nft-marketplace-bringing-nft-to-daily-life",
    // },
    // { url: Uestc, link: "http://www.cduestc.cn/" },

    // { url: BIQUAN, link: 'https://t.me/BiQuan123Bot' },
  ];
  return (
    <div className="Partners-comp-new dark-black">
      <div className="center-page">
        <Image preview={false} width={57} height={56} src={SmileImg} />
        <Title level={2} strong>
          {t("communitiesPartners")}
        </Title>

        <Row gutter={[13, 25]} style={{ marginBottom: "30px" }}>
          {imageList.map((item, index) => (
            <Col xl={4} lg={4} md={4} sm={12} xs={12} key={index}>
              <ImageWrapper className="partner-item" style={{ width: "100%" }}>
                <a
                  href={item.link}
                  target="_blank"
                  style={{ width: "100%", height: "80px" }}
                  rel="noreferrer"
                >
                  <Image
                    preview={false}
                    style={{ width: "100%" }}
                    height={80}
                    src={item.url}
                  />
                </a>
              </ImageWrapper>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Partners;
