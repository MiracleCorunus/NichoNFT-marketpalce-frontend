import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Typography, Row, Image } from "antd";
import { truncateHash } from "helpers/Utils";

// const { Title } = Typography;

const ExternalLink = ({ detail }) => {
  const { t } = useTranslation();
  // check if the link has valid http format
  const checkExternalLink = (link) => {
    if (link) {
      if (link.includes("https://") || link.includes("http://")) {
        return link;
      } else {
        return "https://" + link;
      }
    }
  };

  return (
    <Fragment>
      <div
        className="creator-info"
        style={{
          color: "white",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {t("externalLink")} &nbsp;
        <a href={checkExternalLink(detail.externalLink)} target="_blank">
          <span className="light-gray-txt" style={{ color: "#7774FF" }}>
            {" "}
            {detail.externalLink === "" ||
            detail.externalLink === undefined ||
            detail.externalLink === null
              ? t("noExternalLink")
              : detail.externalLink}
            {/* {truncateHash(detail && detail.externalLink, 6, 4)} */}
          </span>
        </a>
      </div>
      {/* <div className="creator-info avatar-img">
            <Title level={5}>Owner</Title>
            <Row justify='start' align='middle' style={{padding: '0'}}>
                <Image preview={false} src={detail?.creatorAvatar}/>
                <Link to={ `/profile?address=${detail?.creator}`}>                    
                    <Title level={5} style={{fontSize: '14px', lineHeight: '1'}} ellipsis>{ truncateHash(detail && detail.creator, 4, 4) }</Title>
                    <Title level={5} style={{fontSize: '14px', lineHeight: '1.2'}} ellipsis>{ truncateHash(detail && detail.creatorUsername, 6, 4) }</Title>

                </Link>
            </Row>
        </div> */}
    </Fragment>
  );
};
export default ExternalLink;
