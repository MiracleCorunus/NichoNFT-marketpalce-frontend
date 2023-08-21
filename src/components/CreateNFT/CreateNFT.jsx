/* eslint-disable no-throw-literal */
import { useState, useEffect, Fragment } from "react";
import { Helmet } from 'react-helmet';
import {
  Typography,
  Button,
  Input,
  Upload,
  Tooltip,
  message,
  Select,
  Image,
} from "antd";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import {
  API_KEY,
  contractAddress,
  creatorNFTABI,
  nichonftABI,
} from "contracts/constants";
import useGetBNBPrice, { getFilteredPrice } from "hooks/useGetCoinPrice";
import "./CreateNFT.scss";
// import { Link } from "react-router-dom";
import UploadIcon from "assets/images/new/createNFT/upload.png";
import ImgGreate from "assets/images/new/createNFT/img_greate.png";
import MintImg1 from "assets/images/new/createNFT/mint1.png";
import MintImg2 from "assets/images/new/createNFT/newMint2.svg";
import MintImg3 from "assets/images/new/createNFT/newMint3.svg";
import MintProgressImg from "assets/images/new/createNFT/mint_progress_img.svg";
import MintProgressCloseButton from "assets/images/new/createNFT/mint_progress_close_button.svg";
// import { InfoCircleOutlined } from "@ant-design/icons";
import SubTitle from "components/common/SubTitle";
import { getUserCollections } from "api/collections";
import Notification from "components/common/Notification";
import axios from "axios";

const { Title, Paragraph } = Typography;

