import { Fragment, useState, useEffect } from "react";

import {
  Input,
  Typography,
  Space,
  Button,
  Tooltip,
  Modal,
  message,
} from "antd";
import { WalletOutlined, TagOutlined } from "@ant-design/icons";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useTranslation } from "react-i18next";
import useGetBNBPrice, { getFilteredPrice } from "hooks/useGetCoinPrice";
import {
  nichonftABI,
  contractAddress,
  auctionABI,
  auctionAddress,
  marketplaceAddress,
  marketplaceABI,
} from "contracts/constants";
import { checkExpired, getUTCTimeStamp, sleep } from "helpers/Utils";
import BNBIcon from "assets/images/bnb.png";
import { Flex } from "uikit/Flex/Flex";
import Notification from "components/common/Notification";

const showError = (msg) => {
  message.error(msg);
};

const showInfo = (msg) => {
  message.success(msg);
};
const { Title, Paragraph } = Typography;

const FixedPurchase = ({ onBuyHandle, onMakeOfferHandle, detail }) => {
  const { t } = useTranslation();
  const [isBuyProgress, setIsBuyProgress] = useState(false);
  const [isOfferProgress, setIsOfferProgress] = useState(false);
  const [offerPrice, setOfferPrice] = useState();
  const [isOfferModal, setIsOfferModal] = useState(false);
  const [offered, setOffered] = useState(false);
  // for make offer button
  const [showNotification, setShowNotification] = useState(false);
  // for buy button
  const [showBuyNotification, setShowBuyNotification] = useState(false);

  const { user, Moralis, web3 } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const bnbPrice = useGetBNBPrice(1);

  // Check if user sent offer
  useEffect(() => {
    const checkOfferState = async () => {
      try {
        if (!detail || !user) return;
        const queryParams = {
          tokenAddress: detail.tokenAddress,
          tokenId: detail.tokenId,
        };

        const alreadyOffered = await Moralis.Cloud.run(
          "checkAlreadyOffered",
          queryParams
        );
        // console.log(queryParams, alreadyOffered);
        setOffered(alreadyOffered);
      } catch (err) {
        console.log(err);
      }
    };

    checkOfferState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, user]);

  // Send offer
  const makeOffer = async () => {
    try {
      if (!user) {
        showError(t("connectYourWallet"));
        return;
      }

      if (offered) {
        showError(t("madeOffer"));
        return;
      }
      const isContract = (await web3.getCode(marketplaceAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferent"));
        setIsOfferModal(false);
        return;
      }

      setIsOfferProgress(true);

      // After 30days, offer would be expired
      // const
      const deadline = 30 * 24 * 3600; //getUTCTimeStamp(7);
      // Purchase
      const params = {
        contractAddress: marketplaceAddress,
        functionName: "createOffer",
        abi: marketplaceABI,
        params: {
          tokenAddress: detail?.tokenAddress,
          tokenId: detail?.tokenId,
          deadline,
        },
        msgValue: Moralis.Units.ETH(offerPrice),
      };

      const offerTx = await contractProcessor.fetch({
        params,
        onError: (err) => {
          console.log(err.data?.code);
          if (err.data?.code === -32000) {
            showError(t("insufficientFunds"));
          }
        },
      });
      if (offerTx) {
        await offerTx.wait(1);
        setShowNotification(true);
        // showInfo(
        //   `Your offer has been successfully created with price ${offerPrice}BNB`
        // );
        // await sleep(1000);
        // onMakeOfferHandle();
      } else {
        showError(t("errorOfferNFT"));
      }
    } catch (err) {
      showError(err);
    } finally {
      setIsOfferProgress(false);
      setIsOfferModal(false);
    }
  };

  // Buy item
  const buyHandle = async () => {
    try {
      const isContract = (await web3.getCode(marketplaceAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferentNetwork"));
        return;
      }

      setIsBuyProgress(true);

      // Purchase
      const params = {
        contractAddress: marketplaceAddress,
        functionName: "buy",
        abi: marketplaceABI,
        params: {
          tokenAddress: detail?.tokenAddress,
          tokenId: detail?.tokenId,
        },
        msgValue: Moralis.Units.ETH(detail?.fixedPrice),
      };
      const buyTx = await contractProcessor.fetch({
        params,
        onError: (err) => {
          throw err?.data;
        },
      });
      if (buyTx) {
        await buyTx.wait(1);
        setShowBuyNotification(true);
        // showInfo(`Successfully purchased`);
        // await sleep(1000);
        // onBuyHandle();
      } else {
        showError(t("failedBuyNFT"));
      }
    } catch (err) {
      showError(err?.message);
    } finally {
      setIsBuyProgress(false);
    }
  };

  return (
    <Fragment>
      <Modal
        open={isOfferModal || isOfferProgress}
        footer={false}
        closable={false}
        centered={true}
      >
        <div className="form-group">
          <Title level={3} type="secondary">
            {t("makeOffer")}
          </Title>

          <div className="form-item">
            <div className="nft-price">
              <Title level={5} type="primary">
                {t("price")}
              </Title>
              <div>
                {/* <span className='token-amount'>
                                    { /*offerPrice} BNB
                                </span> */}
                <span className="token-price">
                  {getFilteredPrice(bnbPrice * parseFloat(offerPrice))}
                </span>
              </div>
            </div>
            <Input
              type="number"
              placeholder={`${t("eg")} 0.01`}
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </div>
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={makeOffer}
              loading={isOfferProgress}
            >
              {isOfferProgress ? "In progress" : "Make Offer"}
            </Button>

            {!isOfferProgress && (
              <Button
                type="link"
                size="large"
                onClick={() => setIsOfferModal(false)}
              >
                {t("neverMind")}
              </Button>
            )}
          </Space>
        </div>
      </Modal>
      {detail && detail.isListed && detail.auctionPrice===0 && (
        // <div className='nft-price'>
        //     <span className='token-amount'>
        //         {detail?.fixedPrice} BNB
        //     </span>
        //     <span className='token-price'>
        //         ({ getFilteredPrice(bnbPrice * parseFloat(detail?.fixedPrice))})
        //     </span>
        // </div>
        <>
          <div style={{ color: "#cccccc", marginTop: 10, paddingBottom: 16 }}>
            {t("price")}:
          </div>
          <div style={{ margin: "0px 0 0px" }}>
            <div
              className="money-wrap"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div
                className="left"
                style={{ fontSize: "60px", height: "45px" }}
              >
                <img src={BNBIcon} style={{ width: "60px" }} alt="Nicho AI NFT" />
                <span style={{ marginLeft: 20 }}>{detail?.fixedPrice}</span>
              </div>

              {bnbPrice && (
                <div
                  className="right gray"
                  style={{ fontSize: "20px", flex: 1 }}
                >
                  {/* <span className="gray">Last offer:</span> */}
                  {getFilteredPrice(bnbPrice * parseFloat(detail?.fixedPrice))}
                </div>
              )}
            </div>
            <hr style={{ borderColor: "#7774FF", margin: "16px 0px 20px" }} />
            <div>
              {detail && detail.price > 0 && (
                <span className="light-gray-txt">
                  {t("lastOffer")}：&nbsp;{detail?.tradeVolume}
                </span>
              )}

              {/* {
              tradeVolume && 
              (
              <div className="right">
                  <span className="gray">Last offer:</span>
                  { tradeVolume }
              </div>  
              )
            } */}
            </div>
          </div>
        </>
      )}

      <Space
        style={{
          paddingTop: detail.isListed ? "6px" : "24px",
          marginBottom: 15,
        }}
      >
        {detail &&
          user &&
          detail.auctionPrice===0 &&
          detail.isListed &&
          detail.creator===user.get("ethAddress") && (
            <Tooltip placement="right" title={`You cannot buy your NFT`}>
              <Button type="primary" style={{ display: "none" }}>
                <WalletOutlined />
                {t("buy")}
              </Button>
            </Tooltip>
          )}

        {detail &&
          user &&
          detail.isListed &&
          detail.auctionPrice===0 &&
          detail.creator !== user.get("ethAddress") && (
            <Button
              type="primary"
              onClick={buyHandle}
              loading={isBuyProgress}
              style={{
                background: "#7774FF",
                borderRadius: 20,
                color: "white",
                padding: "8px 60px",
              }}
            >
              <WalletOutlined />
              {t("buy")}
            </Button>
          )}

        {detail &&
          user &&
          detail.creator !== user.get("ethAddress") &&
          detail.auctionPrice===0 &&
          offered && (
            <Tooltip placement="right" title={`You already offered`}>
              <Button disabled>
                <TagOutlined rotate={270} />
                {t("makeOff")}
              </Button>
            </Tooltip>
          )}
        {detail &&
          user &&
          detail.creator !== user.get("ethAddress") &&
          !offered &&
          (detail.auctionPrice===0 || checkExpired(detail.expireAt)) && (
            <Button
              onClick={() => setIsOfferModal(true)}
              loading={isOfferProgress}
              style={{
                border: "1px solid #7774FF",
                color: "#7774FF",
                borderRadius: 20,
                padding: "8px 40px",
              }}
            >
              <TagOutlined rotate={270} />
              {t("makeOff")}
            </Button>
          )}
      </Space>
      {/* new ui notification */}
      {showNotification && (
        <Notification
          type="success"
          message={`${t("yourOfferSuccessfully")} ${offerPrice}BNB`}
          header={t("makeOff")}
          isVisible={true}
          action={() => {
            setShowNotification(false);
            onMakeOfferHandle();
          }}
        />
      )}
      {showBuyNotification && (
        <Notification
          type="success"
          message={t("successfullyPurchased")}
          header={t("purchaseItem")}
          isVisible={true}
          action={() => {
            setShowBuyNotification(false);
            onBuyHandle();
          }}
        />
      )}
    </Fragment>
  );
};

export default FixedPurchase;
