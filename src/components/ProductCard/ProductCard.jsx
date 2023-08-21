import { Typography, Row, Col, Image } from "antd";
import "./ProductCard.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BNBIcon from "assets/images/bnb.png";

const { Title } = Typography;

function ProductCardBot({ product }) {
  const { t } = useTranslation();
  const { price, fixedPrice, auctionPrice } = product;
  return (
    <Row className="bot-wrap">
      <Col span={24}>
        <Title level={4} strong className="card-title">
          {product && product.tokenName}
        </Title>
      </Col>
      <p className="price-txt">{t("price")}:</p>
      <div className="money-wrap">
        <div className="left">
          <img src={BNBIcon} style={{ width: "20px" }} alt="Nicho AI NFT" />
          {fixedPrice && fixedPrice > 0 ? (
            fixedPrice
          ) : auctionPrice !== 0 ? (
            auctionPrice
          ) : (
            <span style={{ color: "darkgray", fontSize: "13px" }}>
              Not Listed
            </span>
          )}
        </div>

        <div className="right">
          <span className="gray">{t("lastSale")}</span>
          <img src={BNBIcon} style={{ width: "12px" }} alt="Nicho AI NFT" />
          {price}
        </div>
      </div>
    </Row>
  );
}

function ProductCard({ product }) {
  const { tokenIpfs, objectId, featureImage } = product;

  return (
    <div className="product-card-new">
      {/* 卡片样式 */}
      <Link
        to={`/nftDetail?id=${objectId}`}
        style={{ width: "100%", height: "100%" }}
      >
        <div
          className="image-wrapper"
          style={{ backgroundImage: `url(${tokenIpfs || featureImage})` }}
        />
      </Link>

      <ProductCardBot product={product} />
    </div>
  );
}

export default ProductCard;
