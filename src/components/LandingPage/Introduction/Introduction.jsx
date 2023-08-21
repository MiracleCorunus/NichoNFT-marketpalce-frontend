import { Col, Row } from "antd";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";
import "./Introduction.scss";

function Introduction() {
  return (
    <div className="Introduction">
      <div className="center-page">
        <Row gutter={[30, 30]} justify="center">
          <Col lg={12} md={24} sm={24}>
            <LeftContent />
          </Col>
          <Col lg={12} md={24} sm={24}>
            <RightContent />
          </Col>
        </Row>
      </div>
      <video
        className="war3-homepage-video pc-video-bg"
        x5-playsinline=""
        playsInline=""
        webkit-playsinline=""
        autoPlay
        muted
        loop
        controlsList="nodownload"
        controls={false}
      >
        <source
          src="https://github.com/Nichonft-organization/nicho-assets/blob/main/1668422775966.mp4?raw=true"
          type="video/mp4"
        />
      </video>
    </div>
  );
}

export default Introduction;