function CreateNFT() {
  const { user, Moralis, isInitialized, web3 } = useMoralis();
  const { t } = useTranslation();
  let history = useHistory();
  const [nftFile, setNftFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [price, setPrice] = useState("");
  const [nFTAmount, setNFTAmount] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [stateText, setStateText] = useState("");
  const [collections, setCollections] = useState();
  const [collection, setCollection] = useState("Empty");
  const [mintStatus, setMintStatus] = useState(0);
  const [mintVisible, setMintVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showNoCollection, setShowNoCollection] = useState(false);

  const { fetch: mintNFT } = useWeb3ExecuteFunction();

  const bnbPrice = useGetBNBPrice(1);

  const hideFilter = () => {
    if (mintVisible) {
      setMintVisible(false);
    }
  };

  // console.log(showNotification);

  // Get user collection
  useEffect(() => {
    if (!user || !isInitialized) return;

    const getCollections = async () => {
      try {
        const params = {
          pageNo: 1,
          pageSize: 99,
          ethAddress: user.get("ethAddress"),
        };
        const items = await getUserCollections(params);
        if (items && items.total > 0) {
          // console.log(items.records);
          setCollections(items.records);
        } else {
          setShowNoCollection(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCollections();
  }, [user, isInitialized]);

  useEffect(() => {
    window.addEventListener("click", hideFilter, false);
    return () => {
      window.removeEventListener("click", hideFilter, false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log("nftfile", nftFile);

  // useEffect(() => {
  //   if (nftFile) {
  //     let pattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
  //     if (nftFile.name.match(pattern) !== null) {
  //       setNftFile((prev) => ({ ...prev, name: "test.jpg" }));
  //     }
  //   }
  // }, [imageUrl]);

  const beforeUpload = (file) => {
    if (!file) return;
    // check for invalid image filename
    // let pattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    // let pattern = /^[A-Za-z0-9]+\.[A-Za-z0-9]+$/gm;
    // if (file.name.match(pattern) === null) {
    //   showError("Invalid file name");
    //   return;
    // }

    // check file name length is less than 50 characters
    if (file.name.length > 50) {
      showError(t("fileNameLong"));
      return;
    }

    setNftFile(file);
    getBase64(file).then((data) => {
      if (!data) return;
      // console.log(data);
      setImageUrl(data);
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // to prevent default action of antd Upload component
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const showError = (msg) => {
    message.error(msg);
  };

  // const showSuccess = (msg) => {
  //   const secondsToGo = 3;
  //   const modal = Modal.success({
  //     title: "Success!",
  //     content: msg,
  //   });

  //   setTimeout(() => {
  //     modal.destroy();
  //   }, secondsToGo * 1000);
  // };

  const createItem = async () => {
    try {
      if (
        collection === "Empty" ||
        collection === "empty" ||
        collection === "Choose One"
      ) {
        showError(t("needChooseCollection"));
        return;
      }

      const amountToMint = parseInt(nFTAmount);

      if (!nftFile || nftFile === undefined) {
        showError(t("pleaseInsertFile"));
        return;
      } else if (description === undefined || description.length === 0) {
        showError(t("pleaseDefineDescription"));
        return;
      } else if (name === undefined || name.length === 0) {
        showError(t("pleaseDefineTitle"));
        return;
      } else if (price === undefined || price.length === 0) {
        showError(t("pleaseEnterPrice"));
        return;
      } else if (!amountToMint || amountToMint < 1) {
        showError(t("amountNotValid"));
        return;
      }

      let collectionObject;
      for (let i = 0; i < collections.length; i++) {
        if (collections[i].objectId === collection) {
          collectionObject = collections[i];
        }
      }

      if (!collectionObject) {
        showError(t("collectionNotExist"));
        return;
      }

      if (!web3) {
        showError(t("Web3Error"));
        return;
      }

      const isContract =
        (await web3.getCode(collectionObject.collectionAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferentNetwork"));
        return;
      }

      setWaiting(true);
      setMintVisible(true);
      setMintStatus(1);
      setStateText(t("creatingNewNFT"));

      // Ready for ipfs (file and metadata)
      const nftFileIpfs = new Moralis.File("image.img", nftFile);
      await nftFileIpfs.saveIPFS();
      const nftFilePath = nftFileIpfs.ipfs();

      const askingPrice = Moralis.Units.ETH(price);
      let functionName;
      let params;
      let contractABI;

      setMintStatus(2);
      if (amountToMint.toString() === "1") {
        // const metadata = {
        //   name,
        //   collection: collectionObject.title,
        //   description,
        //   external_link: externalLink,
        //   image: nftFilePath,
        // };

        // const nftFileMetadata = new Moralis.File("metadata.json", {
        //   base64: Base64.btoa(JSON.stringify(metadata)),
        // });
        // await nftFileMetadata.saveIPFS();
        // const nftFileMetadataPath = nftFileMetadata.ipfs();

        let ipfsArray = [];
        const metadataContent = {
          path: "metadata/metadata.json",
          content: {
            name,
            collection: collectionObject.title,
            description,
            external_link: externalLink,
            image: nftFilePath,
          },
        };
        ipfsArray.push(metadataContent);
        const { data } = await axios.post(
          "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
          ipfsArray,
          {
            headers: {
              "X-API-KEY": `${API_KEY}`,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
        // console.log(data);
        const nftFileMetadataPath = data[0]?.path;

        if (collectionObject.collectionAddress === contractAddress) {
          contractABI = nichonftABI;
          params = {
            _tokenURI: nftFileMetadataPath,
            _toAddress: user.get("ethAddress"),
            _price: askingPrice,
            _amount: amountToMint.toString(),
            cId: collectionObject.objectId,
          };
        } else {
          contractABI = creatorNFTABI;
          params = {
            _tokenUri: nftFileMetadataPath,
            _price: askingPrice,
            _amount: amountToMint.toString(),
          };
        }
        functionName = "batchSNMint";
      } else {
        // const ipfsArray = [];
        // for (let i = 0; i < parseInt(amountToMint.toString()); i++) {
        //   const metadata = {
        //     name: `${name} #${i + 1}`,
        //     collection: collectionObject.title,
        //     description,
        //     external_link: externalLink,
        //     image: nftFilePath,
        //   };

        //   const nftFileMetadata = new Moralis.File("metadata.json", {
        //     base64: Base64.btoa(JSON.stringify(metadata)),
        //   });
        //   await nftFileMetadata.saveIPFS();
        //   const nftFileMetadataPath = nftFileMetadata.ipfs();

        //   ipfsArray.push(nftFileMetadataPath);
        // }
        // console.log(ipfsArray);

        let tempIpfsArr = [];
        for (let i = 0; i < parseInt(amountToMint.toString()); i++) {
          let metadataContent = {
            path: `metadata/${i}.json`,
            content: {
              name: `${name} #${i + 1}`,
              collection: collectionObject.title,
              description,
              external_link: externalLink,
              image: nftFilePath,
            },
          };
          tempIpfsArr.push(metadataContent);
        }
        const { data: ipfsPaths } = await axios.post(
          "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
          tempIpfsArr,
          {
            headers: {
              "X-API-KEY": `${API_KEY}`,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
        let ipfsArray = [];
        await Promise.all(
          // eslint-disable-next-line array-callback-return
          ipfsPaths.map((ipfs) => {
            ipfsArray.push(ipfs.path);
          })
        );
        // console.log(ipfsArray);

        if (collectionObject.collectionAddress === contractAddress) {
          contractABI = nichonftABI;
          params = {
            _tokenURI: ipfsArray,
            _toAddress: user.get("ethAddress"),
            _price: askingPrice,
            _amount: amountToMint.toString(),
            cId: collectionObject.objectId,
          };
        } else {
          contractABI = creatorNFTABI;
          params = {
            _tokenUri: ipfsArray,
            _price: askingPrice,
            _amount: amountToMint.toString(),
          };
        }

        functionName = "batchDNMint";
      }

      // console.log(
      //   "Before mint: ",
      //   functionName,
      //   params,
      //   collectionObject,
      //   contractABI
      // );
      setMintStatus(3);
      // Mint new NFT
      const mintNFTTx = await mintNFT({
        params: {
          abi: contractABI,
          contractAddress: collectionObject.collectionAddress,
          functionName,
          params,
        },
        onError: (err) => {
          console.log(err);
        },
      });

      // check if the NFT has been deployed successfully
      if (mintNFTTx) {
        await mintNFTTx.wait(1);
        setMintStatus(4);

        setStateText("");
        setMintVisible(false);
        setWaiting(false);
        setShowNotification(true);
        // showSuccess(`Your NFT (${name}) has been successfully created`);

        // setTimeout(() => {
        //   history.push(`/myNfts`);
        // }, 500);
      } else {
        throw "Error to deploy contract";
      }
    } catch (err) {
      console.log(err);
      showError(err);
      setMintVisible(false);
      setWaiting(false);
    }
  };

  const cancelMint = () => {
    setMintVisible(false);
    setWaiting(false);
  };

  const onSelectCollection = (value) => {
    setCollection(value);
  };

  return (
    <div className="create-nft-new">
      <Helmet>
        <title>Nicho AI NFT | Create</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className="create-nft-header">
        <SubTitle title={t("createNFT")} />
        <div
          className="create-top-content"
          style={{ backgroundImage: `url(${ImgGreate})` }}
        >
          <div className="top-title">
            {t("createNFT")}
            {/* <Link className="to-batch-nft" to="/batchNFT">
              Batch Mint
              <Tooltip title="The batch mint function which allows user mint lot of different artworks at one click">
                <InfoCircleOutlined />
              </Tooltip>
            </Link> */}
          </div>
        </div>
        <div className="create-nft-content create-bot-content">
          <div className="theme-block-button-group">
            <Button
              className="theme-block-button theme-block-button-focus"
              disabled
            >
              {t("normalMint")}
            </Button>
            <Button
              className="theme-block-button"
              onClick={() => history.push("/batchNFT")}
            >
              {t("batchMint")}
            </Button>
          </div>
          {/* {(collections === undefined || collections.length === 0) && (
            <div>
              <p>You have no any collection.</p>
              <p>
                Need to create at least one. Click{" "}
                <Link to="/CreateOwnCollection">here</Link> to create
                collection.
              </p>
            </div>
          )} */}
          {/* click <a href="/CreateOwnCollection">here</a> */}
          {/* New error notification */}
          {showNoCollection && (
            <Notification
              type={"error"}
              isVisible={true}
              message={`Need to create one collection, click <a href="/CreateOwnCollection">here</a>`}
              header={"Need a Collection"}
              action={() => history.push("/createOwnCollection")}
            />
          )}

          <div className="upload-group">
            <Upload
              accept="image/*"
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              action=""
              customRequest={dummyRequest}
            >
              <div className="file-uploader">
                <div>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Nicho AI NFT"
                      style={{ width: "300px" }}
                    />
                  ) : (
                    <Image
                      style={{ marginTop: "22px" }}
                      preview={false}
                      src={UploadIcon}
                    />
                  )}
                </div>
                <Title style={{ color: "#fff", fontSize: "14px" }}>
                  {imageUrl ? t("updateFile") : t("dragImage")}
                </Title>
                <Paragraph style={{ color: "#636C80", fontSize: "12px" }}>
                  {t("chooseFile200")}
                </Paragraph>
              </div>
            </Upload>
          </div>

          <div className="form-group">
            <div className="form-item">
              <div
                className="form-item-ai-button"
                onClick={() => history.push("/imageGenerator")}
              >
                <Button>{t("aiDrawing")}</Button>
              </div>
            </div>

            <div className="form-item">
              <Title level={4}>{t("title")}</Title>
              <Input
                placeholder={`${t("eg")} #1 Crypto Funk`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-item">
              <Title level={4}>{t("externalLink")}</Title>
              <Input
                placeholder="Webpage, twitter or instagram link"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
              />
            </div>

            <div className="form-item">
              <Title level={4}>{t("description")}</Title>
              <Input.TextArea
                rows={4}
                placeholder={`${t("eg")} 'This is cool item'`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-item">
              <div className="nft-price">
                <Title level={4}>{t("price")} (BNB)</Title>
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
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>

            <div className="form-item">
              <Title level={4}>{t("NFTAmount")}</Title>
              <Input
                type="number"
                placeholder="eg: 5 (NOTE: should be unsigned integer)"
                value={nFTAmount}
                onChange={(e) => setNFTAmount(e.target.value)}
              />
            </div>

            <div className="form-item">
              <Title level={4}>{t("chooseCollection")}</Title>
              <Select
                defaultValue={t("chooseOne")}
                style={{ width: "100%" }}
                onChange={onSelectCollection}
              >
                {(collections === undefined || collections.length === 0) && (
                  <Select.Option value="empty">{t("empty")}</Select.Option>
                )}

                {collections &&
                  collections.map((item, idx) => (
                    <Fragment key={idx}>
                      <Select.Option value={item.objectId}>
                        {item.title}
                      </Select.Option>
                    </Fragment>
                  ))}
              </Select>
            </div>

            <div className="form-action">
              <Button onClick={createItem} loading={waiting}>
                {waiting ? stateText : t("confirm")}
              </Button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 60, marginBottom: -60 }}>
          <Title
            level={5}
            style={{ color: "#999", textAlign: "center", fontSize: "14px" }}
            strong
          >
            {t("freeCreate")}
          </Title>
        </div>
      </div>
      {/* new ui notification */}
      {showNotification && (
        <Notification
          type="success"
          message={t("congratulationsMinting")}
          header={t("mintSuccessful")}
          isVisible={true}
          action={() => {
            setShowNotification(false);
            history.push(`/myNfts`);
          }}
        />
      )}
      {/* I don't know the logic here. If the progress is not correct, please adjust it. Thank you */}
      <div
        className="mint-progress-model"
        style={{ display: mintVisible ? "block" : "none" }}
      >
        <div className="mint-progress">
          <div className="mint-header" style={{ marginTop: 0 }}>
            <Tooltip placement="bottom" title="Cancel Minting" zIndex={9999}>
              <img
                src={MintProgressCloseButton}
                alt="close button"
                width={24}
                height={24}
                onClick={cancelMint}
                style={{
                  alignSelf: "flex-end",
                  margin: "2px 2px 0 0",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <img
              src={MintProgressImg}
              alt="Nicho AI NFT"
              width={80}
              height={80}
            />
            {t("mintProgress")}
          </div>

          <div className="mint-content">
            <div className="mint-item">
              {t("uploadingImage")}
              <img
                className="mint-item-img"
                src={mintStatus > 1 ? MintImg1 : MintImg2}
                alt="Nicho AI NFT"
              />
            </div>
            <div className="mint-item">
              {t("creatingTheMetadata")}
              <img
                className="mint-item-img"
                src={
                  mintStatus > 2
                    ? MintImg1
                    : mintStatus === 2
                    ? MintImg2
                    : MintImg3
                }
                alt="Nicho AI NFT"
              />
            </div>
            <div className="mint-item" style={{ marginBottom: "-2px" }}>
              {t("mintNFTToken")}
              <img
                className="mint-item-img"
                src={
                  mintStatus > 3
                    ? MintImg1
                    : mintStatus === 3
                    ? MintImg2
                    : MintImg3
                }
                alt="Nicho AI NFT"
              />
            </div>
          </div>
          {/* <div className="mint-footer">
            <span
              className="cancel-btn"
              onClick={() => {
                cancelMint();
              }}
            >
              Cancal
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default CreateNFT;
