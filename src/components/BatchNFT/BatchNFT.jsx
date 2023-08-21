/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { useState, useEffect, Fragment } from "react";
import { Helmet } from 'react-helmet';
import {
  Typography,
  Button,
  Input,
  Upload,
  Modal,
  message,
  Select,
  Image,
  Tooltip,
} from "antd";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import {
  nichonftABI,
  API_KEY,
  contractAddress,
  creatorNFTABI,
} from "contracts/constants";
import axios from "axios";
import { useTranslation } from "react-i18next";
import useGetBNBPrice, { getFilteredPrice } from "hooks/useGetCoinPrice";
import { useHistory } from "react-router-dom";
import "./BatchNFT.scss";
// import { Link } from "react-router-dom";
import Back from "assets/images/new/createNFT/back.png";
import UploadIcon from "assets/images/new/createNFT/upload.png";
import ImgGreate from "assets/images/new/createNFT/img_greate.png";
import MintImg1 from "assets/images/new/createNFT/mint1.png";
import MintImg2 from "assets/images/new/createNFT/newMint2.svg";
import MintImg3 from "assets/images/new/createNFT/newMint3.svg";
import MintProgressImg from "assets/images/new/createNFT/mint_progress_img.svg";
import MintProgressCloseButton from "assets/images/new/createNFT/mint_progress_close_button.svg";
import { getUserCollections } from "api/collections";
import Notification from "components/common/Notification";

const { Title, Paragraph } = Typography;

