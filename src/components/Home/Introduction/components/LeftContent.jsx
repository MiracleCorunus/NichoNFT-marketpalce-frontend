import { useState, useEffect } from "react";
import { Button, Typography, Row } from "antd";
import useGetBNBPrice, { getFilteredPrice } from "hooks/useGetCoinPrice";

import "./LeftContent.scss";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react";

const { Title, Paragraph } = Typography;

function LeftContent() {
  const { user, Moralis, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const [totalMint, setTotalMint] = useState(0);
  const [totalSell, setTotalSell] = useState(0);
  const [tradeVolume, setTradeVolume] = useState(0);
  const bnbPrice = useGetBNBPrice(1);

  useEffect(() => {
    const getItem = async () => {
      if (!isInitialized) return;
      const TokenListTable = Moralis.Object.extend("TokenList");
      const query = new Moralis.Query(TokenListTable);
      query.notEqualTo("isBlackList", true);
      query.limit(99999999);
      const results = await query.find();
      setTotalMint(results.length);

      const SoldItemsTable = Moralis.Object.extend("SoldItems");
      const soldQuery = new Moralis.Query(SoldItemsTable);
      soldQuery.notEqualTo("isBlackList", true);
      const soldItems = await soldQuery.find();

      const AuctionTradedTable = Moralis.Object.extend("AuctionTraded");
      const AuctionTradedQuery = new Moralis.Query(AuctionTradedTable);
      AuctionTradedQuery.notEqualTo("isBlackList", true);
      const AuctionTradedItems = await AuctionTradedQuery.find();

      const OfferSoldOutTable = Moralis.Object.extend("OfferSoldOut");
      const OfferSoldOutQuery = new Moralis.Query(OfferSoldOutTable);
      OfferSoldOutQuery.notEqualTo("isBlackList", true);
      const OfferSoldOutItems = await OfferSoldOutQuery.find();

      setTotalSell(
        soldItems.length + AuctionTradedItems.length + OfferSoldOutItems.length
      );

      let totalPrice = 0;
      for (let i = 0; i < soldItems.length; i++) {
        const price = soldItems[i].get("price");
        totalPrice = totalPrice + Moralis.Units.FromWei(price);
      }

      setTradeVolume(totalPrice);
    };
    getItem();
  }, [user, isInitialized]);

  return (
    <div className="left-content">
      <Title level={4} type="blue">
        {t("theBestMultiChain")}
      </Title>
      <Title strong>{t("tradeCreateCollection")}</Title>
      <Title level={5} type="secondary">
        {t("NichoNFTIs")}
      </Title>
      <Row className="btn-group" align="middle">
        <Link to="/nftMarketPlace">
          <Button type="primary" id="explore">
            {t("explore")}
          </Button>
        </Link>
        <Link to="/createNFT">
          <Button ghost id="create">
            {t("create")}
          </Button>
        </Link>
        {/* <Link to="/">
          <Button ghost id="create" style={{padding: '15px 15px'}}>
            <Row><Icon icon="bxs:right-arrow" color="#9747ff" height="24" /></Row>
          </Button>
        </Link> */}
      </Row>
      <div className="status-list">
        <div className="status-item">
          <Title level={3} strong>
            {totalMint}
          </Title>
          <Paragraph strong>{t("NFTMinted")}</Paragraph>
        </div>
        <div className="status-item">
          <Title level={3} strong>
            {totalSell}{" "}
          </Title>
          <Paragraph strong>{t("NFTSold")}</Paragraph>
        </div>
        <div className="status-item">
          <Title level={3} strong>
            {" "}
            {getFilteredPrice(bnbPrice * tradeVolume)}
          </Title>
          <Paragraph strong>{t("tradingVolume")}</Paragraph>
        </div>
      </div>
    </div>
  );
}

export default LeftContent;
