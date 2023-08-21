import Card from "./Card";
import { Typography, Image, Col, Row, Button } from "antd";
import { useTranslation } from "react-i18next";
import "./RecommendedCreators.scss";
import ProfileImg from "assets/images/new/marketPlace/profile.png";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;

function RecommendedCreators({ creators }) {
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const { t } = useTranslation();

  return (
    <div className="creators-new com-tiffany-bg">
      <div className="center-page">
        <Row justify="center" align="middle" style={{ marginBottom: "px" }}>
          <Image preview={false} src={ProfileImg} />
        </Row>
        <Row justify="center" align="middle" style={{ marginBottom: "46px" }}>
          <Title
            level={2}
            style={{ color: "#0F0D14", fontSize: isMobile ? 32 : 40 }}
            strong
          >
            {t("recommendedCreators")}
          </Title>
        </Row>

        {/* <div className="creators-list">
          <div className="creators-item">
            <Image preview={false} src={ProfileImg}/>
            <Title level={2} strong>Puff</Title>
            <p>0xfd83...0140</p>
            <p>Followers:12</p>

            <Button className="theme-button">Explore</Button>
          </div>
        </div> */}
        {isMobile ? (
          <>
            <div
              style={{
                display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                overflow: "scroll",
                height: "230px",
                width: "100%",
                gap: "60px",
                marginTop: "-2rem",
              }}
            >
              {creators &&
                creators.map((creator, index) => (
                  <Col key={index}>
                    <Card creator={creator} />
                  </Col>
                ))}
            </div>
          </>
        ) : (
          <Row gutter={[0, 40]} justify="center">
            {creators &&
              creators.map((creator, index) => (
                <Col key={index} xxl={3} xl={3} lg={4} md={6} sm={8} xs={12}>
                  <Card creator={creator} />
                </Col>
              ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default RecommendedCreators;
