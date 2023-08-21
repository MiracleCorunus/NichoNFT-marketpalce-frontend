import {
  Typography,
  Space,
  Image,
  Input,
  Row,
  Col,
  Upload,
  Modal,
  Spin,
  message,
  Select,
} from "antd";
import FlagIcon from "assets/images/new/event/icons/flag.png";
import Web3Icon from "assets/images/new/event/icons/web3in.png";
import Web3InIcon from "assets/images/new/event/icons/web3inv.png";
import BarIcon from "assets/images/new/event/icons/barin.png";
import ToyboxIcon from "assets/images/new/event/icons/Toybox.svg";
import { styles } from "./styles";
import { useMediaQuery } from "react-responsive";
import { t } from "i18next";

const { Title, Paragraph } = Typography;

const Partner = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const partners = [
    {
      key: "1",
      imagePath: Web3Icon,
    },

    {
      key: "2",
      imagePath: Web3InIcon,
    },

    {
      key: "3",
      imagePath: BarIcon,
    },
    {
      key: "4",
      imagePath: ToyboxIcon,
    },
  ];
  return (
    <>
      <div className="page-content">
        <div style={styles.partnerTitle}>
          <Space align="start" size={10} style={styles.nameComp}>
            <Image preview={false} width={30} height={30} src={FlagIcon} />
            <Title strong italic level={3} style={styles.infoTitle}>
              {t("partner")}
            </Title>
          </Space>
        </div>

        <div style={styles.partnerBody}>
          <Space align="center" size={isDesktopOrLaptop ? 30 : 10}>
            {partners.map((item) => {
              return (
                <Image
                  key={item.key}
                  preview={false}
                  width={90}
                  height={90}
                  src={item.imagePath}
                />
              );
            })}
          </Space>
        </div>
        <div
          style={{
            border: "1px solid #53f2d4",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Title level={5} strong style={{ marginBottom: 20 }}>
            {t("aboutTheCharity")}
          </Title>
          <Paragraph style={{ marginBottom: 20 }}>
            {t("toyBoxAustralia")}
          </Paragraph>
          <Paragraph style={{ marginBottom: 20 }}>
            {t("ourMission")}
          </Paragraph>
          <Paragraph style={{ marginBottom: 20 }}>
            {t("ourVision")}
          </Paragraph>
          <Paragraph style={{ marginBottom: 20 }}>
            {t("fulfilOurMission")}
          </Paragraph>
          <Paragraph>
            {t("toyboxAustraliaWebsite")}{" "}
            <a href="https://toyboxaustralia.org/" target={"_blank"}>
              https://toyboxaustralia.org/
            </a>
          </Paragraph>
        </div>
      </div>
    </>
  );
};

export default Partner;
