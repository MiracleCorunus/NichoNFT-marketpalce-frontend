/* eslint-disable no-throw-literal */
/* eslint-disable no-unused-vars */
import {
  Typography,
  Button,
  Input,
  Upload,
  Modal,
  message,
  Select,
  // Tooltip,
  Badge,
} from "antd";
import { Helmet } from "react-helmet";
import { useState } from "react";
import SubTitle from "components/common/SubTitle";
import UploadIconComp from "components/common/UploadIconComp";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./CreateOwnCollection.scss";
import topImg from "assets/images/new/CreateOwnCollection/top_img.png";
import resizer from "react-image-file-resizer";
import {
  collectionFactoryAddress,
  collectionFactoryAbi,
} from "contracts/constants";
import { CollectionTB } from "helpers/db";
// import { categories } from "./constants/categories";
// import { InfoCircleOutlined } from "@ant-design/icons";
import Notification from "components/common/Notification";

const { Title, Paragraph } = Typography;
const _URL = window.URL || window.webkitURL;
const DEPLOY_FEE = "0.05";

function CreateOwnCollection() {
  const { user, Moralis, web3 } = useMoralis();
  const { t } = useTranslation();
  const categories = [
    "AI-NFT-DALLE",
    t("art"),
    t("collectables"),
    t("domaninNames"),
    t("music"),
    t("photography"),
    t("sports"),
    t("tradingCards"),
    t("utility"),
    t("virtualWorlds"),
  ];
  let history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [royaltyFee, setRoyaltyFee] = useState();
  const [category, setCategory] = useState(categories[0]);
  const [logoFile, setLogoFile] = useState(null);
  const [featureFile, setFeatureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoImageUrl, setlogoImageUrl] = useState(null);
  const [featureImageUrl, setfeatureImageUrl] = useState(null);
  const [BannerImageUrl, setBannerImageUrl] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  let isValidLogoFile = false;
  let isValidFeatureFile = false;
  let isValidBannerFile = false;
  const { fetch: deployOwnCollection } = useWeb3ExecuteFunction();

  const beforeUpload = (file, type) => {
    if (!file) return;
    if (type === "logo") setLogoFile(file);
    if (type === "feature") setFeatureFile(file);
    if (type === "banner") setBannerFile(file);
    let tempFile, img;
    if ((tempFile = file)) {
      img = new Image();

      img.onload = function () {
        // alert(this.width + " " + this.height);
        switch (type) {
          case "logo":
            if (this.width === 350 && this.height === 350)
              isValidLogoFile = true;
            break;
          case "feature":
            if (this.width === 600 && this.height === 400)
              isValidFeatureFile = true;
            break;
          case "banner":
            if (this.width === 1400 && this.height === 400)
              isValidBannerFile = true;
            break;
          default:
            break;
        }
      };
      img.onerror = function () {
        console.log("not a valid file: " + file.type);
      };
      img.src = _URL.createObjectURL(file);
    }
    getBase64(file).then((data) => {
      if (!data) return;
      if (type === "logo") setlogoImageUrl(data);
      if (type === "feature") setfeatureImageUrl(data);
      if (type === "banner") setBannerImageUrl(data);
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

  const beforeCreatCollection = async () => {
    if (!user) return false;
    if (!logoFile) {
      showError(t("insertLogoFile"));
      return false;
    }
    if (!featureFile) {
      showError(t("insertFeatureFile"));
      return false;
    }
    if (!bannerFile) {
      showError(t("insertBannerFile"));
      return false;
    }
    if (!name || name === "") {
      showError(t("defineName"));
      return false;
    }
    if (isNaN(royaltyFee) || royaltyFee === undefined) {
      showError(t("inputRoyaltyFee"));
      return false;
    }
    if (royaltyFee < 0 || royaltyFee > 15 || royaltyFee === "") {
      showError(t("maximumRoyalty"));
      return false;
    }
    if (!description || description === "") {
      showError(t("defineDescription"));
      return false;
    }

    const isContract =
      (await web3.getCode(collectionFactoryAddress)).length > 5;
    if (!isContract) {
      showError(t("detectedDifferentNetwork"));
      return;
    }

    // if (!isValidLogoFile) { showError("The logo image size is not valid as recommended size"); return false; }
    // if (!isValidFeatureFile) { showError("The feature image size is not valid as recommended size"); return false; }
    // if (!isValidBannerFile) { showError("The banner image size is not valid as recommended size"); return false; }

    // reset validate variables
    // isValidLogoFile = false;
    // isValidFeatureFile = false;
    // isValidBannerFile = false;

    try {
      const CollectTable = Moralis.Object.extend("Collections");
      const query = new Moralis.Query(CollectTable);
      query.equalTo(CollectionTB.creator, user.get("ethAddress"));
      query.equalTo(CollectionTB.collection_title, name);
      const result = await query.first();
      if (result) {
        showError(t("alreadyCreatedThisCollection"));
        return false;
      }
    } catch (err) {
      showError(t("somethingWentWrong"));
      return false;
    }
    return true;
  };

  const getIpfsURL = (moralisURL) => {
    return moralisURL;
    // const urlObject = new URL(moralisURL);
    // const shortPath = urlObject.pathname;
    // const newPath = "https://ipfs.io" + shortPath;
    // return newPath;
  };

  const navigateTo = (targetPath) => {
    history.push(`/${targetPath}`);
  };

  const resizeImageFile = (file, width, height) =>
    file
      ? new Promise((resolve) => {
          resizer.imageFileResizer(
            file,
            width,
            height,
            "JPEG",
            100,
            0,
            (uri) => {
              resolve(uri);
            },
            "file"
          );
        })
      : null;

  const createCollection = async () => {
    setWaiting(true);
    try {
      const isValid = await beforeCreatCollection();
      if (!isValid) {
        setWaiting(false);
        return;
      }

      const resizedLogoFile = await resizeImageFile(logoFile, 350, 350);
      const resizedFeatureFile = await resizeImageFile(featureFile, 600, 400);
      const resizedBannerFile = await resizeImageFile(bannerFile, 1400, 400);

      if (!resizedLogoFile || !resizedFeatureFile || !resizedBannerFile) {
        throw "resize image failed";
      }

      const LogoIpfs = new Moralis.File("Logo", resizedLogoFile);
      const FeatureIpfs = new Moralis.File("Feature", resizedFeatureFile);
      const BannerIpfs = new Moralis.File("Banner", resizedBannerFile);

      await LogoIpfs.saveIPFS();
      await FeatureIpfs.saveIPFS();
      await BannerIpfs.saveIPFS();

      const LogoIpfsPath = LogoIpfs.ipfs();
      const FeatureIpfsPath = FeatureIpfs.ipfs();
      const BannerIpfsPath = BannerIpfs.ipfs();

      // Upload collection data
      const Collection = Moralis.Object.extend("Collections");
      const collection = new Collection();
      collection.set(CollectionTB.creator, user.get("ethAddress"));
      collection.set(CollectionTB.creator_user, user);
      collection.set(CollectionTB.collection_title, name);
      collection.set(CollectionTB.collection_description, description);
      collection.set(CollectionTB.logo_image, LogoIpfs.url());
      collection.set(CollectionTB.feature_image, FeatureIpfs.url());
      collection.set(CollectionTB.banner_image, BannerIpfs.url());
      collection.set(CollectionTB.logo_ipfs, getIpfsURL(LogoIpfsPath));
      collection.set(CollectionTB.feature_ipfs, getIpfsURL(FeatureIpfsPath));
      collection.set(CollectionTB.banner_ipfs, getIpfsURL(BannerIpfsPath));
      // set default values.
      collection.set(CollectionTB.followers_count, 0);
      collection.set(CollectionTB.floor_price, "0");
      collection.set(CollectionTB.trade_volume, "0");
      collection.set(CollectionTB.prev_trade_volume, "0");
      collection.set(CollectionTB.daily_trade_volume, "0");
      // extra royalty fee and external link
      collection.set("royalty_fee", royaltyFee);
      collection.set("external_link", externalLink);
      collection.set("category", category);

      const newCollection = await collection.save();

      const royalParam = parseInt((parseFloat(royaltyFee) * 10).toString());
      // deploy smart contract
      const deployOwnCollectionTx = await deployOwnCollection({
        params: {
          abi: collectionFactoryAbi,
          contractAddress: collectionFactoryAddress,
          functionName: "deploy",
          msgValue: Moralis.Units.ETH(DEPLOY_FEE),
          params: {
            _name: name,
            _symbol: name.toUpperCase(),
            _collection_id: newCollection.id,
            _royaltyFee: royalParam,
          },
        },
        onError: (err) => {
          (async () => {
            if (newCollection) {
              await newCollection.destroy();
            }
          })();

          if (err.data?.code === -32000) {
            throw t("insufficientFund");
          } else {
            throw t("errorDeployContract");
          }
        },
      });

      // check if the contract has been deployed successfully
      if (deployOwnCollectionTx) {
        await deployOwnCollectionTx.wait(1);
        setShowNotification(true);
        // showSuccess(`Your Collection(${name}) has been successfully created`);
        // navigateTo("myCollections");
      } else {
        if (newCollection) {
          await newCollection.destroy();
        }
        throw t("errorDeployContract");
      }
    } catch (err) {
      console.log(err);
      showError(err);
    }
    setWaiting(false);
  };

  return (
    <div id="create-collection-new">
      <Helmet>
        <title>Nicho AI NFT | Create own collection</title>
        <meta
          name="description"
          content="AI-NFT generator powered by artificial intelligence."
        />
        <meta
          name="keywords"
          content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator"
        />
      </Helmet>
      <div id="create-collection-header">
        {/* <Title level={2} strong>Create Collection</Title> */}
        <SubTitle title={t("createOwnCollection")} />
      </div>
      <div className="create-collect-content">
        <div className="theme-block">
          <div className="theme-block-button-group">
            <Button
              className="theme-block-button theme-block-button-focus"
              disabled
            >
              {t("ownCollection")}
            </Button>
            <Badge
              count={<div className="theme-block-button-badge">Reward</div>}
            >
              <Button
                className="theme-block-button"
                onClick={() => history.push("/createCollection")}
              >
                {t("freeCollection")}
              </Button>
            </Badge>
          </div>
          <div
            className="theme-block-img"
            style={{ backgroundImage: `url(${topImg})` }}
          ></div>
          {/* <div className="top-title">
            <Link className="to-free-collection" to="/createCollection">
              Free Collection
              <Tooltip title="Free Collection will depoly your NFTs on Nicho’s market contract, which not able set up royalties for collection">
                <InfoCircleOutlined />
              </Tooltip>
            </Link>
          </div> */}
          {/* 找了半天Image组件好像和 new Image方法影响.... */}
          {/* <Image rootClassName='theme-block-img' preview={false} width={332} height={73} src={topImg} /> */}
        </div>
        <div>
          <Title
            level={5}
            style={{ color: "#999", textAlign: "center", fontSize: "10px" }}
            strong
          >
            {t("click")}{" "}
            <a
              href="https://medium.com/@NichoNFT/how-the-own-collection-feature-works-on-nicho-c84f742d488c"
              target={"_blank"}
              className="theme-color-txt"
              rel="noreferrer"
            >
              {t("here")}
            </a>{" "}
            {t("learnMoreCollection")}
          </Title>
        </div>

        <div className="form-group">
          <div className="form-item">
            <Title level={4} type="secondary">
              {t("logoImage")}
            </Title>
            <Paragraph type="secondary">{t("recommendedImage")}</Paragraph>
            <div className="file-uploader" id="logo-uploader">
              <Upload
                name="avatar"
                listType="picture-card"
                className="logo-uploader"
                showUploadList={false}
                beforeUpload={(file) => beforeUpload(file, "logo")}
                action=""
                customRequest={dummyRequest}
              >
                {logoImageUrl ? (
                  <img src={logoImageUrl} alt="Nicho AI NFT" />
                ) : (
                  <UploadIconComp />
                )}
              </Upload>
            </div>
          </div>
          <div className="form-item">
            <Title level={4} type="secondary">
              {t("featuredImage")}
            </Title>
            <Paragraph type="secondary">
              {t("featuringImageRecommended")}
            </Paragraph>
            <div className="file-uploader" id="featured-uploader">
              <Upload
                name="avatar"
                listType="picture-card"
                className="featured-uploader"
                showUploadList={false}
                beforeUpload={(file) => beforeUpload(file, "feature")}
                action=""
                customRequest={dummyRequest}
              >
                {featureImageUrl ? (
                  <img
                    src={featureImageUrl}
                    id="logo-preview"
                    alt="Nicho AI NFT"
                  />
                ) : (
                  <UploadIconComp />
                )}
              </Upload>
            </div>
          </div>
          <div className="form-item">
            <Title level={4} type="secondary">
              {t("bannerImage")}
            </Title>
            <Paragraph type="secondary">{t("topCollectionPage")}</Paragraph>
            <div className="file-uploader" id="banner-uploader">
              <Upload
                name="avatar"
                listType="picture-card"
                className="banner-uploader"
                showUploadList={false}
                beforeUpload={(file) => beforeUpload(file, "banner")}
                action=""
                customRequest={dummyRequest}
              >
                {BannerImageUrl ? (
                  <img src={BannerImageUrl} alt="Nicho AI NFT" />
                ) : (
                  <UploadIconComp />
                )}
              </Upload>
            </div>
          </div>
          <div className="form-item">
            <Title level={4} className="white" type="secondary">
              {t("name")}
            </Title>
            <Input
              placeholder={`${t("eg")} #1 Crypto Funk`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-item">
            <Title level={4} className="white" type="secondary">
              {t("externalLink")}
            </Title>
            <Input
              placeholder={`${t("eg")} "Webpage, twitter, facebook and etc."`}
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
            />
          </div>
          <div className="form-item">
            <Title level={4} className="white" type="secondary">
              {t("royaltyFee")} (%)
            </Title>
            <Input
              // type="number"
              placeholder={t("maximum15")}
              value={royaltyFee}
              onChange={(e) => setRoyaltyFee(e.target.value)}
              // onWheel={(e) => e.currentTarget.blur()}
              // min={0}
              // max={15}
            />
          </div>
          <div className="form-item">
            <Title level={4} className="white" type="secondary">
              {t("categories")}
            </Title>
            <Select
              style={{ width: "100%" }}
              size={"large"}
              placeholder={t("selectCategory")}
              value={category}
              onChange={(val) => {
                setCategory(val);
              }}
            >
              {categories.map((cat, index) => (
                <Select.Option key={index} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="form-item">
            <Title level={4} className="white" type="secondary">
              {t("description")}
            </Title>
            <Input.TextArea
              rows={4}
              placeholder=""
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-action">
            <Button onClick={createCollection} loading={waiting}>
              {t("create")}
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
          *{t("nichoCharging")}
        </Title>
      </div>
      {showNotification && (
        <Notification
          type="success"
          message="Collection has been successfully created"
          header="Collection Created"
          isVisible={true}
          action={() => {
            setShowNotification(false);
            history.push(`/myCollections`);
          }}
        />
      )}
    </div>
  );
}

export default CreateOwnCollection;
