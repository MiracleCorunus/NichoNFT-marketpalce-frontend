import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  Table,
  Button,
  Tooltip,
  Modal,
  Tabs,
  message,
  Typography,
  Space,
} from "antd";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./MintToEarn.scss";
import topImg from "assets/images/new/mintToEarn/top_img.png";
import buyButtonImg from "assets/images/new/mintToEarn/buy_button.png";
import twoCircleImg from "assets/images/new/mintToEarn/two_circles.png";
import bgImg from "assets/images/new/mintToEarn/cloud.png";
import getCurrentWeekInfo from "api/getCurrentWeekInfo";
import { nichoRewardABI, rewardAddress } from "contracts/constants";
import BigNumber from "bignumber.js";
import { getMintRankApi } from "api/assets";
import moment from "moment";
import calendarImg from "assets/images/new/tradeToEarn/calendar.png";
import iconDown from "assets/images/new/tradeToEarn/icon_down.png";
import iconUp from "assets/images/new/tradeToEarn/icon_up.png";
import { useMediaQuery } from "react-responsive";

// import { getFollowerUserApi } from 'api/user';
const { Title } = Typography;
const { TabPane } = Tabs;

const statisticsStyles = {
  alignSelf: "flex-start",
  display: "flex",
  justifyContent: "center",
  alignItems: "baseline",
  gap: "1rem",
  color: "white",
};
const statisticsFontStyles = {
  color: "rgb(83, 242, 212)",
  fontSize: "1.5rem",
  margin: 0,
};

