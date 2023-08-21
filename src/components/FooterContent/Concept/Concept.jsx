import "./Concept.scss";
import { Typography, Image } from "antd";
import { useLocation } from "react-router";
import NichoImg from "assets/images/new/img_nicho.png";
import NichoImg2 from "assets/images/new/nichoimg2.png";
import { t } from "i18next";

const { Paragraph } = Typography;

function Concept() {
  const location = useLocation();

  const isLandingPage =
    location.pathname && location.pathname.indexOf("landingPage") > -1;

  return (
    <div className="Concept dark-black">

      <div className="center-page">
        <div className={`concept-content ${isLandingPage ? "gary-bg" : ""}`}>
          <Image preview={false} width={400} height={218} src={NichoImg} />
          <Image preview={false} width={270} height={90} src={NichoImg2} />

          {/* <Logo className="concept-icon" /> */}
          {/* <img className="concept-icon" style={{margin: '0 auto'}} src={LogoSvg} alt="Nicho AI NFT" /> */}
          {/* <Paragraph className="description">
            {t("NichoNFTCreation")}{" "}
            <span style={{ color: "#53f2d4" }}>Web 3.0</span> {t("journey")}.
          </Paragraph> */}
          <Paragraph className="description">{t("nichoDescription")}</Paragraph>
        </div>
      </div>
    </div>
  );
}

export default Concept;
