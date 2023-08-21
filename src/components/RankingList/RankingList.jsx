import { useEffect, useState } from "react";
import { Row, Col, Image, Table, Button, Tabs, Space, Select } from "antd";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./RankingList.scss";
import topImg from "assets/images/new/mintToEarn/top_img.png";
import yiwenSvg from "assets/images/new/mintToEarn/yiwen.svg";
import buyButtonImg from "assets/images/new/mintToEarn/buy_button.png";
import twoCircleImg from "assets/images/new/mintToEarn/two_circles.png";
import bgImg from "assets/images/new/mintToEarn/cloud.png";
import { HeartOutlined, EditOutlined } from "@ant-design/icons";
import ComingSoonTxt from 'components/common/ComingSoonTxt'

// import { getFollowerUserApi } from 'api/user';
const { Option } = Select;
const { TabPane } = Tabs;

const periods = ["24H", "7D", "30D"];

const data = [];

for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    collection: `Collection ${i}`,
    // volume: Math.random().toFixed(3),
    // floor: Math.random().toFixed(3),
    // item: Math.floor(Math.random() * 1000 + 1),
  });
}

const onTabChange = (key) => {};

const RankingList = () => {
  const { user, Moralis, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const [info, setInfo] = useState({});
  const [currentPeriod, setCurrentPeriod] = useState(periods[0]);
  const [liked, setLiked] = useState(false);

  const handleSelectedPeriod = (value) => {
    // console.log(`${value} selected`);
    setCurrentPeriod(value);
  };

  useEffect(() => {
    if (!isInitialized || !user) return;
  }, [user, isInitialized]);

  const columns = [
    {
      title: t("collectionName"),
      dataIndex: "collection",
      key: "collection",
      align: "center",
      render: (text) => {
        return (
          <>
            <a>{text}</a>
          </>
        );
      },
    },
    {
      title: t("volume"),
      dataIndex: "volume",
      key: "volume",
      align: "center",
      render: (text) => {
        let num = Math.random().toFixed(3);
        return (
          <>
            <span>{num} BNB</span>
          </>
        );
      },
    },
    {
      title: t("floor"),
      dataIndex: "floor",
      key: "floor",
      align: "center",
      render: (text) => {
        let num = Math.random() * 10 - 5;
        let num2 = Math.random().toFixed(3);
        return (
          <>
            <span>{num2} BNB</span>
            <br />
            {num < 0 ? (
              <>
                <span style={{ color: "red" }}>{num.toFixed(2)}%</span>
                <span> {currentPeriod}</span>
              </>
            ) : (
              <>
                <span style={{ color: "green" }}>+{num.toFixed(2)}%</span>
                <span> {currentPeriod}</span>
              </>
            )}
          </>
        );
      },
    },
    {
      title: t("totalItem(s)"),
      dataIndex: "item",
      key: "item",
      align: "center",
      render: (text) => {
        let num = Math.floor(Math.random() * 1000 + 1);
        return (
          <>
            <span>{num}</span>
          </>
        );
      },
    },
    // {
    //   title: "Operate",
    //   dataIndex: "name",
    //   key: "name",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <span className="theme-color-txt">Connect</span>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div className="mint-to-earn center-page2">
      <ComingSoonTxt />
      
      <div className="earn-bot-content">
        <Row gutter={[16, 26]}>
          <Col span={24}>
            <img
              style={{ width: "81px", margin: "4px auto", display: "block" }}
              src={twoCircleImg}
              alt="Nicho AI NFT"
            />
            <h2 className="theme-color-txt">{t("rankingList")}</h2>
            <p className="fine-desc">
              {t("withTradingVolume")}
              {/* Listings from the following eligible
              <br />
              collections are currently earning points every 7 days */}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Select
                defaultValue={periods[0]}
                size="small"
                style={{
                  width: 120,
                }}
                onChange={handleSelectedPeriod}
              >
                {periods.map((period, index) => (
                  <Option key={index} value={period}>
                    {period}
                  </Option>
                ))}
                {/* <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option> */}
              </Select>
            </div>
            {/* <div
              className="program-content"
              style={{ backgroundImage: `url(${bgImg})` }}
            >
              <Row>
                <Col span={6}>
                  <div>
                    <p>Your Points</p>
                    <p className="program-value">0000</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <p>Est.Listing Rewards </p>
                    <p className="program-value">0000</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <p>Last Updated</p>
                    <p className="program-value">0000</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <p> Next Distribution</p>
                    <p className="program-value">0000</p>
                  </div>
                </Col>
              </Row>
            </div> */}
          </Col>
          <Col span={24}>
            {/* <h2>Mint Points Leaderboard</h2> */}
            {/* <p className="fine-desc" style={{ maxWidth: '830px' }}>The top 15 collections with over 0% royalties earn points every 7 days. Set a price within 1.4x of the global floor price to start accumulating points!</p> */}
            <Table
              className="common-table purple-theme"
              dataSource={data}
              columns={columns}
            />
          </Col>
        </Row>
        <Row>
          {/* <Col span={12}>
                        <div className="tab-card">
                            <div className="card-header">
                                <span>NICHO Compounder</span>
                                <span className="sub-txt">Earn NICHO & More NICHO!</span>
                            </div>
                            <div className="card-content">
                                <div>
                                    <img src={icon2} alt="Nicho AI NFT" />
                                    <img
                                        style={{
                                            marginLeft: "-6px",
                                            position: "relative",
                                            zIndex: 1,
                                        }}
                                        src={icon1}
                                        alt="Nicho AI NFT"
                                    />
                                </div>
                                <div className="txt">
                                    51.50% APY
                                    <img
                                        style={{ width: "12px", margin: "4px" }}
                                        src={yiwenSvg}
                                        alt="Nicho AI NFT"
                                    />
                                </div>
                                <Button className="connect-wallet">Connect Wallet</Button>
                            </div>
                        </div>
                    </Col> */}
          {/* <Col span={12}>
            <div className="tab-card tab-card2" style={{ marginTop: "85px" }}>
              <div className="card-header">How Does it Work?</div>
              <div className="card-content">
                <Row>
                  <Col className="inner-card" span={12}>
                    <h6>Trading Rewards</h6>
                    <p>
                      Earn trading rewards when you buy or sell any NFT on
                      LooksRare(private listings excluded).Rewards distributed
                      once daily.
                    </p>
                    <Link className="theme-color-txt" to="/">
                      Learn More
                    </Link>
                  </Col>
                  <Col className="inner-card" span={12}>
                    <h6>Listing Rewards</h6>
                    <p style={{ height: "64px" }}>
                      Earn points by listing NFTs fromeligible collections.
                      Points convert to LookS once daily!
                    </p>
                    <Link to="/" className="theme-color-txt">
                      Learn More
                    </Link>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col span={12} style={{ paddingLeft: "85px" }}>
            <img className="top-right-img" src={topImg} alt="Nicho AI NFT" />
          </Col> */}
        </Row>
      </div>

      {/* <div className="earn-bot-footer">
        <p>NICHO helps you to create value in Web3.</p>
        <h5>Get the NICHO now!</h5>
        <img src={buyButtonImg} alt="Nicho AI NFT" />
        <div className="fine-desc">
          <p>
            The rates shown on this page are only provided for your reference:
            APR and APY are calculated based on current ROI.
          </p>
          <p>
            The actual rates will fluctuate a lot according to many different
            factors, including token prices, trading volume, liquidity, amount
            staked, and more.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default RankingList;
