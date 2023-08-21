import { useState, useEffect } from "react";
import { Button, Typography, Row } from "antd";
import useGetBNBPrice, { getFilteredPrice2 } from "hooks/useGetCoinPrice";

import "./LeftContent.scss";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import { formatZero } from "helpers/Utils";
import { Icon } from "@iconify/react";
import bgImage from "assets/images/new/nicho_bg.png";
import houbi from "assets/images/new/houbi.png";
import yellowArrowImg from "assets/images/new/arrow_yellow.png";
import percentageIcon from "assets/images/new/percentage_icon.png";
import dollarIcon from "assets/images/new/dollar_icon.png";
import freeToTrade from "assets/images/new/free_to_trade.svg";
import { useMediaQuery } from "react-responsive";
// import { getTradeAnalysisDataApi } from "api/assets";

const { Title, Paragraph } = Typography;

function LeftContent() {
  const { user, Moralis, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const [totalMint, setTotalMint] = useState(0);
  const [totalSell, setTotalSell] = useState(0);
  const [tradeVolume, setTradeVolume] = useState(0);
  const [totalMintList, setTotalMintList] = useState([]);
  const bnbPrice = useGetBNBPrice(1);
  const DUMMY_START_TIME = 1666906332923;
  const isMobile = useMediaQuery({ maxWidth: 991 });

  // const totalMintList = formatZero(totalMint, 6);
  // console.log(totalMintList);

  // useEffect(() => {
  //   const getItem = async () => {
  //     if (!isInitialized) return;
  //     const data = await getTradeAnalysisDataApi();
  //     if (data) {
  //       setTotalMint(data.totalMint);
  //       setTradeVolume(data.totalVolume);
  //       setTotalSell(data.collectionsTotalVolume);
  //     }
  //   };
  //   getItem();
  //   setTotalMintList(formatZero(totalMint, 6));
  // }, [user, isInitialized]);

  useEffect(() => {
    (() => {
      const currentTime = new Date().getTime();
      const refreshPeriodInMinute = 20;
      const timeEscape = Math.floor(
        (currentTime % DUMMY_START_TIME) / (60 * 1000 * refreshPeriodInMinute)
      );
      setTotalMintList(formatZero(timeEscape + 4900, 6));
    })();
  }, []);

  return (
    <div
      className="left-content-new"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Title strong style={{ color: "white" }}>
        {t("futureAiNfts")}
      </Title>
      <Title strong style={{ color: "white" }}>
        {t("theFusionOf")}
        <span className="left-content-magic-text">NFTs</span>
        {t("aiAndNft")}
        <span className="left-content-magic-text">AI</span>
      </Title>

      {/* <Title strong style={{ color: "white" }}>
        {t("leadYouWEB3")}
      </Title>
      <img
        className="free-to-trade"
        src={freeToTrade}
        width={605}
        height={140}
        alt="Nicho AI NFT"
      /> */}
      {/* <Title level={5}>
      NICHO NFT is a multi-dimensional WEB3 ecosystem that allows users to expand and create content in different smart chains. The mission of Nicho is to lead users to easily enter and experience the WEB3 world. 
      </Title> */}
      <Row
        className="btn-group"
        align="middle"
        justify={isMobile ? "center" : "start"}
      >
        <Link to="/imageGenerator">
          <Button
            className="theme-button"
            type="primary"
            id="explore"
            style={{ fontSize: "16px" }}
          >
            CLICK, TYPE and EARN
            {/* {t("imageGenerator")} */}
          </Button>
        </Link>
        {/* <Link to="/nftMarketPlace">
          <Button className="theme-button" type="primary" id="explore">
            {t("explore")}
          </Button>
        </Link> */}
        {/* <a
          href="https://twitter.com/nichonft/status/1648171901674725376?s=20"
          target="_blank"
        >
          <Button
            className="theme-button"
            id="create"
            style={{ background: "black", border: "1px solid gray" }}
            // icon={
            //   <img
            //     src={houbi}
            //     alt="houbi"
            //     width={24}
            //     height={24}
            //     style={{ paddingBottom: "5px" }}
            //   />
            // }
          >
            <img
              src={houbi}
              alt="houbi"
              width={32}
              height={32}
              style={{ paddingBottom: "5px" }}
            />
            <span
              className="left-content-magic-text"
              style={{
                fontWeight: "900",
                fontSize: "16px",
                marginLeft: "1rem",
              }}
            >
              {t("voteUsOnHoubi")}
            </span>
          </Button>
        </a> */}
      </Row>
      <div className="status-wrap">
        <div className="status-item-top">
          <Paragraph strong>{t("currentUsers")}</Paragraph>
          <div className="mint-list">
            {totalMintList &&
              totalMintList.map((item, index) => (
                <span className="mint-item" key={index}>
                  {item}
                </span>
              ))}
          </div>
        </div>
        {/* <div className="status-item-bot">
          <div className="status-item">
            <img src={percentageIcon} alt="Nicho AI NFT" />
            <div className="right">
              <Title level={3} strong>
                {totalSell}{" "}
              </Title>
              <Paragraph strong>NFT SOLD</Paragraph>
            </div>
          </div>
          <div className="status-item">
            <img src={dollarIcon} alt="Nicho AI NFT" />
            <div className="right">
              <Title level={3} strong>
                {" "}
                <span>$</span>
                {getFilteredPrice2(bnbPrice * tradeVolume)}
              </Title>
              <Paragraph strong>TRADING VOLUME</Paragraph>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default LeftContent;
