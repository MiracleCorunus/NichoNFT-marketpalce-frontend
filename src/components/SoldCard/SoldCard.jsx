import { Typography, Button, Spin, Row, Col } from 'antd';
import { useState, useEffect, Fragment } from 'react';import { nichonftABI, contractAddress } from 'contracts/constants';
import { useTranslation } from "react-i18next"

import './SoldCard.scss';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;


function SoldCard({ product }) {
  const { t } = useTranslation();

  const { tokenName, tokenIpfs, price, objectId } = product;

  return (
     <div className="sold-card-new">
      
      {/* 卡片样式 */}
      <Link to={ `/nftDetail?id=${objectId}`} style={{width: '100%', height: '100%'}}>
        <div className="image-wrapper" style={{ backgroundImage: `url(${tokenIpfs})`}} />
      </Link>
      
      <Row className="bot-wrap" style={{textAlign: 'center', padding: '15px 0 0'}}>
        <Fragment>
          <Title level={4} className="title light-gray-txt">{tokenName}</Title>

          <Paragraph style={{ fontSize: '14px', padding: '2px 10px'}}>{t("soldOutIn")} { price } BNB</Paragraph>
          <Paragraph style={{ fontSize: '12px'}}>{t("fromYou")}</Paragraph>
        </Fragment> 
      </Row>
    </div>
  );
}

export default SoldCard;