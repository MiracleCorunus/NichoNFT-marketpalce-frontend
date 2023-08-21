import { useEffect, useState } from "react";
import { Row, Col, Image, Table, Button, Tabs, Typography } from "antd";
import { useMoralis } from "react-moralis";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Park.scss";
import { useTranslation } from "react-i18next"
import ComingSoonTxt from 'components/common/ComingSoonTxt'
import topBg from "assets/images/new/park/top_bg.png";
import topImg from "assets/images/new/park/2742.png";
import joystickImg from "assets/images/new/park/joystick.png";
import parkTxtImg from "assets/images/new/park/park_txt.png";

// Custom modules
import { gameList } from "./gameData";

const { Title, Paragraph } = Typography;

const styles = {
  bg: {
    background: `url('${topBg}') no-repeat`,
    backgroundSize: "100% 533px",
    backgroundPosition: "top center",
  },
};

const Park = () => {
  const { t } = useTranslation();
  return (
    <div className="park-page" style={styles.bg}>
      <div className="park-content center-page2">
        <Image preview={false} width={105} src={joystickImg} />
        <div>
          <Image
            rootClassName="park-txt-img"
            style={{ margin: "35px 0 0" }}
            preview={false}
            width={337}
            src={parkTxtImg}
          />
        </div>
        <div>
          <img className="top-img" src={topImg} alt="Nicho AI NFT" />
        </div>

        <div className="game-list">
          <Title level={2} style={{ color: "#fff" }} strong>
            {t("gameList")}
          </Title>

          {gameList &&
            gameList.map((item, index) => (
              <div className="game-item" key={index}>
                <img className="game-left" src={item.imgSrc} alt="Nicho AI NFT" />
                <div className="game-right">
                  <Title level={3} style={{ color: "#fff", fontSize: "32px", paddingBottom: '15px' }} strong>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: "#9B9EAE", fontSize: "18px" }}>
                    {item.content}
                  </Paragraph>
                  <div className="bot-wrap">
                    <Button
                      className="theme-button"
                      type="primary"
                      id="explore"
                    >
                      {t("startGame")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <ComingSoonTxt />
    </div>
  );
};

export default Park;