function BatchNFT() {
  const { user, Moralis, isInitialized, web3 } = useMoralis();
  const { t } = useTranslation();
  let history = useHistory();
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [price, setPrice] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [stateText, setStateText] = useState("");
  const [collections, setCollections] = useState();
  const [collection, setCollection] = useState("Empty");
  const [batchImages, setBatchImages] = useState();
  const [startNum, setStartTime] = useState(1);
  const [mintStatus, setMintStatus] = useState(0);
  const [mintVisible, setMintVisible] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isValidFileSet, setIsValidFileSet] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const { fetch: mintNFT } = useWeb3ExecuteFunction();
  const bnbPrice = useGetBNBPrice(1);

  const hideFilter = () => {
    if (mintVisible) {
      setMintVisible(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (uploadFiles) {
        // let pattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
        // let pattern = /^[A-Za-z0-9]+\.[A-Za-z0-9]+$/gm;
        let tempArrFileLength = [];
        let tempArrFileType = [];

        // check file length
        await Promise.all(
          uploadFiles.map((file) => {
            tempArrFileLength.push(file.name.length <= 50);
          })
        );
        //check file type
        await Promise.all(
          uploadFiles.map((file) => {
            tempArrFileType.push(file.type.split("/")[0] === "image");
          })
        );
        const isValidFileLength = tempArrFileLength.every(
          (val) => val === true
        );
        const isValidFileType = tempArrFileType.every((val) => val === true);

        if (isValidFileLength && isValidFileType) {
          setIsValidFileSet(true);
        } else {
          setIsValidFileSet(false);
        }

        if (!isValidFileLength) {
          showError("Filename is too long, Please re-upload all images");
        }
        if (!isValidFileType) {
          showError(
            "Folder contains non-image file, Please re-upload all images"
          );
        }
      }
    })();
  }, [uploadFiles]);

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
          setCollections(items.records);
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

  const beforeUpload = (file, arr) => {
    if (!file) return;

    setUploadFiles(arr);
    setBatchImages(arr);
    getBase64(file).then((data) => {
      if (!data) return;
      setImageUrl(data?.content);
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

  const showSuccess = (msg) => {
    const secondsToGo = 3;
    const modal = Modal.success({
      title: "Success!",
      content: msg,
    });

    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          path: `images/${file.name}`,
          content: reader.result.toString("base64"),
        });
      reader.onerror = (error) => reject(error);
    });
  };

  const createItem = async () => {
    try {
      if (
        collection === "Empty" ||
        collection === "empty" ||
        collection === "Choose One"
      ) {
        showError("You need to choose one collection");
        return;
      }

      if (!batchImages || batchImages.length === 0) {
        showError("Please provide images");
        return;
      } else if (!isValidFileSet) {
        showError("Invalid filename format, Please re-upload all images");
        return;
      } else if (description === undefined || description.length === 0) {
        showError("Please define a description");
        return;
      } else if (name === undefined || name.length === 0) {
        showError("Please define a title");
        return;
      } else if (price === undefined || price.length === 0) {
        showError("Please enter price");
        return;
      }

      let collectionObject;
      for (let i = 0; i < collections.length; i++) {
        if (collections[i].objectId === collection) {
          collectionObject = collections[i];
        }
      }
      if (!collectionObject) {
        showError("Collection not exist");
        return;
      }

      const isContract =
        (await web3.getCode(collectionObject.collectionAddress)).length > 5;
      if (!isContract) {
        showError(
          "Detected different network. Please double check your chain id"
        );
        return;
      }

      setWaiting(true);
      setMintVisible(true);
      setMintStatus(1);
      setStateText("Creating new NFT is in process");

      let promises = [];
      for (let i = 0; i < batchImages.length; i++) {
        if (batchImages[i].type.includes("image")) {
          promises.push(getBase64(batchImages[i]));
        }
      }

      Promise.all(promises).then((data) => {
        let ipfsArray = [];
        for (let i = 0; i < data.length; i++) {
          ipfsArray.push(data[i]);
        }
        // console.log(ipfsArray)

        axios
          .post(
            "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            ipfsArray,
            {
              headers: {
                "X-API-KEY": `${API_KEY}`,
                "Content-Type": "application/json",
                accept: "application/json",
              },
            }
          )
          .then((res) => {
            createMetadataPath(res.data);
          })
          .catch((error) => {
            console.log(error);
            setWaiting(false);
          });
      });
    } catch (err) {
      console.log(err);
      showError(err);
      setWaiting(false);
    }
  };

  const createMetadataPath = (data) => {
    try {
      let ipfsArray = [];
      setMintStatus(2);

      let collectionObject;
      for (let i = 0; i < collections.length; i++) {
        if (collections[i].objectId === collection) {
          collectionObject = collections[i];
        }
      }

      for (let i = 0; i < data.length; i++) {
        let paddedHex = i.toString();
        ipfsArray.push({
          path: `metadata/${paddedHex}`,
          content: {
            image: `${data[i].path}`,
            name: `${name} #${i + (startNum ? startNum : 1)}`,
            description,
            external_link: externalLink,
            collection: collectionObject.title,
          },
        });
      }

      // console.log(urlObject, shortPath, cid)
      axios
        .post(
          "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
          ipfsArray,
          {
            headers: {
              "X-API-KEY": `${API_KEY}`,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        )
        .then((res) => {
          let fullpath = res.data[0].path;
          let shortpath = fullpath.substring(0, fullpath.lastIndexOf("/") + 1);
          batchMintCall(shortpath, res.data.length, collectionObject);
        })
        .catch((error) => {
          console.log(error);
          setWaiting(false);
        });
    } catch (err) {
      console.log(err);
      setWaiting(false);
    }
  };

  const batchMintCall = async (baseURI, amount, collectionObject) => {
    try {
      setMintVisible(true);
      setMintStatus(3);
      setStateText("Minting NFT token");
      const askingPrice = Moralis.Units.ETH(price);
      let contractABI;
      let params;
      if (collectionObject.collectionAddress === contractAddress) {
        contractABI = nichonftABI;
        params = {
          _baseTokenURI: baseURI,
          _toAddress: user.get("ethAddress"),
          _price: askingPrice,
          _amount: amount.toString(),
          cId: collectionObject.objectId,
        };
      } else {
        contractABI = creatorNFTABI;
        params = {
          _baseTokenUri: baseURI,
          _price: askingPrice,
          _amount: amount.toString(),
        };
      }
      const functionName = "batchIDMint";

      // Mint
      const mintNFTTx = await mintNFT({
        params: {
          abi: contractABI,
          contractAddress: collectionObject.collectionAddress,
          functionName,
          params,
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
        showError("Error to deploy contract");
        setWaiting(false);
      }
    } catch (err) {
      console.log(err);
      setWaiting(false);
    }
  };

  const onSelectCollection = (value) => {
    setCollection(value);
  };

  return (
    <div className="create-nft-new">
      <Helmet>
        <title>Nicho AI NFT | Batch NFT Create</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className="create-nft-header">
        <div className="com-sub-title">
          <div
            style={{ paddingRight: "20px" }}
            onClick={() => window.history.back(-1)}
          >
            <Image preview={false} src={Back} />
          </div>
          <span>{t("createnNewNFT")}</span>
        </div>
        <div
          className="create-top-content"
          style={{ backgroundImage: `url(${ImgGreate})` }}
        >
          <div className="top-title">{t("createnNewNFT")}</div>
        </div>
      </div>
      <div className="create-nft-content create-bot-content">
        <div className="theme-block-button-group">
          <Button
            className="theme-block-button"
            onClick={() => history.push("/createNFT")}
          >
            {t("normalMint")}
          </Button>
          <Button
            disabled
            className="theme-block-button theme-block-button-focus"
          >
            {t("batchMint")}
          </Button>
        </div>
        {/* {(collections === undefined || collections.length === 0) && (
          <div>
            <p>You have no any collection.</p>
            <p>
              Need to create at least one. Click{" "}
              <Link to="/CreateOwnCollection">here</Link> to create collection.
            </p>
          </div>
        )} */}

        <p style={{ paddingTop: "15px" }}>
          {t("knowAboutBatchMint")}{" "}
          <a
            href="https://medium.com/@NichoNFT/how-to-use-batch-mint-to-create-lots-of-nfts-in-nicho-nft-b48208c0a923"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            {t("here")}{" "}
          </a>
        </p>
        <div className="upload-group">
          <div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              action=""
              customRequest={dummyRequest}
              directory
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
                      style={{ marginTop: "42px" }}
                      preview={false}
                      src={UploadIcon}
                    />
                  )}
                </div>
                <Title style={{ color: "#fff", fontSize: "16px" }}>
                  {imageUrl ? t("updateFile") : t("chooseFile")}
                </Title>
                <Paragraph style={{ color: "#636C80", fontSize: "12px" }}>
                  {t("dragFile")}
                </Paragraph>
              </div>
            </Upload>
          </div>
        </div>

        <div className="form-group">
          <div className="form-item">
            <Title level={4}>Title</Title>
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
              placeholder={`${t('eg')} 'This is cool item'`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-item">
            <div className="nft-price">
              <Title level={4}>{t("startNumber")}</Title>
            </div>
            <Input
              type="number"
              placeholder="Default: 1"
              value={startNum}
              onChange={(e) => setStartTime(parseInt(e.target.value))}
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
              placeholder="eg: 0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="form-item">
            <Title level={4}>{t("chooseCollection")}</Title>
            <Select
              defaultValue={t('chooseOne')}
              style={{ width: "100%" }}
              onChange={onSelectCollection}
            >
              {(collections === undefined || collections.length === 0) && (
                <Select.Option value="empty">Empty</Select.Option>
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
              {waiting ? stateText : "Confirm"}
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
                onClick={() => {
                  setWaiting(false);
                  setMintVisible(false);
                }}
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
                src={mintStatus >= 1 ? MintImg1 : MintImg2}
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
                setMintVisible(false);
              }}
            >
              Cancal
            </span>
          </div> */}
        </div>
      </div>
      {/* new ui notification */}
      {showNotification && (
        <Notification
          type="success"
          message="Congratulations on your successful minting"
          header="Mint Successful"
          isVisible={true}
          action={() => {
            setShowNotification(false);
            history.push(`/myNfts`);
          }}
        />
      )}
    </div>
  );
}

export default BatchNFT;
