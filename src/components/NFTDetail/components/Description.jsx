import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Typography, Row, Image } from "antd";
import { useTranslation } from "react-i18next";
import { truncateHash } from "helpers/Utils";

const { Title } = Typography;

const Description = ({ detail }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div
        className="creator-info gray-color-txt"
        style={{ overflow: "hidden" }}
      >
        {t("description")}:
        <br />
        <span style={{ color: "#FFFFFF" }}>{detail?.tokenDescription}</span>
      </div>
      {/* <div className="creator-info avatar-img">
            <Title level={5}>Minter</Title>
            <Row justify='start' align='middle' style={{padding: '0'}}>
                <Image preview={false} src={detail?.minterAvatar}/>
                <Link to={ `/profile?address=${detail?.minter}`}>                    
                    <Title level={5} style={{fontSize: '14px', lineHeight: '1'}} ellipsis>{ truncateHash(detail && detail.minter, 4, 4) }</Title>
                    <Title level={5} style={{fontSize: '14px', lineHeight: '1.2'}} ellipsis>{ truncateHash(detail && detail.minterUsername, 6, 4) }</Title>
                </Link>
            </Row>
        </div> */}
    </Fragment>
  );
};
export default Description;
