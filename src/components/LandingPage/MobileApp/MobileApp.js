import React from "react";
import "./MobileApp.scss";
import { Col, Popover, Row, Typography } from "antd";
import appImage1 from "./images/Nicho_iphoneA1.svg";
import appImage2 from "./images/Nicho_iphoneA2.svg";
import MobileStoreButton from "react-mobile-store-button";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";

const MobileApp = () => {
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const { t } = useTranslation();
  const appStoreUrl =
    "https://www.figma.com/file/ZDPBVdBWLE7JTJnXs90Yf2/NFT-Mobile-App-(Frankuh)?node-id=0%3A1&t=An6iL6ayeMNFGLIu-1";

  return (
    <div className="center-page mobile-app-wrapper">
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <div className="mobile-app-wrapper-left">
            <div style={{ position: "relative" }}>
              <img src={appImage1} alt="mobile" width={"80%"} />
              <img
                src={appImage2}
                alt="mobile"
                width={"70%"}
                // height={"100%"}
                className="mobile-app-wrapper-left-img2"
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <div className="mobile-app-wrapper-right">
            <div className="mobile-app-mobile-download">
              <div
                style={{
                  width: isMobile ? "80%" : "100%",
                  padding: isMobile ? "0 3.5rem" : "0 1rem",
                  // WebkitLineClamp: "2",
                  // background: "#217AFF",
                  background:
                    "linear-gradient(to right, #217AFF 0%, #AD6EFF 100%)",
                  WebkitBackgroundClip: "text",
                  webkitTextFillColor: "transparent",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: "2rem",
                }}
              >
                <p>{t("unlockThePower")}</p>
              </div>
              <Popover
                style={{ width: "300px" }}
                color="black"
                content={
                  <div style={{ color: "white", textAlign: "center" }}>
                    <p style={{ fontWeight: "900" }}>
                      {t("popoverComingSoon")}
                    </p>
                    <p style={{ fontWeight: "200" }}>
                      {t("mobileAppDescription")}
                    </p>
                  </div>
                }
              >
                <div style={{ width: 300, height: 75 }}>
                  <MobileStoreButton store="ios" url={appStoreUrl} />
                </div>
              </Popover>

              <div
                style={{
                  width: "100%",
                  marginLeft: 156,
                }}
              >
                <Popover
                  style={{ width: "300px", marginLeft: 156 }}
                  color="black"
                  content={
                    <div style={{ color: "white", textAlign: "center" }}>
                      <p style={{ fontWeight: "900" }}>
                        {t("popoverComingSoon")}
                      </p>
                      <p style={{ fontWeight: "200" }}>
                        {t("mobileAppDescription")}
                      </p>
                    </div>
                  }
                >
                  <MobileStoreButton
                    store="android"
                    url={appStoreUrl}
                    width={450}
                    height={113}
                  />
                </Popover>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MobileApp;
