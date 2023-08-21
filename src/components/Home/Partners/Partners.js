import './Partners.scss';
import { Col, Row, Typography, Button } from 'antd';
import Web3in from 'assets/images/partners/1.png';
import Taocapital from 'assets/images/partners/2.png';
import Digitaljournal from 'assets/images/partners/3.png';
import Marketwatch from 'assets/images/partners/4.png';
import Dailyherald from 'assets/images/partners/5.png';
import Benzinga from 'assets/images/partners/6.png';
import Jinse from 'assets/images/partners/7.png';
import Bnbchain from 'assets/images/partners/8.png';
import Ethereum from 'assets/images/partners/9.png';
import Polygon from 'assets/images/partners/10.png';
import Solana from 'assets/images/partners/11.png';
import Avax from 'assets/images/partners/12.png';
import Fantom from 'assets/images/partners/13.png';
import MagicCat from 'assets/images/partners/14.png';
import VrtualCaim from 'assets/images/partners/15.png';
import Dexnav from 'assets/images/partners/16.png';

import styled from "styled-components";
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next"

const Common = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const ImageWrapper = styled(Common)`
  width: 265px;
  // height: 120px;
  border-radius: 45px;
  background: #bf86ff7a;
  cursor: pointer;
  transition: all 0.2s ease-out;
  &:hover {
    transform: scale(1.05);
  }
`

const { Title } = Typography

function Partners() {
  const { t } = useTranslation();
  const imageList = [
    { url: Web3in, link: 'https://www.web3in.net/' },
    { url: Taocapital, link: 'https://www.taocapital.com.au/' },
    { url: Digitaljournal, link: 'https://www.digitaljournal.com/pr/nicho-nft-marketplace-bringing-nft-to-daily-life' },
    { url: Marketwatch, link: 'https://www.marketwatch.com/press-release/nicho-nft-marketplace-bringing-nft-to-daily-life-2022-04-01' },
    { url: Dailyherald, link: 'http://finance.dailyherald.com/dailyherald/news/read/42304957' },
    { url: Benzinga, link: 'https://www.benzinga.com/pressreleases/22/04/ab26425755/nicho-nft-marketplace-bringing-nft-to-daily-life' },
    { url: Jinse, link: 'https://www.jinse.com/news/blockchain/1202567.html' },
    { url: Bnbchain, link: 'https://www.bnbchain.world/en/smartChain' },
    { url: Ethereum, link: 'https://ethereum.org/' },
    { url: Polygon, link: 'https://polygon.technology/' },
    { url: Solana, link: 'https://solana.com/zh' },
    { url: Avax, link: 'https://www.avax.network/' },
    { url: Fantom, link: 'https://fantom.foundation/' },
    { url: MagicCat, link: 'https://themagiccoat.com/' },
    { url: VrtualCaim, link: 'https://virtualcaim.com/portfolio'},
    { url: Dexnav, link: 'https://dexnav.com/103/'}
  ]
  return (
    <div className="Partners">
      <Row justify="space-between" align="middle" style={{marginBottom: '50px'}}>
        <Title level={2} strong>{t("communitiesPartners")}</Title>
        {/* <Button>
          <Row align="middle" justify="center">
            <div>view all</div>
            <Icon icon="akar-icons:arrow-up-right" color="white" height="24" />
          </Row>
        </Button> */}
      </Row>
      <Row gutter={[30, 30]} style={{marginBottom: '30px'}}>
        {imageList.map((item, index) => (
          <Col xl={4} lg={4} md={4} sm={24} key={index}>
            <ImageWrapper style={{width: '100%'}}>
              <a href={item.link} style={{width: '100%', height: '80px'}}>
                <div style={{width: '100%', height: '80px', background: `url(${item.url})`, backgroundPosition: 'center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}></div>
              </a>
            </ImageWrapper>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Partners;