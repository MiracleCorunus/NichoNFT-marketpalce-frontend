import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Typography, Row, Image } from "antd";
import { truncateHash } from "helpers/Utils";

const { Title } = Typography;

const Minter = ({ detail }) => {
  return (
    <Fragment>
      <div className="creator-info " style={{ color: "white" }}>
        Minter &nbsp;
        {
          detail && detail.minter && (
            <Link to={`/profile?address=${detail?.minter}`}>
              <span className="light-gray-txt" style={{ color: "#7774FF" }}>
                {" "}
                {detail && truncateHash(detail.minterUsername, 6, 4)}
                {(detail && detail.minterUsername===null) && truncateHash(detail.minter, 6, 4)}
              </span>
            </Link>
          )

        }
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
export default Minter;
