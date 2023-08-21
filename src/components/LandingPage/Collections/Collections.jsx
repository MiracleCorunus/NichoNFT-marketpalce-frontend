import "./Collections.scss";
import { Image, Typography, Button, Row, Icon, Carousel } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MultipleSlider from "components/common/MultipleSlider";
import HeartImg from "assets/images/new/heart_icon.png";
import { useMediaQuery } from "react-responsive";
const { Title, Paragraph } = Typography;

const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

function Collections({ collections }) {
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const { t } = useTranslation();
  return (
    <div className="Collections dark-black">
      <div className="center-page">
        {!isMobile ? <Image preview={false} src={HeartImg} /> : null}
        <Title level={2} strong>
          {t("recommendeCollections")}
        </Title>
        {/* <MultipleSlider collections={collections} /> */}
        {isMobile ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "1rem",
              gap: "2rem",
            }}
          >
            {collections &&
              collections.slice(0, 4).map((collection, index) => (
                <div
                  className="wrapper"
                  key={index}
                  style={{
                    width: 360,
                    // border: "0.5px solid rgb(83, 242, 212)",
                    boxShadow: "0px 0px 20px rgb(89 86 229 / 61.8%)",
                  }}
                >
                  <Link
                    to={`/viewCollection?collectionId=${collection.objectId}`}
                  >
                    <div className="collection-img">
                      <Image
                        height={305}
                        preview={false}
                        src={collection.logoImage}
                      />
                    </div>
                    <Title level={3} className="title">
                      {collection.collectionTitle}
                    </Title>
                    <Paragraph className="description">
                      {collection.collectionDescription}
                    </Paragraph>
                  </Link>
                </div>
              ))}
          </div>
        ) : (
          <MultipleSlider collections={collections} />
        )}

        <div className="view-all-btn">
          <Link to={`/collections`}>
            <Button>
              <Row align="middle" justify="center">
                <div>view all</div>
              </Row>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Collections;
