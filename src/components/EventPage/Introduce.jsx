import { Typography, Row, Col, Image, Space } from "antd";
import Avatar2 from "assets/images/new/event/icons/event_page_profile.png";
// import Avatar from "assets/images/new/event/icons/officer.png";
import UserIcon from "assets/images/new/event/icons/user.png";
import AddressIcon from "assets/images/new/event/icons/address.png";
import CalendarIcon from "assets/images/new/event/icons/calendar.png";
import LocationIcon from "assets/images/new/event/icons/location.png";
import { useMediaQuery } from "react-responsive";
import ToyboxIcon from "assets/images/new/event/icons/Toybox.svg";

import { styles } from "./styles";
import { t } from "i18next";

const { Title, Paragraph } = Typography;

const TitleComponent = ({ imagePath, content }) => {
  return (
    <Space align="start" size={15} style={styles.nameComp}>
      <Image preview={false} width={30} height={30} src={imagePath} />
      <Title level={5} style={{ fontFamily: "Mukta" }} strong>
        {content}
      </Title>
    </Space>
  );
};
const TitleComponent5 = ({ imagePath, content }) => {
  return (
    <Space align="center" size={15} style={styles.nameComp}>
      <Image preview={false} width={30} height={30} src={imagePath} />
      <Title style={{ fontSize: "14px", fontFamily: "hemi head" }}>
        {content}
      </Title>
    </Space>
  );
};
const TitleComponent2 = ({ imagePath, content }) => {
  return (
    <Space align="center" size={15} style={styles.nameComp}>
      <Image preview={false} width={30} height={30} src={imagePath} />
      <Title style={{ fontSize: "14px", fontFamily: "hemi head" }}>
        {content}
      </Title>
    </Space>
  );
};
const TitleComponent3 = ({ imagePath, content }) => {
  return (
    <Space align="start" size={15} style={styles.nameComp}>
      <Image preview={false} width={35} height={35} src={imagePath} />
      <Title style={{ fontSize: "28px", fontFamily: "hemi head" }}>
        {content}
      </Title>
    </Space>
  );
};

const Introduce = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  return (
    <div style={styles.introduceBg}>
      <div className="page-content">
        <div style={styles.introduceCard}>
          <Row>
            {/* Left Content */}
            <Col xs={18} sm={18} md={9} lg={9} xl={9} xxl={9}>
              <div
                style={{ marginTop: isDesktopOrLaptop ? "-100px" : "-40px" }}
              >
                <Image
                  preview={false}
                  width={150}
                  height={150}
                  src={Avatar2}
                  style={styles.avatar}
                />
              </div>
              {/* Officer name */}
              <TitleComponent imagePath={UserIcon} content="Jett Lucas" />
              <Paragraph
                style={{
                  paddingRight: 80,
                  fontSize: "12px",
                  marginTop: 5,
                  marginBottom: 30,
                  fontFamily: "Mukta",
                }}
              >
                {t("founderDrifting")}
              </Paragraph>
              <TitleComponent5
                imagePath={ToyboxIcon}
                content={t("AnnualCollection")}
              />
              <Title></Title>
              <TitleComponent2
                imagePath={CalendarIcon}
                content="TBA"
                // content="7pm 13th-Oct-2022"
              />
              <br />
              <Space align="center" size={15} style={styles.nameComp}>
                <Image
                  preview={false}
                  width={30}
                  height={30}
                  src={LocationIcon}
                />
                <Title style={{ fontSize: "14px", fontFamily: "hemi head" }}>
                  {t("barbagalloWatch")}
                  <br />
                  {t("level133")}
                </Title>
              </Space>
            </Col>
            {/* Right Content */}
            <Col
              xs={30}
              sm={30}
              md={15}
              lg={15}
              xl={15}
              xxl={15}
              style={{
                border: "1px solid #53f2d4",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <TitleComponent3
                imagePath={AddressIcon}
                content={t("eventInfo")}
              />

              <Paragraph
                style={{
                  marginTop: 15,
                  padding: 5,
                  fontSize: "16px",
                  fontFamily: "hemi head",
                }}
              >
                {t("eventLaunched")}
              </Paragraph>

              {/* <TitleComponent
                imagePath={CalendarIcon}
                content="7pm 13th-Oct-2022"
              />
              <TitleComponent
                imagePath={LocationIcon}
                content="Barbagallo Watch (Level 1/133 St Georges Terrace, Perth WA 6000)"
              /> */}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
