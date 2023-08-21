import { Fragment } from "react";
// import { Link } from "react-router-dom";
// import { Typography, Row, Image } from "antd";
// import { truncateHash } from "helpers/Utils";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";

// const { Title } = Typography;

const EtherscanLink = ({ detail }) => {
  const { chainId } = useMoralis();
  const { t } = useTranslation();

  // return the correct https address for blockchain explorer
  const getExplorerAddress = (tokenAddress) => {
    switch (chainId) {
      //bsc testnet
      case "0x61":
        return `https://testnet.bscscan.com/address/${tokenAddress}`;
      case "0x38":
        return `https://bscscan.com/address/${tokenAddress}`;
    }
  };

  return (
    <Fragment>
      <div className="creator-info" style={{ color: "white" }}>
        {t("blockchainExplorer")} &nbsp;
        <a href={getExplorerAddress(detail.tokenAddress)} target={"_blank"}>
          <span className="light-gray-txt" style={{ color: "#7774FF" }}>
            {" "}
            {t("here")}
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
export default EtherscanLink;
