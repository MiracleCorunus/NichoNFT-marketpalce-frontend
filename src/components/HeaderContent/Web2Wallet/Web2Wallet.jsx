import { useTranslation } from "react-i18next";
import {
  Button,
  Popover,
  Divider,
  Typography,
  Input,
  message,
  Modal,
} from "antd";
import bnbIcon from "../WalletIcons/bnb.png";
import nichoIcon from "../WalletIcons/nicho.png";
import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import "./Web2Wallet.scss";
import { chainData } from "../chainData";
import ActivityList from "./ActivityList/ActivityList";

const Web2Wallet = ({ currentChain }) => {
  const { Moralis, isAuthenticated, user } = useMoralis();
  const { t } = useTranslation();

  const [web2WalletNativeBalance, setWeb2WalletNativeBalance] = useState(0);
  const [web2WalletTokenBalance, setWeb2WalletTokenBalance] = useState(0);
  const [targetAddress, setTargetAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState();
  const [isTransferingAsset, setIsTransferingAsset] = useState(false);
  const [currentAsset, setCurrentAsset] = useState("bnb");
  const [liveBnbPrice, setLiveBnbPrice] = useState(0);
  const [liveNichoPrice, setLiveNichoPrice] = useState(0);
  const [nativeTransactionHistory, setNativeTransactionHistory] = useState([]);
  const [tokenTransactionHistory, setTokenTransactionHistory] = useState([]);
  const [nativePageNumber, setNativePageNumber] = useState(5);
  const [tokenPageNumber, setTokenPageNumber] = useState(5);
  // const [hasMoreNativeTransaction, setHasMoreNativeTransaction] =
  //   useState(true);
  // const [hasMoreTokenTransaction, setHasMoreTokenTransaction] = useState(true);

  const web3Api = useMoralisWeb3Api();
  const NICHO_TOKEN_ADDRESS = process.env.REACT_APP_NICHO_TOKEN_CONTRACT;

  // reserve 21000 gas for native transfer
  const NATIVE_TRANSFER_GAS_LIMIT = 40000;
  // reserve 80000 gas for token transfer
  const TOKEN_TRANSFER_GAS_LIMIT = 80000;

  const showError = (msg) => {
    message.error(msg);
  };

  const showSuccess = (msg) => {
    message.success(msg);
  };

  const setMaximumAmount = () => {
    if (currentAsset === "bnb") {
      setTransferAmount(web2WalletNativeBalance);
    } else if (currentAsset === "nicho") {
      setTransferAmount(web2WalletTokenBalance);
    }
  };

  const switchAsset = (type) => {
    setCurrentAsset(type);
    setTargetAddress("");
    setTransferAmount(undefined);
    // await fetchWeb2WalletBalance();
  };

  const handleViewMore = () => {
    if (currentAsset === "bnb") {
      setNativePageNumber((prev) => prev + 5);
      // fetchNativeTransaction();
    } else if (currentAsset === "nicho") {
      setTokenPageNumber((prev) => prev + 5);
      // fetchTokenTransaction();
    }
  };

  const content = (
    <div className="web2wallet-content">
      <Typography.Title className="web2wallet-title-text">
        {/* Wallet Address */}
        {t("Wallet Address")}
      </Typography.Title>

      <Typography.Paragraph
        copyable={isAuthenticated}
        // style={{ marginBottom: "1rem" }}
      >
        {user?.get("ethAddress")}
      </Typography.Paragraph>

      <Divider className="web2wallet-divider" />
      <div className="web2wallet-balance">
        {currentAsset === "bnb" ? (
          <>
            <img
              src={bnbIcon}
              alt="Nicho AI NFT"
              width={40}
              height={40}
              style={{ marginBottom: "0.5rem" }}
            />
            <Typography.Title
              className="web2wallet-title-text"
              style={{ marginBottom: 0 }}
            >
              {web2WalletNativeBalance.toFixed(2)}{" "}
              <span style={{ fontSize: "1.5rem" }}>BNB</span>
            </Typography.Title>
            <Typography.Text className="web2wallet-balance-fiat">
              (${(liveBnbPrice * web2WalletNativeBalance).toFixed(2)} AUD)
            </Typography.Text>
          </>
        ) : (
          <>
            <img
              src={nichoIcon}
              alt="Nicho AI NFT"
              width={40}
              height={40}
              style={{ marginBottom: "0.5rem" }}
            />
            <Typography.Title
              className="web2wallet-title-text"
              style={{ marginBottom: 0 }}
            >
              {web2WalletTokenBalance.toFixed(2)}{" "}
              <span style={{ fontSize: "1.5rem" }}>NICHO</span>
            </Typography.Title>
            <Typography.Text className="web2wallet-balance-fiat">
              (${(liveNichoPrice * web2WalletTokenBalance).toFixed(2)} AUD)
            </Typography.Text>
          </>
        )}

        <div className="web2wallet-balance-button-group">
          {currentAsset === "bnb" ? (
            <Button
              // size="small"
              shape="round"
              disabled={isTransferingAsset}
              onClick={() => switchAsset("nicho")}
              // style={{ marginTop: "0.5rem" }}
              className="web2wallet-button"
            >
              {t("switch")} NICHO
            </Button>
          ) : (
            <Button
              // size="small"
              shape="round"
              disabled={isTransferingAsset}
              onClick={() => switchAsset("bnb")}
              // style={{ marginTop: "0.5rem" }}
              className="web2wallet-button"
            >
              {t("switch")} BNB
            </Button>
          )}

          {/* <Button
            shape="round"
            disabled={isTransferingAsset}
            onClick={async () => await fetchWeb2WalletBalance()}
          >
            Refresh
          </Button> */}
        </div>
      </div>
      <Divider className="web2wallet-divider" />

      <div className="web2wallet-transfer">
        <Typography.Title className="web2wallet-title-text">
          {/* Assets Transfer */}
          {t("Assets Transfer")}
        </Typography.Title>
        {/* <Divider style={{ background: "grey", marginTop: "-0.5rem" }} /> */}
        <Input
          disabled={isTransferingAsset}
          placeholder={t("inputAddressHere")}
          className="web2wallet-content-input"
          onChange={(e) => setTargetAddress(e.target.value)}
          value={targetAddress}
        />
        <Input
          disabled={isTransferingAsset}
          type="number"
          min={0}
          max={
            currentAsset === "bnb"
              ? web2WalletNativeBalance
              : web2WalletTokenBalance
          }
          step={currentAsset === "bnb" ? "0.01" : "0.1"}
          placeholder={t("inputTransferAmount")}
          className="web2wallet-content-input"
          onChange={(e) => {
            // @ts-ignore
            setTransferAmount(e.target.value);
          }}
          value={transferAmount}
          suffix={
            <Button
              shape="round"
              type="primary"
              onClick={setMaximumAmount}
              disabled={isTransferingAsset}
              style={{ borderRadius: "1rem" }}
              size="small"
            >
              {t("max")}
            </Button>
          }
        />
        {currentAsset === "bnb" ? (
          <Button
            shape="round"
            loading={isTransferingAsset}
            onClick={() => transferNativeFromWeb2Wallet()}
            className="web2wallet-button"
          >
            {t("transfer")} BNB
          </Button>
        ) : (
          <Button
            shape="round"
            loading={isTransferingAsset}
            onClick={() => transferTokenFromWeb2Wallet()}
            className="web2wallet-button"
          >
            {t("transfer")} NICHO
          </Button>
        )}
      </div>
      <Divider className="web2wallet-divider" />
      <div className="web2wallet-activity">
        <Typography.Title
          className="web2wallet-title-text"
          style={{ marginBottom: 0 }}
        >
          Activities
        </Typography.Title>
        {currentAsset === "bnb" ? (
          <>
            {nativeTransactionHistory &&
              nativeTransactionHistory
                .slice(0, nativePageNumber)
                .map((native, index) => (
                  <ActivityList
                    history={native}
                    key={index}
                    currentAsset={currentAsset}
                    currentChain={currentChain}
                  />
                ))}
          </>
        ) : (
          <>
            {tokenTransactionHistory &&
              tokenTransactionHistory
                .slice(0, tokenPageNumber)
                .map((token, index) => (
                  <ActivityList
                    history={token}
                    key={index}
                    currentAsset={currentAsset}
                    currentChain={currentChain}
                  />
                ))}
          </>
        )}
        {currentAsset === "bnb" ? (
          <Button
            shape="round"
            disabled={isTransferingAsset}
            className="web2wallet-activity-button"
            onClick={handleViewMore}
            // style={{ display: hasMoreNativeTransaction ? "block" : "none" }}
          >
            View More
          </Button>
        ) : (
          <Button
            shape="round"
            disabled={isTransferingAsset}
            className="web2wallet-activity-button"
            onClick={handleViewMore}
            // style={{ display: hasMoreTokenTransaction ? "block" : "none" }}
          >
            View More
          </Button>
        )}
      </div>
    </div>
  );
  // console.log(currentChain);
  const isValidInput = (type) => {
    if (targetAddress === "") {
      showError(t("provideAddress"));
      return false;
    }
    const isEvmAddress = Moralis.web3Library.utils.isAddress(targetAddress);
    if (!isEvmAddress) {
      showError(t("notValidAddress"));
      return false;
    }
    if (transferAmount) {
      if (transferAmount <= 0) {
        showError(t("transferAmount"));
        return false;
      }
      if (type === "bnb") {
        if (transferAmount > web2WalletNativeBalance) {
          showError(t("cannotTransferMore"));
          return false;
        }
      } else if (type === "nicho") {
        if (transferAmount > web2WalletTokenBalance) {
          showError(t("cannotTransferMore"));
          return false;
        }
      }
    } else {
      showError(t("inputTransferAmount"));
      return false;
    }

    return true;
  };
  const transferTokenFromWeb2Wallet = async () => {
    if (!isValidInput("nicho")) return;

    try {
      setIsTransferingAsset(true);
      const gasFee = await fetchGasFee("nicho");
      const hasEnoughGas = web2WalletNativeBalance - gasFee > 0 ? true : false;

      if (gasFee > 0 && transferAmount) {
        if (!hasEnoughGas) throw "Not enough gas fee";
        const transferTx = await Moralis.transfer({
          type: "erc20",
          amount: Moralis.Units.Token(transferAmount.toString(), 9),
          receiver: targetAddress,
          // TODO -> change this address to mainnet address
          contractAddress: NICHO_TOKEN_ADDRESS,
        });

        if (transferTx) {
          // setHasMoreTokenTransaction(true);
          // setTokenPageNumber(5);
          //@ts-ignore
          await transferTx.wait(5);
          fetchWeb2WalletBalance();
          fetchTokenTransaction();
          setTargetAddress("");
          setTransferAmount(undefined);
          setIsTransferingAsset(false);
          showSuccess(t("transferCompleted"));
        } else {
          setIsTransferingAsset(false);
          throw t("errorTransfer");
        }
      } else {
        throw t("cannotRetrieve");
      }
    } catch (error) {
      showError(error);
      console.log(error);
      setIsTransferingAsset(false);
    }
  };
  const transferNativeFromWeb2Wallet = async () => {
    if (!isValidInput("bnb")) return;

    try {
      setIsTransferingAsset(true);
      const gasFee = await fetchGasFee("bnb");
      console.log(gasFee);

      if (gasFee > 0 && transferAmount) {
        const hasEnoughGas = Number(transferAmount) - gasFee > 0 ? true : false;
        if (!hasEnoughGas) throw t("notEnoughGas");
        // console.log(gasFee);
        // setTransferAmount((prev) => prev - gasFee);
        const transferTx = await Moralis.transfer({
          type: "native",
          amount: Moralis.Units.ETH(
            (Number(transferAmount) - gasFee).toString()
          ),
          receiver: targetAddress,
        });

        if (transferTx) {
          // setHasMoreNativeTransaction(true);
          // setNativePageNumber(5);
          //@ts-ignore
          await transferTx.wait(5);
          fetchWeb2WalletBalance();
          fetchNativeTransaction();
          setTargetAddress("");
          setTransferAmount(undefined);
          setIsTransferingAsset(false);
          showSuccess(t("transferCompleted"));
        } else {
          setIsTransferingAsset(false);
          throw t("errorTransfer");
        }
      } else {
        throw t("cannotRetrieve");
      }
    } catch (error) {
      showError(error);
      console.log(error);
      setIsTransferingAsset(false);
    }
  };

  const fetchWeb2WalletBalance = async () => {
    if (user && isAuthenticated) {
      const { balance: nativeBalance } =
        await Moralis.Web3API.account.getNativeBalance({
          chain: currentChain.chainId,
          address: user?.get("ethAddress"),
        });
      setWeb2WalletNativeBalance(
        Number(Moralis.Units.FromWei(nativeBalance.toString()))
      );

      const [token] = await Moralis.Web3API.account.getTokenBalances({
        chain: currentChain.chainId,
        address: user?.get("ethAddress"),
        token_addresses: NICHO_TOKEN_ADDRESS,
      });

      if (token) {
        setWeb2WalletTokenBalance(
          Number(Moralis.Units.FromWei(token.balance.toString(), 9))
        );
      } else {
        setWeb2WalletTokenBalance(0);
      }
    } else {
      setWeb2WalletNativeBalance(0);
      setWeb2WalletTokenBalance(0);
      setTargetAddress("");
      setTransferAmount(undefined);
    }
  };

  const fetchGasFee = async (type) => {
    const web3Provider = Moralis.web3;
    let totalGas = -1;
    if (web3Provider) {
      const gasPrice = await web3Provider.getGasPrice();

      const formattedGasPrice = Number(
        Moralis.web3Library.utils.formatUnits(gasPrice, "gwei")
      );

      if (type === "bnb") {
        totalGas = NATIVE_TRANSFER_GAS_LIMIT * formattedGasPrice;
      } else if (type === "nicho") {
        totalGas = TOKEN_TRANSFER_GAS_LIMIT * formattedGasPrice;
      }

      return Number(Moralis.web3Library.utils.formatUnits(totalGas, "gwei"));
    } else {
      return -1;
    }
  };

  const fetchNativeTransaction = async () => {
    if (user && isAuthenticated) {
      const data = await web3Api.account.getTransactions({
        chain: currentChain.chainId,
        // limit: nativePageNumber,
      });

      if (data) {
        // if (data.cursor === null) {
        //   setHasMoreNativeTransaction(false);
        // }
        // console.log(data);
        const txs = data.result.filter(
          (tx) => tx.to_address !== NICHO_TOKEN_ADDRESS.toLowerCase()
        );
        setNativeTransactionHistory(txs);
      }
    }
  };
  // console.log(nativeTransactionHistory);
  // console.log(tokenTransactionHistory);
  const fetchTokenTransaction = async () => {
    if (user && isAuthenticated) {
      const data = await web3Api.account.getTokenTransfers({
        chain: currentChain.chainId,
        // limit: tokenPageNumber,
      });
      if (data) {
        // if (data.cursor === null) {
        //   setHasMoreTokenTransaction(false);
        // }
        setTokenTransactionHistory(data.result);
      }
    }
  };

  const fetchLiveBnbPrice = async () => {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=aud";

    const response = await fetch(url);
    const data = await response.json();
    setLiveBnbPrice(data.binancecoin.aud);
  };

  useEffect(() => {
    fetchNativeTransaction();
    fetchTokenTransaction();
  }, [tokenPageNumber, nativePageNumber]);

  useEffect(() => {
    fetchWeb2WalletBalance();
    fetchLiveBnbPrice();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeb2WalletBalance();
      fetchLiveBnbPrice();
      fetchNativeTransaction();
      fetchTokenTransaction();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // console.log(nativePageNumber);
  // console.log(tokenPageNumber);
  return (
    // <div className="web2wallet-wrapper">
    <Popover
      trigger={"click"}
      overlayClassName="web2-wallet-popover"
      content={content}
      placement="bottom"
    >
      <Button size="small">Web2 {t("wallet")}</Button>
    </Popover>
    // </div>
  );
};

export default Web2Wallet;
