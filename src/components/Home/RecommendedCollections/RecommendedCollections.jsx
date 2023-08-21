import Card from "./Card";
import CollectionCard from "components/CollectionCard";
import { Button, Typography } from 'antd';
import { Icon } from '@iconify/react';
import './RecommendedCollections.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next"

const { Col, Row } = require("antd");
const { Title } = Typography;

function RecommendedCollections({ collections }) {
  const { t } = useTranslation()
  return (
    <div className="recommended-collections">
      <Row justify="space-between" align="middle" style={{marginBottom: '50px'}}>
        <Title level={2} strong>{t("recommendeCollections")}</Title>
        <Link to={ `/collections`}>
          <Button>
            <Row align="middle" justify="center">
              <div>view all</div>
              <Icon icon="akar-icons:arrow-up-right" color="white" height="24" />
            </Row>
          </Button>
        </Link>
      </Row>
      <Row gutter={[30, 30]} justify="left">
        {collections && collections.map((collection, index) => (
          <Col key={index} lg={6} md={24} sm={24}>
            <CollectionCard collection={collection}/>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default RecommendedCollections;