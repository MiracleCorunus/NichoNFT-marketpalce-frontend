import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Typography, Row, Image } from "antd";
import { truncateHash } from "helpers/Utils";

// const { Title } = Typography;

const Owner = ({ detail }) => {
  return (
    <Fragment>
      <div className="creator-info" style={{ color: "white" }}>
        Owner &nbsp;
        <Link to={`/profile?address=${detail?.creator}`}>
          <span className="light-gray-txt" style={{ color: "#7774FF" }}>
            {" "}
            {truncateHash(detail && detail.creatorUsername, 6, 4)}
          </span>
        </Link>
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
export default Owner;
