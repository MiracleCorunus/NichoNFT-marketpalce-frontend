import React, { Fragment, useState } from "react";
import { Typography, Input, Button, Tooltip, message } from "antd";
import useGetBNBPrice, { getFilteredPrice } from "hooks/useGetCoinPrice";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useTranslation } from "react-i18next";
import {
  nichonftABI,
  contractAddress,
  ERC721ABI,
  marketplaceAddress,
  marketplaceABI,
} from "contracts/constants";
import "./FixedSell.scss";
import { sleep } from "helpers/Utils";
import Notification from "components/common/Notification";

const { Paragraph } = Typography;

const showError = (msg) => {
  message.error(msg);
};

const showInfo = (msg) => {
  message.success(msg);
};

const FixedSell = ({ detail, onListUpdateHandle }) => {
  const { t } = useTranslation();
  const [price, setPrice] = useState();
  const [isInListing, setIsInListing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { user, Moralis, web3 } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const bnbPrice = useGetBNBPrice(1);

  // Approve NFT
  const approveNFT = async () => {
    try {
      // setApprovalForAll
      // const params = {
      //     contractAddress: detail?.tokenAddress,
      //     functionName: "setApprovalForAll",
      //     abi: ERC721ABI,
      //     params: {
      //         operator: marketplaceAddress,
      //         approved: true
      //     }
      // }

      // const safTx = await contractProcessor.fetch({ params });
      // if(safTx) {
      //     await safTx.wait(1);
      //     return true;
      // } else {

      const isContract = (await web3.getCode(detail?.tokenAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferentNetwork"));
        return false;
      }

      // APPROVE
      const approveParams = {
        contractAddress: detail?.tokenAddress,
        functionName: "approve",
        abi: ERC721ABI,
        params: {
          to: marketplaceAddress,
          tokenId: detail?.tokenId,
        },
      };

      const apvTx = await contractProcessor.fetch({ params: approveParams });
      if (apvTx) {
        await apvTx.wait(1);
        return true;
      } else {
        return false;
      }
      // }
    } catch (err) {
      console.log("Approve Error:", err);
      return false;
    }
  };

  /// NFT is approved to marketplace
  const checkApproved = async (address, tokenId) => {
    try {

      // Check if item was listed or not
      const params = {
        contractAddress: address,
        functionName: "getApproved",
        abi: ERC721ABI,
        params: {
          tokenId,
        },
      };

      const approvedAddress = await contractProcessor.fetch({ params });
      if (approvedAddress.toUpperCase() === marketplaceAddress.toUpperCase()) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  };

  /// NFT is approved to marketplace
  const isApproveForAll = async (address, creator) => {
    try {
      // Check if item was listed or not
      const params = {
        contractAddress: address,
        functionName: "isApprovedForAll",
        abi: ERC721ABI,
        params: {
          owner: creator,
          operator: marketplaceAddress,
        },
      };
      console.log(params);

      const isApproved = await contractProcessor.fetch({ params });
      if (!isApproved) return false;
      return true;
    } catch (err) {
      return false;
    }
  };

  // List NFT
  const listNFT = async () => {
    const isContract = (await web3.getCode(marketplaceAddress)).length > 5;
    if (!isContract) {
      showError(t("detectedDifferentNetwork"));
      return;
    }

    const params = {
      contractAddress: marketplaceAddress,
      functionName: "listItemToMarket",
      abi: marketplaceABI,
      params: {
        tokenAddress: detail?.tokenAddress,
        tokenId: detail?.tokenId,
        askingPrice: Moralis.Units.ETH(price),
      },
    };
    console.log("Transaction starts", params);
    const listingTx = await contractProcessor.fetch({ params });
    console.log("Transaction ends", listingTx);
    // check if the NFT has been deployed successfully
    if (listingTx) {
      await listingTx.wait(1);
      setShowNotification(true);
      // showInfo(`Your NFT has been successfully listed with price ${price}BNB`);
      // await sleep(1000);
      // onListUpdateHandle();
    } else {
      showError(t("errorToListNFT"));
    }
  };

  const doList = async () => {
    try {
      if (!user) {
        showError(t("connectYourWallet"));
        return;
      }
      setIsInListing(true);
      let isApproved1 = await checkApproved(
        detail.tokenAddress,
        detail.tokenId
      );
      let isApproved2 = await isApproveForAll(
        detail.tokenAddress,
        detail.creator
      );

      if (!isApproved1 && !isApproved2) {
        const result = await approveNFT();
        if (!result) {
          showError(t("NFTTokenApprove"));
          setIsInListing(false);
          return;
        }
      }
      await listNFT();
    } catch (err) {
      showError(t("NFTListingFailed"));
      setIsInListing(false);
    }
  };

  return (
    <Fragment>
      <div className="form-group">
        <div className="form-item">
          <div className="nft-price">
            <Paragraph>{t("price")} (BNB)</Paragraph>
            <div>
              <span className="token-price">
                {getFilteredPrice(bnbPrice * parseFloat(price))}
              </span>
            </div>
          </div>
          <Input
            type="number"
            placeholder={`${t("eg")} 0.01`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* <div className="form-item">   
                    <Paragraph>
                        Fees
                    </Paragraph>
                    <div className='nft-price'>    
                        <div>
                            <span className='token-price'>
                                Service Fee
                            </span>
                        </div>
                        <div>
                            <span className='token-price'>
                                2.5%
                            </span>
                        </div>
                    </div>  
                </div>   */}
        <div className="form-item">
          {(!price || price <= 0) && (
            <>
              <Tooltip placement="right" title={`Invalid price`}>
                <Button type="primary" disabled>
                  {" "}
                  {t("completeListing")}{" "}
                </Button>
              </Tooltip>
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
                onClick={onListUpdateHandle}
              >
                {t("back")}
              </Button>
            </>
          )}

          {price && price > 0 && (
            <Button loading={isInListing} onClick={doList}>
              {" "}
              {t("completeListing")}{" "}
            </Button>
          )}
        </div>
      </div>
      {/* new ui notification */}
      {showNotification && (
        <Notification
          type="success"
          message={`${t("yourNFTSuccessfully")} ${price}BNB`}
          header={t("NFTListing")}
          isVisible={true}
          action={() => {
            setShowNotification(false);
            onListUpdateHandle();
            // history.push(`/myNfts`);
          }}
        />
      )}
    </Fragment>
  );
};

export default FixedSell;
