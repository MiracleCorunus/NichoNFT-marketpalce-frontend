import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  Table,
  Button,
  Tooltip,
  Modal,
  message,
  Typography,
  Space,
} from "antd";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useTranslation } from "react-i18next";
import "./TradeToEarn.scss";
import SubTitle from "components/common/SubTitle";
import Back from "assets/images/new/back.png";
import topImg from "assets/images/new/tradeToEarn/top_img.png";
import calendarImg from "assets/images/new/tradeToEarn/calendar.png";
import iconDown from "assets/images/new/tradeToEarn/icon_down.png";
import iconUp from "assets/images/new/tradeToEarn/icon_up.png";
import { getCurrentYear, truncateHash } from "helpers/Utils";
import getCurrentWeekInfo from "api/getCurrentWeekInfo";
import { nichoRewardABI, rewardAddress } from "contracts/constants";
import {
  LeftOutlined,
  RightOutlined,
  ExclamationCircleOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import BigNumber from "bignumber.js";
import { allCountries } from "helpers/constants/countries";
// import Hearts from 'assets/images/new/TradeToEarn/hearts.png';
import { getTradeRankApi } from "api/assets";
import moment from "moment";

const { Title } = Typography;

const TradeToEarn = () => {
  const { user, Moralis, isInitialized, isWeb3Enabled } = useMoralis();
  const { t } = useTranslation();
  const contractProcessor = useWeb3ExecuteFunction();
  const [curWeekData, setCurWeekData] = useState(0);
  const [userRewardsData, setUserRewardsData] = useState();
  const [weekNum, setWeekNum] = useState(0);
  const [tradeTopData, setTradeTopData] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [plansTradeAmount, setPlansTradeAmount] = useState(0);

  const columns = [
    {
      title: t("rank"),
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: t("userAddress"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("rewardNicho"),
      dataIndex: "nicho",
      key: "nicho",
    },
    {
      title: t("rewardValue"),
      dataIndex: "rewardValue",
      key: "rewardValue",
    },
    {
      title: t("trades"),
      dataIndex: "trades",
      key: "trades",
    },
    {
      title: t("percent"),
      dataIndex: "percent",
      key: "percent",
    },
    {
      title: t("nationality"),
      dataIndex: "country",
      key: "country",
    },
  ];
  

  useEffect(() => {
    const getWeekData = async () => {
      try {
        const weekData = await getCurrentWeekInfo();
        setCurWeekData(weekData);
        if (weekData && weekData.weekOfYear) {
          setWeekNum(weekData.weekOfYear);
          // fetchTradeRewardTopData(weekNum);
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
    const getTradeRewardTopData = async () => {
      if (
        isInitialized &&
        isWeb3Enabled &&
        weekNum !== undefined &&
        weekNum > 0
      ) {
        fetchTradeRewardTopData(weekNum);
        fetchRewardPoolByWeekNum(weekNum);
      }
    };

    getTradeRewardTopData();
  }, [weekNum, isInitialized, isWeb3Enabled]);

  const fetchUserRewardsData = () => {
    try {
      const params = {
        contractAddress: rewardAddress,
        functionName: "userCurrentTradeRewardsData",
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
            setPlansTradeAmount(result.plansTradeAmount);
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

  const fetchTradeRewardTopData = async (weekNum) => {
    try {
      const data = await getTradeRankApi(weekNum, 20);
      if (data) {
        const dataList = [];
        const len = data.length;
        for (let i = 0; i < len; i++) {
          const userReward = data[i];
          let nationalityIcon = null;
          userReward.country &&
            allCountries.map((country, index) => {
              if (country.name===userReward.country) {
                const flag = country.abbr.toLowerCase();
                nationalityIcon = `https://flagcdn.com/w20/${flag}.png`;
              }
            });

          dataList.push({
            key: `${i}`,
            rank: userReward.rankNo,
            trades: userReward.trades,
            address: `${truncateHash(userReward.userAddress, 8, 6)}`,
            rewardValue: `--`,
            nicho: `${userReward.userRewardsAmount} Nicho`,
            percent: `${userReward.percent} %`,
            country: (
              <div>
                <img
                  style={{ marginRight: 5 }}
                  width={20}
                  height={14}
                  src={nationalityIcon}
                  loading={"lazy"}
                  alt="Nicho AI NFT"
                />
                {userReward.country}
              </div>
            ),
          });
        }
        setTradeTopData(dataList);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const showError = (msg) => {
    const secondsToGo = 3;
    const modal = Modal.error({
      title: "Error!",
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
        functionName: "claimTradeRewards",
        abi: nichoRewardABI,
        params: {},
      };

      await contractProcessor.fetch({
        params,
        onSuccess: async (result) => {
          // console.log("claimTradeRewards: ", result);
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

  return (
    <div className="trade-to-earn center-page2">
      {/* <SubTitle title={"My reward"} /> */}
      <div>
        <div
          className="back-box"
          style={{ paddingRight: "20px" }}
          onClick={() => window.history.back(-1)}
        >
          <Image preview={false} src={Back} />
        </div>

        <div className="earn-top-content">
          <img className="mint-item-img" src={topImg} alt="Nicho AI NFT" />

          {userRewardsData &&
            userRewardsData.userRewardsAmount > 0 &&
            !userRewardsData.tradeClaimStatus && (
              <Button
                className="claim-button"
                onClick={() => onClaim()}
                loading={waiting}
                type="primary"
              >
                Claim
              </Button>
            )}

          {userRewardsData && userRewardsData.tradeClaimStatus && (
            <Button disabled className="claim-button" type="primary">
              {t("claimed")}
            </Button>
          )}

          {(!userRewardsData ||
            !userRewardsData.userRewardsAmount ||
            userRewardsData.userRewardsAmount===0) && (
            <Tooltip
              placement="right"
              title={t("stillTradedNFTLast")}
            >
              <Button disabled className="claim-button" type="primary">
                claim
              </Button>
            </Tooltip>
          )}

          <div className="reward-amount">
            <span>{t("lastWeekReward")}</span>
            <span>
              {" "}
              (WK
              {userRewardsData && userRewardsData.lastWeekOfYear
                ? `${userRewardsData.lastWeekOfYear}`
                : "0"}
              )
            </span>
            <span className="theme-color-txt"></span>
          </div>
          <div className="earn-right-info">
            <div className="earn-row">
              <div className="earn-col">
                {t("yourAddress")}{" "}
                <span className="light-txt">
                  {user && truncateHash(user.get("ethAddress"), 6, 4)}
                </span>
              </div>
              <div>
                {t("yourBalance")}{" "}
                <span className="light-txt">
                  {userRewardsData && userRewardsData.userTokenBalance
                    ? `${new BigNumber(
                        Moralis.Units.FromWei(
                          userRewardsData.userTokenBalance,
                          9
                        )
                      ).toFixed(2)} Nicho`
                    : "0 Nicho"}
                </span>
              </div>
            </div>
            <div className="earn-row">
              <div className="earn-col">
                {t("yourRewardAmount")}{" "}
                <span className="light-txt">
                  {userRewardsData && userRewardsData.userRewardsAmount
                    ? `${new BigNumber(
                        Moralis.Units.FromWei(
                          userRewardsData.userRewardsAmount,
                          9
                        )
                      ).toFixed(2)} Nicho`
                    : "0 Nicho"}
                </span>
              </div>
              <div>
                {t("claimableP")}{" "}
                <span className="light-txt">
                  {`${
                    curWeekData &&
                    curWeekData.beginOfWeek &&
                    moment(curWeekData.beginOfWeek).format("Do MMM")
                  } ~ ${
                    curWeekData &&
                    curWeekData.endOfWeek &&
                    moment(curWeekData.endOfWeek).format("Do MMM")
                  } (UTC)`}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="earn-bot-content">
          <Row className="table-title" justify="space-between">
            <Col span={14}>
              <span>WK.{weekNum} {t("rewardPoolAmount")} </span>
              <span className="theme-color-txt">{`${new BigNumber(
                Moralis.Units.FromWei(plansTradeAmount, 9)
              ).toFixed(2)} Nicho`}</span>
            </Col>
            <Col span={10} style={{ textAlign: "right", paddingRight: "50px" }}>
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
            className="common-table"
            dataSource={tradeTopData}
            columns={columns}
            pagination={false}
            scroll={{ x: 100 }}
          />
        </div>
        <div>
          <Title
            level={5}
            style={{ color: "#999", textAlign: "center", fontSize: "15px" }}
            strong
          >
            {t("click")}{" "}
            <a
              href="https://medium.com/@NichoNFT/how-the-reward-system-v2-works-on-nicho-5767d8455b7"
              target={"_blank"}
              className="theme-color-txt"
            >
              {t("here")}
            </a>{" "}
            {t("toLearnMore")}
          </Title>
        </div>
      </div>
    </div>
  );
};

export default TradeToEarn;
