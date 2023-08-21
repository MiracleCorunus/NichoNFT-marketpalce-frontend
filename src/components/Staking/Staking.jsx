import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Typography,
  Card,
  Modal,
  Input,
  Divider,
  Space,
} from "antd";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import "./Staking.scss";
import topImg from "assets/images/new/mintToEarn/top_img.png";
import stakeImg from "assets/images/new/mintToEarn/stake.png";
import yiwenSvg from "assets/images/new/mintToEarn/yiwen.svg";
import buyButtonImg from "assets/images/new/mintToEarn/buy_button.png";
import { floatFixed, truncateHash } from "helpers/Utils";
import {
  nichoTokenAddress,
  nichoTokenABI,
  nichoFarmAddress,
  nichoFarmABI,
} from "contracts/constants";

import { styles } from "./styles";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import UnderConstruction from "./UnderConstruction/UnderConstruction";

// import { getFollowerUserApi } from 'api/user';

const { Title } = Typography;
const FORMAT_DECIMAL = 2;

const Staking = () => {
  const { t } = useTranslation();
  // const { user, Moralis, isInitialized } = useMoralis();
  // const [followers, setFollowers] = useState();
  const { user, Moralis, isWeb3Enabled, isInitialized, chainId } = useMoralis();
  const [users, setUsers] = useState([]);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [totalVolumeLocked, setTotalVolumeLocked] = useState(0);
  const [myStakedAmount, setMyStakedAmount] = useState(0);
  const [myTotalValue, setMyTotalValue] = useState(0);
  const [nichoEarned, setNichoEarned] = useState(0);
  const [apy, setApy] = useState("");
  const [nichoBalance, setNichoBalance] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [signer, setSigner] = useState();
  // const [followers, setFollowers] = useState();

  const getNumberSuffix = (_value, decimals = 3) => {
    let value = _value;

    if (value === Infinity || value > 100000000) {
      value = 100000000;
    }

    switch (true) {
      case value > 1000000000:
        return `${(value / 1000000000).toFixed(0)}B `;
      case value > 1000000:
        return `${(value / 1000000).toFixed(0)}M `;
      case value > 10000:
        return `${(value / 1000).toFixed(decimals)}k `;

      default:
        return value.toFixed(decimals);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "User Address",
      dataIndex: "userAddress",
      key: "userAddress",
    },
    {
      title: "Staked Amount",
      dataIndex: "stakedValue",
      key: "stakedValue",
    },
    {
      title: "Earned Amount",
      dataIndex: "earnedValue",
      key: "earnedValue",
    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
    },
  ];

  useEffect(() => {
    getSigner();
  }, []);

  useEffect(() => {
    const getContractData = () => {
      signer && fetchContractData();
    };
    getContractData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    isWeb3Enabled,
    isInitialized,
    stakeAmount,
    withdrawAmount,
    totalVolumeLocked,
    nichoEarned,
    nichoBalance,
    myStakedAmount,
    apy,
    chainId,
    signer,
  ]);

  const getSigner = async () => {
    let web3Provider;
    let tmpSigner;
    if (!isWeb3Enabled) {
      web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
      tmpSigner = web3Provider.getSigner();
      setSigner(tmpSigner);
    }
  };

  const fetchContractData = async () => {
    const ethers = Moralis.web3Library;

    const signerAddr = await signer.getAddress();
    const nichoFarmContract = new ethers.Contract(
      nichoFarmAddress,
      nichoFarmABI,
      signer
    );
    const nichoTokenContract = new ethers.Contract(
      nichoTokenAddress,
      nichoTokenABI,
      signer
    );

    let totalDepositAmount = await nichoFarmContract.getTotalDepositAmount();
    totalDepositAmount = Moralis.Units.FromWei(
      totalDepositAmount.toString(),
      9
    );
    setTotalVolumeLocked(totalDepositAmount);

    let result = await nichoFarmContract.tokensPerBlock();
    const tmpAPY = Math.pow(
      1.0 + (parseInt(result) * 12.0 * 60 * 24) / totalDepositAmount,
      365
    );
    setApy(getNumberSuffix(tmpAPY));
    result = await nichoFarmContract.getUserListInfo();

    let userLength = result.length;
    if (result.length > 10) {
      userLength = 10;
    }

    const userInfoList = [];
    for (let i = 0; i < result.length; i++) {
      const stakedValue = parseFloat(
        Moralis.Units.FromWei(result[i].amount, 9)
      ).toFixed(2);
      userInfoList.push({
        userAddr: result[i].userAddr,
        stakedValue: stakedValue,
        earnedAmount: parseFloat(
          Moralis.Units.FromWei(result[i].earnedAmount, 9)
        ).toFixed(2),
      });
    }

    for (let i = 0; i < userInfoList.length - 1; i++) {
      for (let j = i + 1; j < userInfoList.length; j++) {
        if (
          parseFloat(userInfoList[i].earnedAmount) <
          parseFloat(userInfoList[j].earnedAmount)
        ) {
          const tempUser = userInfoList[i];
          userInfoList[i] = userInfoList[j];
          userInfoList[j] = tempUser;
        }
      }
    }

    const dataList = [];
    for (let i = 0; i < userLength; i++) {
      dataList.push({
        key: `${i}`,
        no: `${i + 1}`,
        userAddress: `${truncateHash(userInfoList[i].userAddr, 8, 6)}`,
        stakedValue: `${userInfoList[i].stakedValue} Nicho`,
        earnedValue: `${userInfoList[i].earnedAmount} Nicho`,
        percent: `${(
          (userInfoList[i].stakedValue * 100) /
          totalDepositAmount
        ).toFixed(2)} %`,
      });
    }

    setUsers(dataList);

    result = await nichoFarmContract.getUserInfo(signerAddr);
    setMyStakedAmount(Moralis.Units.FromWei(result.amount.toString(), 9));

    setNichoEarned(Moralis.Units.FromWei(result.earnedAmount.toString(), 9));

    setMyTotalValue(Moralis.Units.FromWei(result.amount.toString(), 9));

    result = await nichoTokenContract.balanceOf(signerAddr);

    setNichoBalance(Moralis.Units.FromWei(result.toString(), 9));

    if (isInitialized && isWeb3Enabled && user) {
      let result = await nichoFarmContract.getUserInfo(signerAddr);
      setMyStakedAmount(Moralis.Units.FromWei(result.amount.toString(), 9));

      setNichoEarned(Moralis.Units.FromWei(result.earnedAmount.toString(), 9));

      setMyTotalValue(Moralis.Units.FromWei(result.amount.toString(), 9));

      result = await nichoTokenContract.balanceOf(signerAddr);
      setNichoBalance(Moralis.Units.FromWei(result.toString(), 9));
    }
  };

  const showStakeModal = () => {
    setIsStakeModalOpen(true);
  };

  const showWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const stakeAmountChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      setStakeAmount(inputValue);
    }
  };

  const withdrawAmountChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      setWithdrawAmount(inputValue);
    }
  };

  const setStakeAmountWithPercent = (percent) => {
    const inputValueFixed = floatFixed((nichoBalance * percent) / 100);

    setStakeAmount(inputValueFixed);
  };

  const setWithdrawAmountWithPercent = (percent) => {
    const inputValueFixed = floatFixed((myTotalValue * percent) / 100);
    setWithdrawAmount(inputValueFixed);
  };

  const stakeNicho = async () => {
    try {
      if (stakeAmount === 0) {
        const secondsToGo = 3;
        const modal = Modal.error({
          title: "Error!",
          content: "Invaild zero staking!",
        });

        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
        return;
      }
      console.log(stakeAmount, nichoBalance);
      if (Number(stakeAmount) > Number(nichoBalance)) {
        const secondsToGo = 3;
        const modal = Modal.error({
          title: "Error!",
          content: "Insufficient balance amount!",
        });

        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
        return;
      }
      setWaiting(true);

      const priceWei = Moralis.Units.Token("10000000000000000000000", "9");
      let allowance = 0;

      const ethers = Moralis.web3Library;
      const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
      const signer = web3Provider.getSigner();

      const signerAddr = await signer.getAddress();
      const nichoTokenContract = new ethers.Contract(
        nichoTokenAddress,
        nichoTokenABI,
        signer
      );
      const nichoFarmContract = new ethers.Contract(
        nichoFarmAddress,
        nichoFarmABI,
        signer
      );

      allowance = await nichoTokenContract.allowance(
        signerAddr,
        nichoFarmAddress
      );
      allowance = Moralis.Units.FromWei(allowance.toString(), 9);
      if (allowance < stakeAmount) {
        const tx = await nichoTokenContract.approve(nichoFarmAddress, priceWei);
        await tx.wait();
      }

      const tx = await nichoFarmContract.deposit(
        Moralis.Units.Token(Number(stakeAmount).toFixed(9).toString(), "9")
      );
      await tx.wait();

      await fetchContractData();
      setStakeAmount(0);
      setIsStakeModalOpen(false);
    } catch (err) {
      console.log(err);

      const modal = Modal.error({
        title: "Error!",
        content: err?.data.message,
      });
      const secondsToGo = 3;

      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    } finally {
      setWaiting(false);
    }
  };

  const withdrawNicho = async () => {
    try {
      if (withdrawAmount === 0) {
        const secondsToGo = 3;
        const modal = Modal.error({
          title: "Error!",
          content: "Invaild zero withdraw!",
        });

        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
        return;
      }

      if (parseFloat(withdrawAmount) > parseFloat(myTotalValue)) {
        const secondsToGo = 3;
        const modal = Modal.error({
          title: "Error!",
          content: "Withdraw amount is overflow than staked amount!",
        });

        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
        return;
      }
      setWaiting(true);

      const ethers = Moralis.web3Library;
      const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
      const signer = web3Provider.getSigner();

      const nichoFarmContract = new ethers.Contract(
        nichoFarmAddress,
        nichoFarmABI,
        signer
      );

      const tx = await nichoFarmContract.withdraw(
        Moralis.Units.Token(Number(withdrawAmount).toFixed(9).toString(), "9")
      );
      await tx.wait();

      await fetchContractData();
      setIsWithdrawModalOpen(false);
      setWithdrawAmount(0);
    } catch (err) {
      console.log(err);
      const modal = Modal.error({
        title: "Error!",
        content: err?.data.message,
      });
      const secondsToGo = 3;

      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="staking-page center-page2">
      <Modal
        open={isStakeModalOpen}
        centered
        footer={false}
        onCancel={() => setIsStakeModalOpen(false)}
      >
        <div className="form-group">
          <Title level={3} type="secondary">
            Stake Nicho
          </Title>
          <div className="form-item">
            <div className="stake-header">
              <div>Stake Amount</div>
              <div>Balance : {nichoBalance}</div>
            </div>
            <div className="stake-content">
              <div>
                <Input
                  size="small"
                  className="ant-input"
                  value={stakeAmount}
                  onChange={(e) => stakeAmountChange(e)}
                />
              </div>
              <div>NICHO</div>
            </div>
            <div className="percentage-btn-group">
              <span
                className="percentage-button"
                onClick={() => setStakeAmountWithPercent(25)}
              >
                25%
              </span>
              <span
                className="percentage-button"
                onClick={() => setStakeAmountWithPercent(50)}
              >
                50%
              </span>
              <span
                className="percentage-button"
                onClick={() => setStakeAmountWithPercent(75)}
              >
                75%
              </span>
              <span
                className="percentage-button"
                onClick={() => setStakeAmountWithPercent(100)}
              >
                Max
              </span>
            </div>
          </div>
          <div className="bottom-btn-group">
            <Button
              type="primary"
              size="small"
              onClick={(e) => setIsStakeModalOpen(false)}
              disabled={waiting}
            >
              {" "}
              Cancel{" "}
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={stakeNicho}
              disabled={waiting}
              loading={waiting}
            >
              {" "}
              Stake{" "}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={isWithdrawModalOpen}
        centered
        footer={false}
        onCancel={() => setIsWithdrawModalOpen(false)}
      >
        <div className="form-group">
          <Title level={3} type="secondary">
            Withdraw Nicho
          </Title>
          <div className="form-item">
            <div className="stake-header">
              <div>Withdraw Amount</div>
              <div>Staked Balance : {myTotalValue}</div>
            </div>
            <div className="stake-content">
              <div>
                <Input
                  size="small"
                  className="ant-input"
                  value={withdrawAmount}
                  onChange={(e) => withdrawAmountChange(e)}
                />
              </div>
              <div>NICHO</div>
            </div>
            <div className="percentage-btn-group">
              <div
                className="percentage-button"
                onClick={() => setWithdrawAmountWithPercent(25)}
              >
                25%
              </div>
              <div
                className="percentage-button"
                onClick={() => setWithdrawAmountWithPercent(50)}
              >
                50%
              </div>
              <div
                className="percentage-button"
                onClick={() => setWithdrawAmountWithPercent(75)}
              >
                75%
              </div>
              <div
                className="percentage-button"
                onClick={() => setWithdrawAmountWithPercent(100)}
              >
                Max
              </div>
            </div>
          </div>
          <div className="bottom-btn-group">
            <Button
              type="primary"
              size="small"
              disabled={waiting}
              onClick={(e) => setIsWithdrawModalOpen(false)}
            >
              {" "}
              Cancel{" "}
            </Button>
            <Button
              type="primary"
              size="small"
              disabled={waiting}
              loading={waiting}
              onClick={withdrawNicho}
            >
              {" "}
              Withdraw{" "}
            </Button>
          </div>
        </div>
      </Modal>
      <div className="earn-top-content">
        <img className="mint-item-img" src={stakeImg} alt="Nicho AI NFT" />
        <div className="percentage">
          <span className="value">{apy}%</span>
          <span className="value">APY</span>
          <img src={yiwenSvg} alt="Nicho AI NFT" />
        </div>
        <a
          href="https://bscscan.com/token/0x52904d8bB07e72541C854793242D51128043d527"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          <img src={buyButtonImg} alt="Nicho AI NFT" />{" "}
        </a>
        <img className="top-right-img" src={topImg} alt="Nicho AI NFT" />
      </div>

      <div className="earn-bot-content">
        {!user ? (
          <Row gutter={[16, 26]}>
            <Col span={24}>
              <div className="tab-card">
                <div className="card-header">{t("NICHOCompounder")}</div>
                <Divider className="card-header-divider" />
                <div className="card-content">
                  <div className="txt">
                    Total Volume Locked:{" "}
                    <span className="sub-txt">
                      {" "}
                      <CountUp
                        end={Number(totalVolumeLocked).toFixed(FORMAT_DECIMAL)}
                        decimals={FORMAT_DECIMAL}
                        duration={2}
                      />{" "}
                      <span className="nicho-txt">NICHO</span>
                    </span>
                  </div>
                  {/* <Button className="connect-wallet">Connect Wallet</Button> */}
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={[16, 26]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <div className="tab-card">
                <div className="card-header">{t("NICHOCompounder")}</div>
                <Divider className="card-header-divider" />
                <div className="card-content">
                  <div className="card-content-background">
                    <div className="txt">
                      Total Volume Locked:{" "}
                      <span className="sub-txt">
                        {" "}
                        <CountUp
                          end={Number(totalVolumeLocked).toFixed(
                            FORMAT_DECIMAL
                          )}
                          decimals={FORMAT_DECIMAL}
                          duration={2}
                        />{" "}
                        <span className="nicho-txt">NICHO</span>
                      </span>
                    </div>

                    <div className="txt">
                      Staked Amount:{" "}
                      <span className="sub-txt">
                        {" "}
                        <span style={{ color: "blue" }}>
                          {Number(myStakedAmount).toFixed(FORMAT_DECIMAL)}
                        </span>{" "}
                        <span className="nicho-txt">NICHO</span>
                      </span>
                    </div>

                    <div className="txt">
                      Nicho Earned:{" "}
                      <span className="sub-txt">
                        {" "}
                        <span style={{ color: "green" }}>
                          +{Number(nichoEarned).toFixed(FORMAT_DECIMAL)}
                        </span>{" "}
                        <span className="nicho-txt">NICHO</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <div className="tab-card">
                <div className="card-header">Stake Nicho Token</div>
                <Divider className="card-header-divider" />
                <div className="card-content">
                  <Space size={"large"}>
                    <Button
                      //   className="connect-wallet margin-btn"
                      onClick={showStakeModal}
                      type={"primary"}
                    >
                      Stake Nicho Now
                    </Button>

                    <Button
                      //   className="connect-wallet"
                      onClick={showWithdrawModal}
                    >
                      Withdraw Nicho
                    </Button>
                  </Space>
                </div>
              </div>
            </Col>

            {/* <Col span={24}>
                        <div className="tab-card staking-rewards">
                            <div className="staking-left">
                                <h6>{t("stakingRewards")}</h6>
                                <p>
                                    {t("NichoTeamAreDeveloping")} 
                                </p>
                                <p>
                                    {t("stakeNICHO")}
                                </p>
                                <Link to="/" className="theme-color-txt">{t("learnMore")}</Link>
                            </div>
                            <img className="graph-img" src={graphImg} alt="Nicho AI NFT" />
                        </div>
                    </Col> */}
          </Row>
        )}
      </div>

      <div className="top-user-table">
        <Card
          headStyle={styles.cardHeader}
          style={styles.card}
          title="Top users"
          bordered={false}
        >
          <Table
            dataSource={users}
            columns={columns}
            pagination={false}
            scroll={{ x: 100 }}
          />
        </Card>
      </div>

      <div className="earn-bot-footer">
        <p>{t("NICHOHelpsYou")}</p>
        <h5>{t("getTheNICHO")}</h5>
        <a
          href="https://bscscan.com/token/0x52904d8bB07e72541C854793242D51128043d527"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          <img src={buyButtonImg} alt="Nicho AI NFT" />{" "}
        </a>
        <div className="fine-desc">
          <p>{t("theRatesShown")}</p>
          <p>
            <p>{t("actualRates")}</p>
          </p>
        </div>
      </div>
      <UnderConstruction />
      {/* <ComingSoonTxt /> */}
    </div>
  );
};

export default Staking;
