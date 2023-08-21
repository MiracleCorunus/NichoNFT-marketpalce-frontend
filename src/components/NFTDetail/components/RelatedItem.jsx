import { Fragment } from "react";
import { Typography, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import ProductCard from "components/ProductCard";

const { Title } = Typography;

const RelatedItem = ({ items }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className="related-items">
        <Title level={2} style={{ textAlign: "center" }} strong>
          {t("relatedItems")}
        </Title>
        <Row gutter={[30, 30]} justify="center">
          {items?.map((product, index) => (
            <Col xl={6} lg={8} md={12} sm={24} key={index}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </Fragment>
  );
};
export default RelatedItem;
