import { Typography, Button, message, Row, Col } from 'antd';
import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './OtherNFTCard.scss';
import { useMoralis } from 'react-moralis';
import { useTranslation } from 'react-i18next';
import { getExplorerAddress } from 'helpers/networks';
import { sleep } from 'helpers/Utils';

const { Title, Paragraph } = Typography;

function OtherNFTCard({ product, handleRefresh }) {
  const [waiting, setWaiting] = useState(false);

  const { Moralis, isAuthenticated, user, chainId } = useMoralis();
  const { t } = useTranslation();
  const { name, metadata, token_address, image, objectId } = product;

  const showSuccess = (msg) => {
    message.success(msg)
  }
  
  const showError = (msg) => {
    message.error(msg)
  }

  const registerNFT = async () => {
    try {
      if (!product || !user) return;
      setWaiting(true)
      const arr = [product];
      const queryParams = {
        metadataArray: arr
      };

      const result = await Moralis.Cloud.run(
        "RegisterNFTs",
        queryParams
      );
      
      if(result) {
        showSuccess(t("successfullyRegistered"))
        await sleep(1000)
        handleRefresh();
      } else {
        showError(t("registerfailed"))
      }
    } catch (err) {
      console.log(err);
      showError(t("registerfailed"))
    } finally {
      setWaiting(false)
    }
  }

  return (
    <div className="product-card-new other-nft-card">
      {/* <div className="image-wrapper">
        <Fragment>
          { image && <img src={image} /> }
        </Fragment>
      </div> */}
      <Link to={ `/nftDetail?id=${objectId}`} style={{width: '100%', height: '100%'}}>
        <div className="image-wrapper" style={{ backgroundImage: `url(${image})`}} />
      </Link>

      <Row className="bot-wrap other-bot-wrap">
        <Col span={24}>
          <Title level={4} strong className="card-title">{ metadata?.name }</Title>
        </Col>
        <a href={getExplorerAddress(chainId, token_address)} className="description" target={"_blank"}>
          <Paragraph ellipsis={{ rows: 2 }}>{ name }</Paragraph>
        </a>

        <div className="other-bottom-group">
        { !isAuthenticated ? <Fragment/> :
          <Fragment>
            <Button type='primary' onClick={() => { registerNFT(); }} disabled={waiting} size="small"> {t("registerNFT")}</Button>
          </Fragment> 
        }
      </div>
  
      </Row>

      {/* <Title level={4} strong className="title">{ metadata && metadata.name }</Title>
      <a href={getExplorerAddress(chainId, token_address)} target={"_blank"}>
        <Paragraph className="description" type="secondary">{ name }</Paragraph>
      </a>

      <div className="type2-bottom-group">
        { !isAuthenticated ? <Fragment/> :
          <Fragment>
            <Button type='primary' onClick={() => { registerNFT(); }} disabled={waiting}> Register NFT</Button>
          </Fragment> 
        }
      </div> */}
    </div>
  );
}

export default OtherNFTCard;