import {
  Button,
  Input,
  message,
  Progress,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useState } from "react";
import "./AiMintingForm.scss";
import useGetBNBPrice, { getFilteredPrice } from "hooks/useGetCoinPrice";
import {
  useMoralis,
  useMoralisWeb3Api,
  useWeb3ExecuteFunction,
} from "react-moralis";
import {
  contractAddress,
  aiAgentABI,
  aiAgentAddress,
  marketplaceAddress,
  nichonftABI,
  marketplaceABI,
} from "../../../contracts/constants";

const AiMintingForm = ({ setIsOpenMintModal, imageUrl }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState({
    percent: 0,
    status: "normal",
  });

  const { fetch: mintNFT } = useWeb3ExecuteFunction();
  const { fetch: getTokenId } = useWeb3ExecuteFunction();
  const { fetch: setApprovalForAll } = useWeb3ExecuteFunction();
  const { fetch: listItemToMarket } = useWeb3ExecuteFunction();
  const web3Api = useMoralisWeb3Api();
  const { Moralis, user, isAuthenticated } = useMoralis();

  const currentBnbPrice = useGetBNBPrice(1);
  const aiCollectionId = process.env.REACT_APP_AI_IMAGE_COLLECTION_ID;

  const resetAllState = () => {
    setTitle("");
    setDescription("");
    setSellingPrice("");
    setExternalLink("");
    setMintingProgress({ percent: 0, status: "normal" });
  };
  const isValidInput = () => {
    if (title === "") {
      message.error("Please provide a title");
      return false;
    } else if (description === "") {
      message.error("Please provide a description");
      return false;
    } else if (sellingPrice === "") {
      message.error("Please set a selling price");
      return false;
    }

    return true;
  };

  const mintAiImage = async () => {
    if (!isValidInput()) return;

    try {
      if (user && isAuthenticated) {
        setIsMinting(true);
        // upload image and metadata to ipfs

        // upload image
        const base64AiImage = imageUrl.replace("data:image/png;base64,", "");
        const imageParams = {
          abi: [
            {
              path: "image.png",
              content: base64AiImage,
            },
          ],
        };
        const imagePath = await web3Api.storage.uploadFolder(imageParams);
        setMintingProgress({ percent: 15, status: "normal" });

        // upload metadata
        const metadataParams = {
          abi: [
            {
              path: "metadata/metadata.json",
              content: {
                name: title,
                collection: "AI Generator Images",
                description,
                external_link: externalLink,
                image: imagePath[0].path,
              },
            },
          ],
        };
        const metadataPath = await web3Api.storage.uploadFolder(metadataParams);
        setMintingProgress({ percent: 30, status: "normal" });
        // mint nft
        const params = {
          _nichoNft: contractAddress,
          _tokenURI: metadataPath[0].path,
          _toAddress: user.get("ethAddress"),
          _price: Moralis.Units.ETH(sellingPrice),
          _cId: aiCollectionId,
        };

        const tx = await mintNFT({
          params: {
            abi: aiAgentABI,
            contractAddress: aiAgentAddress,
            functionName: "mint",
            params,
          },
          onError: (err) => {
            throw err.message;
          },
        });
        await tx.wait(1);
        setMintingProgress({ percent: 45, status: "normal" });

        const tokenId = await getTokenId({
          params: {
            abi: aiAgentABI,
            contractAddress: aiAgentAddress,
            functionName: "getTokenId",
          },
          onError: (err) => {
            throw err.message;
          },
        });
        setMintingProgress({ percent: 60, status: "normal" });

        const setApproveTx = await setApprovalForAll({
          params: {
            contractAddress,
            abi: nichonftABI,
            functionName: "setApprovalForAll",
            params: {
              operator: marketplaceAddress,
              approved: true,
            },
          },
          onError: (err) => {
            throw err.message;
          },
        });

        await setApproveTx.wait(1);
        setMintingProgress({ percent: 75, status: "normal" });

        const listItemToMarketTx = await listItemToMarket({
          params: {
            contractAddress: marketplaceAddress,
            abi: marketplaceABI,
            functionName: "listItemToMarket",
            params: {
              tokenAddress: contractAddress,
              tokenId: Number(tokenId),
              askingPrice: Moralis.Units.ETH(sellingPrice),
            },
          },
          onError: (err) => {
            throw err.message;
          },
        });

        await listItemToMarketTx.wait(1);
        setMintingProgress({ percent: 100, status: "done" });
        message.success("AI Image minted");
        setTimeout(() => {
          resetAllState();
          setIsMinting(false);
          setIsOpenMintModal(false);
        }, 5000);
      } else {
        throw "Not Authorized to use this service, please sign in";
      }
    } catch (error) {
      message.error(error);
      setMintingProgress((prev) => ({ ...prev, status: "exception" }));
      setTimeout(() => {
        setIsMinting(false);
        setMintingProgress({ percent: 0, status: "normal" });
      }, 5000);
    }
  };

  return (
    <div className="ai-mint-form">
      {isMinting ? (
        <div className="ai-mint-form-overlay">
          <div className="ai-mint-form-overlay-loading">
            <Progress
              percent={mintingProgress.percent}
              status={mintingProgress.status}
              type="circle"
            />
            {mintingProgress.status === "normal" ? (
              <>
                <Typography.Title level={2} style={{ margin: "1rem 0" }}>
                  Minting...Please Wait
                </Typography.Title>
                <Spin size="large" />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="ai-mint-form-header">
        <Typography.Title className="ai-minting-form-header-text" level={2}>
          Mint AI Image
        </Typography.Title>
      </div>
      <Typography.Title className="ai-mint-form-info-txt">
        *We charge <span style={{ color: "green" }}>$0</span> minting fee, just
        pay <span style={{ color: "red" }}>GAS FEE</span>
      </Typography.Title>
      <div className="ai-mint-form-input-area">
        <div className="ai-mint-form-image">
          <div className="ai-mint-form-image-frame">
            <img src={imageUrl} width={300} height={300} />
          </div>
        </div>
        <div className="ai-mint-form-input-category">
          <Typography.Title level={3} className="ai-mint-form-input-header">
            Title:
          </Typography.Title>
          <Input
            className="ai-mint-form-input"
            size="large"
            placeholder="Give a name of your ai image"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="ai-mint-form-input-category">
          <Typography.Title level={3} className="ai-mint-form-input-header">
            External Link:
          </Typography.Title>
          <Input
            className="ai-mint-form-input"
            size="large"
            placeholder="Provide an external link if any"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
          />
        </div>
        <div className="ai-mint-form-input-category">
          <Typography.Title level={3} className="ai-mint-form-input-header">
            Description:
          </Typography.Title>
          <Input.TextArea
            rows={4}
            style={{ resize: "none" }}
            className="ai-mint-form-input"
            size="large"
            placeholder="Describe your ai image"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="ai-mint-form-input-category">
          <Typography.Title
            level={3}
            className="ai-mint-form-input-header"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Price: (BNB){" "}
            <span style={{ fontSize: "1rem", color: "green" }}>
              {getFilteredPrice(currentBnbPrice * parseFloat(sellingPrice))} USD
            </span>
          </Typography.Title>
          <Input
            type="number"
            min={0}
            step={0.01}
            className="ai-mint-form-input"
            size="large"
            placeholder="Your selling price in BNB"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="ai-mint-form-button-group">
          <Space size={"large"}>
            <Button
              size={"large"}
              onClick={() => setIsOpenMintModal(false)}
              style={{ width: "100%" }}
            >
              Cancel
            </Button>
            <Button type="primary" size={"large"} onClick={mintAiImage}>
              MINT MY AI IMAGE
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default AiMintingForm;
