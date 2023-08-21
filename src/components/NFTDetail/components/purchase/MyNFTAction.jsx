import { useState, Fragment } from "react";
import { Input, Typography, Space, Button, Modal, message } from "antd";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useTranslation } from "react-i18next";
import useGetBNBPrice, { getFilteredPrice } from "hooks/useGetCoinPrice";
import { marketplaceAddress, marketplaceABI } from "contracts/constants";
// import { ArrowLeftOutlined } from "@ant-design/icons";
import "./MyNFTAction.scss";
import { checkExpired, sleep } from "helpers/Utils";
import Notification from "components/common/Notification";

const { Title, Paragraph } = Typography;

const showError = (msg) => {
  message.error(msg);
};

const MyNFTAction = ({
  onCancelHandle,
  onUpdatePriceHandle,
  detail,
  onSellActionHandle,
  sellOption,
}) => {
  const { t } = useTranslation();
  const [isPriceModal, setIsPriceModal] = useState(false);
  const [isUpdateListModal, setIsUpdateListModal] = useState(false);

  const [isStateUpdate, setIsStateUpdate] = useState(false);
  const [isPriceUpdate, setIsPriceUpdate] = useState(false);
  // for cancel listing button
  const [showNotification, setShowNotification] = useState(false);
  // for update price button
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // If sell
  // const [sellOption, setSellOption] = useState(false);

  const [newPrice, setNewPrice] = useState();

  const { user, Moralis, web3 } = useMoralis();
  const bnbPrice = useGetBNBPrice(1);
  const contractProcessor = useWeb3ExecuteFunction();

  // Update item's price in case of fixed sale
  const updatePrice = async () => {
    try {
      if (newPrice === 0 || newPrice === undefined) {
        showError(t("inputNewPrice"));
        return;
      }

      if (detail?.fixedPrice.toString() === newPrice.toString()) {
        showError(t("selectAnotherPrice"));
        return;
      }

      if (!user || user.get("ethAddress") !== detail.creator) {
        showError(t("notTokenOwner"));
        return;
      }
      const isContract = (await web3.getCode(marketplaceAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferentNetwork"));
        return;
      }

      setIsPriceUpdate(true);
      // Update price
      const params = {
        contractAddress: marketplaceAddress,
        functionName: "listItemToMarket",
        abi: marketplaceABI,
        params: {
          tokenAddress: detail?.tokenAddress,
          tokenId: detail?.tokenId,
          askingPrice: Moralis.Units.ETH(newPrice),
        },
      };
      console.log("Transaction starts", params);
      const updateListingTx = await contractProcessor.fetch({ params });
      console.log("Transaction ends", updateListingTx);
      // check if the NFT has been deployed successfully
      if (updateListingTx) {
        await updateListingTx.wait(1);

        setIsPriceModal(false);
        setShowUpdateNotification(true);
        // showInfo(
        //   `Your NFT price has been successfully updated to ${newPrice}BNB`
        // );
        await sleep(1000);
        onUpdatePriceHandle();
      } else {
        showError(t("errorUpdatePrice"));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPriceUpdate(false);
    }
  };

  // Cancel listing
  const cancelList = async () => {
    try {
      const isContract = (await web3.getCode(marketplaceAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferentNetwork"));
        return;
      }

      setIsStateUpdate(true);

      const params = {
        contractAddress: marketplaceAddress,
        functionName: "cancelListing",
        abi: marketplaceABI,
        params: {
          tokenAddress: detail.tokenAddress,
          tokenId: detail.tokenId,
        },
      };

      const cancelTx = await contractProcessor.fetch({ params });

      if (cancelTx) {
        await cancelTx.wait(1);

        setIsUpdateListModal(false);
        setShowNotification(true);
        // showInfo(`Your NFT price has been successfully unlisted`);
        await sleep(1000);
        onCancelHandle();
      } else {
        showError(t("errorDeployContract"));
      }
    } catch (err) {
      console.log(err);
      showError(err);
      setIsStateUpdate(false);
    }
  };

  const sell = () => {
    // setSellOption(!sellOption);
    onSellActionHandle();
  };

  return (
    <Fragment>
      <Modal
        open={isUpdateListModal || isPriceModal}
        footer={false}
        closable={false}
        centered={true}
      >
        {isPriceModal && (
          <div className="form-group">
            <Title level={3} type="secondary">
              Update the listing price
            </Title>

            <div className="form-item">
              <div className="nft-price">
                <Title level={5} type="primary">
                  {t("currentPrice")}
                </Title>
                <div>
                  <span className="token-amount">{detail.fixedPrice} BNB</span>
                  <span className="token-price">
                    (
                    {getFilteredPrice(bnbPrice * parseFloat(detail.fixedPrice))}
                    )
                  </span>
                </div>
              </div>
              <Input
                type="number"
                placeholder={`${t("eg")} 0.01`}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />

              <p style={{ color: "#f8f8f8", padding: "10px 0" }}>
                {t("additionalGas")}
              </p>
            </div>
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => updatePrice()}
                loading={isPriceUpdate}
              >
                {isPriceUpdate ? "Updating" : "Update price"}
              </Button>

              {!isStateUpdate && !isPriceUpdate && (
                <Button
                  type="link"
                  size="large"
                  onClick={() => {
                    setIsPriceModal(false);
                    setIsUpdateListModal(false);
                  }}
                >
                  {t("neverMind")}
                </Button>
              )}
            </Space>
          </div>
        )}

        {isUpdateListModal && (
          <div className="form-group">
            <Title level={4} type="primary" style={{ textAlign: "center" }}>
              {t("youReallyWant")}
            </Title>

            <div className="form-item">
              <Paragraph>
                {t("saleCancelation")}
              </Paragraph>
            </div>
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={cancelList}
                loading={isStateUpdate}
              >
                {isStateUpdate ? t("inProgress") : t("cancelListing")}
              </Button>

              {!isStateUpdate && !isPriceUpdate && (
                <Button
                  type="link"
                  size="large"
                  onClick={() => {
                    setIsPriceModal(false);
                    setIsUpdateListModal(false);
                  }}
                >
                  {t("neverMind")}
                </Button>
              )}
            </Space>
          </div>
        )}
      </Modal>
      <Space>
        {/* If Listed */}
        {detail.isListed && (
          <Button onClick={() => setIsUpdateListModal(true)}>
            {t("cancelListing")}
          </Button>
        )}

        {/* This need to be displayed only for fixed sale. */}
        {detail.isListed && detail.auctionPrice===0 && (
          <Button type="primary" onClick={() => setIsPriceModal(true)}>
            {t("updatePrice")}
          </Button>
        )}

        {/* if button name is in "back" */}
        {/* { (!detail.isListed ) && sellOption && // || parseInt(detail.expireAt) < getUTCTimeStamp(0)
                    <Button type="link" onClick={ sell } >
                        <ArrowLeftOutlined /> Back
                    </Button>
                } */}

        {/* if button name is in "sell" */}
        {/* If listed or if auction sale ended */}
        {(!detail.isListed ||
          (checkExpired(detail.expireAt) && detail.auctionPrice > 0)) &&
          !sellOption && ( //
            <Button
              type="primary"
              onClick={sell}
              style={{ position: "absolute", fontSize: 18, top: 0 }}
            >
              {t("sell")}
            </Button>
          )}
      </Space>
      {/* new ui notification */}
      {showNotification && (
        <Notification
          type="success"
          message={t("listingSuccessfullyCancel")}
          header={t("cancelListing")}
          isVisible={true}
          action={() => {
            setShowNotification(false);
            // history.push(`/myNfts`);
          }}
        />
      )}
      {showUpdateNotification && (
        <Notification
          type="success"
          message={`${t("yourNFTPrice")} ${newPrice}BNB`}
          header={t("updatePrice")}
          isVisible={true}
          action={() => {
            setShowUpdateNotification(false);
            // history.push(`/myNfts`);
          }}
        />
      )}
    </Fragment>
  );
};

export default MyNFTAction;
