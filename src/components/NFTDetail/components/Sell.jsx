import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Typography, Col, Row, Tabs, Space } from "antd";
import FixedSell from "./SellType/FixedSell";
import TimedSell from "./SellType/TimedSell";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const Sell = ({ detail, onListUpdateHandle }) => {
  const { t } = useTranslation()
  return (
    <Fragment>
      <Col md={20} sm={24}>
        {/* <!-- Options --> */}
        <Title level={4} style={{ fontSize: "30px" }} strong>
          {t("listItemSale")}
        </Title>
        {/* <Title level={4}>{detail?.tokenName}</Title> */}
        {/* <!-- Collection name --> */}
        <div className="collection">
          <Link
            className="category"
            to={`/viewCollection?collectionId=${detail?.collectionId}`}
          >
            {detail?.collectionTitle}
          </Link>
        </div>

        <Tabs defaultActiveKey="1" className="sell-tabs">
          <TabPane tab="Fixed" key="1">
            <FixedSell
              detail={detail}
              onListUpdateHandle={onListUpdateHandle}
            />
          </TabPane>
          <TabPane tab={t("timedAuction")} key="2">
            <TimedSell
              detail={detail}
              onListUpdateHandle={onListUpdateHandle}
            />
          </TabPane>
        </Tabs>
      </Col>
    </Fragment>
  );
};
export default Sell;