const MintToEarn = () => {
  const isMobile = useMediaQuery({ maxWidth: 750 });
  const { user, Moralis, isInitialized, isWeb3Enabled } = useMoralis();
  const { t } = useTranslation();
  const [waiting, setWaiting] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const [curWeekData, setCurWeekData] = useState(0);
  const [userRewardsData, setUserRewardsData] = useState();
  const [mintTopData, setMintTopData] = useState([]);
  const [plansMintAmount, setPlansMintAmount] = useState(0);
  const [weekNum, setWeekNum] = useState(0);

  const columns = [
    {
      title: t("rank"),
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: t("collectionName"),
      dataIndex: "collectionName",
      key: "collectionName",
    },
    {
      title: t("mintedAmount"),
      dataIndex: "mintedAmount",
      key: "mintedAmount",
    },
    {
      title: t("floor"),
      dataIndex: "floorPrice",
      key: "floorPrice",
    },
    {
      title: t("rewardAmount"),
      dataIndex: "rewardsAmount",
      key: "rewardsAmount",
    },
    {
      title: t("lastUpdated"),
      dataIndex: "lastUpdated",
      key: "lastUpdated",
    },
  ];

  const showError = (msg) => {
    const secondsToGo = 3;
    const modal = Modal.error({
      title: t("error"),
      content: msg,
    });

    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  };

  const showSuccess = (msg) => {
    const secondsToGo = 3;
    const modal = Modal.success({
      title: `${t("success")}!`,
      content: msg,
    });

    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  };

  const onClaim = async () => {
    try {
      setWaiting(true);
      const params = {
        contractAddress: rewardAddress,
        functionName: "claimMintRewards",
        abi: nichoRewardABI,
        params: {},
      };

      await contractProcessor.fetch({
        params,
        onSuccess: async (result) => {
          showSuccess(t("youClaimed"));
          setWaiting(false);
        },
        onError: (err) => {
          console.log("Error: ", err);
          const { data } = err;
          showError(data.message);
          setWaiting(false);
        },
      });
    } catch (err) {
      console.log("Error: ", err);
      showError(err);
      setWaiting(false);
    }
  };

  const prevWk = () => {
    if (weekNum > 2) {
      const newWkNum = weekNum - 1;
      setWeekNum(newWkNum);
    }
  };

  const nextWk = () => {
    if (weekNum < 52) {
      const newWkNum = weekNum + 1;
      setWeekNum(newWkNum);
    }
  };

  useEffect(() => {
    const getWeekData = async () => {
      try {
        const weekData = await getCurrentWeekInfo();
        // console.log("weekData: ", weekData);
        setCurWeekData(weekData);
        if (weekData && weekData.weekOfYear) {
          setWeekNum(weekData.weekOfYear);
          // fetchMintRewardTopData(weekNum);
          // fetchRewardPoolByWeekNum(weekNum);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getWeekData();
  }, []);

  useEffect(() => {
    const getUserRewardsData = () => {
      if (user && isInitialized && isWeb3Enabled) {
        fetchUserRewardsData();
      }
    };

    getUserRewardsData();
  }, [user, isInitialized, isWeb3Enabled]);

  useEffect(() => {
    // const rewardsNo = getCurrentYear().toString().concat(weekNum);
    const getMintRewardTopData = async () => {
      if (
        isInitialized &&
        isWeb3Enabled &&
        weekNum !== undefined &&
        weekNum > 0
      ) {
        fetchMintRewardTopData(weekNum);
        fetchRewardPoolByWeekNum(weekNum);
      }
    };

    getMintRewardTopData();
  }, [weekNum, isInitialized, isWeb3Enabled]);

  const fetchUserRewardsData = () => {
    try {
      const params = {
        contractAddress: rewardAddress,
        functionName: "userCurrentMintRewardsData",
        abi: nichoRewardABI,
        params: {
          userAddress: user.get("ethAddress"),
        },
      };

      contractProcessor.fetch({
        params,
        onSuccess: async (result) => {
          // console.log("userRewardsData: ", result);
          setUserRewardsData(result);
        },
        onError: (err) => {
          console.log("Error: ", err.message);
        },
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const fetchRewardPoolByWeekNum = async (weekNum) => {
    try {
      const week = weekNum < 10 ? "0" + weekNum : weekNum.toString();
      const no = new Date().getUTCFullYear().toString() + week;
      const params = {
        contractAddress: rewardAddress,
        functionName: "rewardsMetaData",
        abi: nichoRewardABI,
        params: {
          rewardsNo: no,
        },
      };
      contractProcessor.fetch({
        params,
        onSuccess: async (result) => {
          if (result) {
            setPlansMintAmount(result.plansMintAmount);
          }
        },
        onError: (err) => {
          console.log("Error: ", err.message);
        },
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const fetchMintRewardTopData = async (weekNum) => {
    try {
      const data = await getMintRankApi(weekNum, 20);
      if (data) {
        const dataList = [];
        const len = data.length;
        for (let i = 0; i < len; i++) {
          const userReward = data[i];
          dataList.push({
            key: `${i}`,
            rank: userReward.rankNo,
            collectionName: userReward.collectionName,
            mintedAmount: userReward.mintedAmount,
            floorPrice: `${userReward.floorPrice} BNB`,
            rewardsAmount: `${userReward.rewardsAmount} Nicho`,
            lastUpdated: userReward.updatedAt,
          });
        }
        setMintTopData(dataList);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div className="mint-to-earn center-page2">
      <div className="earn-bot-content">
        <Row gutter={[16, 26]}>
          <Col span={24}>
            <img
              style={{ width: "81px", margin: "4px auto", display: "block" }}
              src={twoCircleImg}
              alt="Nicho AI NFT"
            />
            <h2 className="theme-color-txt">{t("mintEarnProgram")}</h2>
            <p className="fine-desc">
              {t("mintEarnProgramOnly")}
              <br />
              {t("freeCollectionCreators")}
            </p>

            {isMobile ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgb(22, 24, 34)",
                    padding: "1rem",
                    borderRadius: "1rem",
                  }}
                >
                  <div>
                    {userRewardsData &&
                      userRewardsData.userRewardsAmount > 0 &&
                      !userRewardsData.mintClaimStatus && (
                        <Button
                          className="claim-button"
                          onClick={() => onClaim()}
                          loading={waiting}
                          type="primary"
                        >
                          {t("claim")}
                        </Button>
                      )}

                    {userRewardsData && userRewardsData.mintClaimStatus && (
                      <Button disabled className="claim-button" type="primary">
                        {t("claimed")}
                      </Button>
                    )}

                    {(!userRewardsData ||
                      !userRewardsData.userRewardsAmount ||
                      userRewardsData.userRewardsAmount===0) && (
                      <Tooltip placement="right" title={t("notStillMinted")}>
                        <Button
                          disabled
                          className="claim-button"
                          type="primary"
                        >
                          {t("claim")}
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                  <div
                    style={{
                      ...statisticsStyles,
                      marginTop: "1rem",
                    }}
                  >
                    <p>{t("yourPoints")}</p>
                    <p style={{ ...statisticsFontStyles, marginLeft: 15 }}>
                      {userRewardsData && userRewardsData.userMints
                        ? `${userRewardsData.userMints}`
                        : "0"}
                    </p>
                  </div>
                  <div
                    style={{
                      ...statisticsStyles,
                    }}
                  >
                    <p>{t("yourRewards")}</p>
                    <p style={{ ...statisticsFontStyles }}>
                      {userRewardsData && userRewardsData.userRewardsAmount
                        ? `${new BigNumber(
                            Moralis.Units.FromWei(
                              userRewardsData.userRewardsAmount,
                              9
                            )
                          ).toFixed(2)} Nicho`
                        : "0 Nicho"}
                    </p>
                  </div>
                  <div style={{ ...statisticsStyles }}>
                    <p>{t("yourBalance")}</p>
                    <p style={{ ...statisticsFontStyles }}>
                      {userRewardsData && userRewardsData.userTokenBalance
                        ? `${new BigNumber(
                            Moralis.Units.FromWei(
                              userRewardsData.userTokenBalance,
                              9
                            )
                          ).toFixed(2)} Nicho`
                        : "0 Nicho"}
                    </p>
                  </div>
                  <div style={{ ...statisticsStyles }}>
                    <p> {t("claimableP")}</p>
                    <p style={{ ...statisticsFontStyles }}>
                      <span>{`${
                        curWeekData &&
                        curWeekData.beginOfWeek &&
                        moment(curWeekData.beginOfWeek).format("Do MMM")
                      }`}</span>
                      ~
                      <span>{`${
                        curWeekData &&
                        curWeekData.endOfWeek &&
                        moment(curWeekData.endOfWeek).format("Do MMM")
                      } (UTC)`}</span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="program-content"
                  style={{ backgroundImage: `url(${bgImg})` }}
                >
                  <Row>
                    <Col>
                      <div>
                        <p>{t("yourPoints")}</p>
                        <p className="program-value">
                          {userRewardsData && userRewardsData.userMints
                            ? `${userRewardsData.userMints}`
                            : "0"}
                        </p>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <p>{t("yourRewards")}</p>
                        <p className="program-value">
                          {userRewardsData && userRewardsData.userRewardsAmount
                            ? `${new BigNumber(
                                Moralis.Units.FromWei(
                                  userRewardsData.userRewardsAmount,
                                  9
                                )
                              ).toFixed(2)} Nicho`
                            : "0 Nicho"}
                        </p>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <p>{t("yourBalance")}</p>
                        <p className="program-value">
                          {userRewardsData && userRewardsData.userTokenBalance
                            ? `${new BigNumber(
                                Moralis.Units.FromWei(
                                  userRewardsData.userTokenBalance,
                                  9
                                )
                              ).toFixed(2)} Nicho`
                            : "0 Nicho"}
                        </p>
                      </div>
                    </Col>
                    <Col className="period">
                      <div>
                        <p> {t("claimableP")}</p>
                        <p className="program-value begin-of-week">
                          <span>{`${
                            curWeekData &&
                            curWeekData.beginOfWeek &&
                            moment(curWeekData.beginOfWeek).format("Do MMM")
                          }`}</span>
                          ~
                          <span>{`${
                            curWeekData &&
                            curWeekData.endOfWeek &&
                            moment(curWeekData.endOfWeek).format("Do MMM")
                          } (UTC)`}</span>
                        </p>
                      </div>
                    </Col>

                    <Col className="claim-wrap">
                      <div>
                        {userRewardsData &&
                          userRewardsData.userRewardsAmount > 0 &&
                          !userRewardsData.mintClaimStatus && (
                            <Button
                              className="claim-button"
                              onClick={() => onClaim()}
                              loading={waiting}
                              type="primary"
                            >
                              {t("claim")}
                            </Button>
                          )}

                        {userRewardsData && userRewardsData.mintClaimStatus && (
                          <Button
                            disabled
                            className="claim-button"
                            type="primary"
                          >
                            {t("claimed")}
                          </Button>
                        )}

                        {(!userRewardsData ||
                          !userRewardsData.userRewardsAmount ||
                          userRewardsData.userRewardsAmount===0) && (
                          <Tooltip
                            placement="right"
                            title={t("notStillMinted")}
                          >
                            <Button
                              disabled
                              className="claim-button"
                              type="primary"
                            >
                              {t("claim")}
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </>
            )}
          </Col>
          <Col span={24}>
            <Row className="table-title" justify="space-between">
              <Col span={14}>
                <span>
                  WK.{weekNum} {t("rewardPoolAmount")}{" "}
                </span>
                <span className="theme-color-txt">{`${new BigNumber(
                  Moralis.Units.FromWei(plansMintAmount, 9)
                ).toFixed(2)} Nicho`}</span>
              </Col>
              <Col
                span={10}
                style={{ textAlign: "right", paddingRight: "50px" }}
              >
                <Space align="center" style={{ color: "white" }}>
                  <img src={calendarImg} alt="Nicho AI NFT" />
                  <img
                    src={iconDown}
                    style={{ cursor: "pointer" }}
                    onClick={prevWk}
                    alt="Nicho AI NFT"
                  />
                  <span> wk.{weekNum}</span>
                  <img
                    src={iconUp}
                    style={{ cursor: "pointer" }}
                    onClick={nextWk}
                    alt="Nicho AI NFT"
                  />
                </Space>
              </Col>
            </Row>
            <Table
              className="common-table purple-theme"
              dataSource={mintTopData}
              columns={columns}
              pagination={false}
              scroll={{ x: 100 }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={24}>
            <div className="tab-card tab-card2" style={{ marginTop: "85px" }}>
              <div className="card-header">{t("howDoesWork")}</div>
              <div className="card-content">
                <Row>
                  <Col className="inner-card" span={24}>
                    <h6>{t("mintingRewards")}</h6>
                    <p>{t("earnMintingRewards")}</p>
                    <a
                      href="https://nichonft.gitbook.io/nicho-nft-whitepaper/product-and-functions/earn/mint-to-earn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {" "}
                      {t("learnMore")}
                    </a>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col md={12} sm={24} style={{ paddingLeft: "85px" }}>
            <img className="top-right-img" src={topImg} alt="Nicho AI NFT" />
          </Col>
        </Row>
      </div>

      <div className="earn-bot-footer">
        <p>{t("NICHOHelpsYou")}</p>
        <h5>{t("getTheNICHONow")}</h5>
        <img src={buyButtonImg} alt="Nicho AI NFT" />
        <div className="fine-desc">
          <p>{t("theRatesShown")}</p>
          <p>{t("actualRates")}</p>
        </div>
      </div>
    </div>
  );
};

export default MintToEarn;
