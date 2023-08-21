import { Typography, Row, Col, Image } from "antd";
import { useTranslation } from "react-i18next";
import NichoImg from "assets/images/new/event/icons/australia.png";
import { styles } from "./styles";
import { useMediaQuery } from "react-responsive";

const { Title, Paragraph } = Typography;

const BannerContent = () => {
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const { t } = useTranslation();
  return (
    <div style={styles.bannerContent}>
      <div className="page-content">
        <div style={styles.spaceAlignBlock}>
          <Row justify="center" align="middle">
            <Col lg={10} md={12} sm={15} xs={24}>
              <div style={styles.bannerTitle}>
                <Title
                  style={{ ...styles.gulfFont, fontSize: isMobile && "30px" }}
                  level={1}
                >
                  {t("welcome")}
                </Title>
                <Title
                  style={{ ...styles.gulfFont, fontSize: isMobile && "30px" }}
                  level={1}
                >
                  {t("toAustralia")}
                </Title>

                <Paragraph style={styles.blackStyle}>
                  {t("welcomeToAustralia")}
                </Paragraph>
              </div>
            </Col>

            <Col lg={14} md={12} sm={9} xs={24}>
              <Image preview={false} src={NichoImg} />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default BannerContent;
