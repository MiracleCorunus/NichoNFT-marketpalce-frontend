import {
  Typography,
  Space,
  Image
} from "antd";
import GalleryIcon from "assets/images/new/event/icons/gallery.png";
// import AudcoinIcon from "assets/images/new/event/icons/aud_coin.png";
import BnbLight from "assets/images/new/event/icons/bnbLight.png";
import { styles } from "./styles";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { t } from "i18next";

const { Title, Paragraph } = Typography;

const TitleComponent = ({ imagePath, content }) => {
  return (
    <Space align="center" size={10}>
      <Image preview={false} width={30} height={30} src={imagePath} />
      <Title level={5}>{content}</Title>
    </Space>
  );
};

const Info = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=aud";

  const [bnbPrice, setBnbPrice] = useState(0);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setBnbPrice(res.binancecoin.aud);
      });
  }, []);

  return (
    <div style={styles.info}>
      <Title level={2} style={styles.gulfFont2}>
        {t("theAustraliaCollection")}
      </Title>

      <Space
        align="center"
        size={isDesktopOrLaptop ? 50 : 10}
        style={styles.nameComp}
        direction={isDesktopOrLaptop ? "horizontal" : "vertical"}
      >
        <div
          style={{
            border: "1px solid #53f2d4",
            padding: "10px 80px",
            borderRadius: 10,
          }}
        >
          <span style={{ marginRight: 80 }}>
            <TitleComponent
              imagePath={GalleryIcon}
              content={`${t("totalSupply")}: 34 NFTs`}
            />
          </span>

          <TitleComponent
            imagePath={BnbLight}
            content={`${t("tradingCurrency")}:  $BNB ($${bnbPrice} AUD)`}
          />
        </div>
      </Space>
      <Paragraph>
        {t("allArtworks")}{" "}
        <span style={{ color: "#f3ba2c" }}>{t("binanceSmartChain")}</span>
      </Paragraph>
    </div>
  );
};

export default Info;
