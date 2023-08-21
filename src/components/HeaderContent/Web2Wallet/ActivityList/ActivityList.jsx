import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import "./ActivityList.scss";

const ActivityList = ({ history, currentAsset, currentChain }) => {
  const { user, Moralis } = useMoralis();

  // return true(send) if sender is current user
  const getSendOrRecieve = () =>
    user && history?.from_address === user?.get("ethAddress");

  const formatDate = (date) => new Date(date).toLocaleString();
  const formatPrice = (price) =>
    Number(Moralis.Units.FromWei(price, currentAsset === "bnb" ? 18 : 9));
  const formatAddress = (address) =>
    `${address.slice(0, 18)}....${address.slice(-17, -1)}`;

  const getEtherscanTxUrl = () => {
    switch (currentChain.chainId) {
      case "0x38":
        return currentAsset === "bnb"
          ? `https://bscscan.com/tx/${history.hash}`
          : `https://bscscan.com/tx/${history.transaction_hash}`;
      case "0x61":
        return currentAsset === "bnb"
          ? `https://testnet.bscscan.com/tx/${history.hash}`
          : `https://testnet.bscscan.com/tx/${history.transaction_hash}`;
      default:
        return null;
    }
  };
  const redirectToDetailWebpage = () => {
    const etherscanLink = getEtherscanTxUrl();
    console.log(etherscanLink);
    if (etherscanLink !== null) {
      window.open(etherscanLink);
    }
  };
  // console.log(history);
  return (
    <div
      className="web2wallet-activity-wrapper"
      onClick={redirectToDetailWebpage}
    >
      <div className="web2wallet-activity-logo">
        {getSendOrRecieve() ? (
          <ArrowUpOutlined
            rotate={45}
            style={{ color: "#6D17CD", fontSize: "1.5rem", fontWeight: 100 }}
          />
        ) : (
          <ArrowDownOutlined
            rotate={-45}
            style={{ color: "#1A04FB", fontSize: "1.5rem" }}
          />
        )}
      </div>
      <div className="web2wallet-activity-content">
        <div className="web2wallet-activity-top-content">
          <Typography.Paragraph>
            {getSendOrRecieve() ? "Send" : "Receive"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <span style={{ color: getSendOrRecieve() ? "red" : "green" }}>
              {getSendOrRecieve() ? "-" : "+"}
              {formatPrice(history.value).toFixed(2)}{" "}
            </span>
            {currentAsset === "bnb" ? "BNB" : "NICHO"}
          </Typography.Paragraph>
        </div>
        <div className="web2wallet-activity-bottom-content">
          <Typography.Paragraph className="web2wallet-activity-bottom-date">
            {formatDate(history.block_timestamp)}
          </Typography.Paragraph>
          <Typography.Paragraph className="web2wallet-activity-bottom-address">
            Hash:{" "}
            {currentAsset === "bnb"
              ? formatAddress(history.hash)
              : formatAddress(history.transaction_hash)}
            {/* {getSendOrRecieve()
              ? `To: ${history.to_address}`
              : `From: ${history.from_address}`} */}
          </Typography.Paragraph>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
