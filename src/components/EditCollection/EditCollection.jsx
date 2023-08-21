import { Typography, Button, Input, Upload, Modal, message } from 'antd';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from "react-router-dom";
import { CollectionTB } from "helpers/db";
import { ReactComponent as UploaderIcon } from 'assets/images/uploader.svg';
import { useMoralis } from 'react-moralis';
import {  useTranslation } from "react-i18next"
import SubTitle from "components/common/SubTitle";
// import { categories } from "components/CreateOwnCollection/constants/categories";
import './EditCollection.scss';
import { getCollectionsDetail } from 'api/collections';
import topImg from "assets/images/new/CreateOwnCollection/top_img.png";


const { Title, Paragraph } = Typography;
function EditCollection() {
  const { user, Moralis, isInitialized } = useMoralis();  
  const { t } = useTranslation()
  const { search } = useLocation();
  let history = useHistory();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [featureFile, setFeatureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoImageUrl, setlogoImageUrl] = useState(null);
  const [featureImageUrl, setfeatureImageUrl] = useState(null);
  const [BannerImageUrl, setBannerImageUrl] = useState(null);
  const [externalLink, setExternalLink] = useState("");
  // const [category, setCategory] = useState(categories[0]);
  const [waiting, setWaiting] = useState(false);


  useEffect( () => {
    const getCollection = async () => {
      if (!isInitialized || !user) return;
      try {
        const collectionId = new URLSearchParams(search).get('collectionId')
        const params = {
          id: collectionId,
        }
        // get all the info of a collection and display UI
        const collection = await getCollectionsDetail(params);
        if (!collection) return;

        if (collection.ethAddress !== user.get("ethAddress")) {
          history.goBack();
          return;
        }
        console.log(collection)
        // setExternalLink(collection.externalLink);
        // setRoyaltyFee(collection.royaltyFee);
        setlogoImageUrl(collection.logoImage);
        setBannerImageUrl(collection.bannerImage);
        setfeatureImageUrl(collection.featureImage);
        setTitle(collection.collectionTitle);
        setDescription(collection.collectionDescription);
        setExternalLink(collection.externalLink);
        // setCategory(collection.category);
      } catch (err) {
        console.log(err)
      }
    }

    getCollection();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized]);

  const beforeUpload = (file, type) => {
    if (!file) return;
    if (type === 'logo') setLogoFile(file);
    if (type === 'feature') setFeatureFile(file);
    if (type === 'banner') setBannerFile(file);
    
    getBase64(file).then(
      data => {
        if (!data) return;
        if (type === 'logo') setlogoImageUrl(data);
        if (type === 'feature') setfeatureImageUrl(data);
        if (type === 'banner') setBannerImageUrl(data);
      }
    );
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  // to prevent default action of antd Upload component
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const showError = (msg) => {
    message.error(msg)
  }

  const showSuccess = (msg) => {
    const secondsToGo = 3;
    const modal = Modal.success({
      title: `${t("success")}!`,
      content: msg
    });

    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  const updateCollection = async () => {
    if (!user) return false;
    setWaiting(true);
    try {
      const collectionId = new URLSearchParams(search).get('collectionId')

      const collectionQuery = new Moralis.Query("Collections");
      collectionQuery.equalTo("objectId", collectionId);
      const collectionObject = await collectionQuery.first();
      if (collectionObject) {
        let LogoIpfsPath = ""
        let FeatureIpfsPath =""
        let BannerIpfsPath = ""

        if (logoFile) {
          const LogoIpfs = new Moralis.File("Logo", logoFile);
          await LogoIpfs.saveIPFS();
          LogoIpfsPath = LogoIpfs.ipfs();
          collectionObject.set(CollectionTB.logo_image, LogoIpfs.url());
          collectionObject.set(CollectionTB.logo_ipfs, LogoIpfsPath);
        }
        if (featureFile) {
          const FeatureIpfs = new Moralis.File("Feature", featureFile);
          await FeatureIpfs.saveIPFS();
          FeatureIpfsPath = FeatureIpfs.ipfs();
          collectionObject.set(CollectionTB.feature_image, FeatureIpfs.url());
          collectionObject.set(CollectionTB.feature_ipfs, FeatureIpfsPath);
        }

        if (bannerFile) {
          const BannerIpfs = new Moralis.File("Banner", bannerFile);  
          await BannerIpfs.saveIPFS();        
          BannerIpfsPath = BannerIpfs.ipfs();
          collectionObject.set(CollectionTB.banner_image, BannerIpfs.url());
          collectionObject.set(CollectionTB.banner_ipfs, BannerIpfsPath);
        }
        
        collectionObject.set(CollectionTB.collection_title, title);
        collectionObject.set(CollectionTB.collection_description, description);
        // extra external link field
        collectionObject.set("external_link", externalLink);
        // collectionObject.set("category", category);
        await collectionObject.save();

        showSuccess(`${t("yourCollection")}(${title}) ${t("successfullyUpdated")}`);
      } else {
        showError(t("deleteFailed"));
      }
    } catch (err) {
      showError(t("somethingWentWrong"));
    } finally {
      setWaiting(false)
    }
  }

  return(
    <div id="create-collection">
      <Helmet>
        <title>Nicho AI NFT | Edit collection</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div id="create-collection-header">
        <SubTitle title={"Edit Collection"} />
      </div>
      <div className="create-collect-content">
        <div className="theme-block">
          <div
            className="theme-block-img"
            style={{ backgroundImage: `url(${topImg})` }}
          />
        </div>

        <div className="form-group">
          <div className="form-item">
            <Title level={4} type="secondary">{t("logoImage")}</Title>
            <Paragraph type="secondary">{t("recommendedImage")}</Paragraph>
            <div className="file-uploader" id="logo-uploader">
              <Upload
                name="avatar"
                listType="picture-card"
                className="logo-uploader"
                showUploadList={false}
                beforeUpload={file => beforeUpload(file, 'logo')}
                action=""
                customRequest={dummyRequest}
              >
                { logoImageUrl ? <img src={logoImageUrl} alt="Nicho AI NFT" /> : <UploaderIcon /> }
              </Upload>
            </div>
          </div>
          <div className="form-item">
            <Title level={4} type="secondary">Featured image</Title>
            <Paragraph type="secondary">{t("featuringImageRecommended")}</Paragraph>
            <div className="file-uploader" id="featured-uploader">
              <Upload
                name="avatar"
                listType="picture-card"
                className="featured-uploader"
                showUploadList={false}
                beforeUpload={file => beforeUpload(file, 'feature')}
                action=""
                customRequest={dummyRequest}
              >
                { featureImageUrl ? <img src={featureImageUrl} id="logo-preview" alt="Nicho AI NFT" /> : <UploaderIcon /> }
              </Upload>
            </div>
          </div>
          <div className="form-item">
            <Title level={4} type="secondary">{t("bannerImage")}</Title>
            <Paragraph type="secondary">{t("topCollectionPage")}</Paragraph>
            <div className="file-uploader" id="banner-uploader">
              <Upload
                name="avatar"
                listType="picture-card"
                className="banner-uploader"
                showUploadList={false}
                beforeUpload={file => beforeUpload(file, 'banner')}
                action=""
                customRequest={dummyRequest}
              >
                { BannerImageUrl ? <img src={BannerImageUrl} alt="Nicho AI NFT" /> : <UploaderIcon /> }
              </Upload>
            </div>
          </div>
          <div className="form-item">
            <Title level={4} type="secondary">{t("name")}</Title>
            <Input placeholder={`${t("eg")} #1 Crypto Funk`} value={ title } onChange={(e) => setTitle(e.target.value) }/>
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
          {/* <div className="form-item">
            <Title level={4} className="white" type="secondary">
              Categories
            </Title>
            <Select
              style={{ width: "100%" }}
              size={"large"}
              placeholder="Select a Category"
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
          </div> */}
          <div className="form-item">
            <Title level={4} type="secondary">{t("description")}</Title>
            <Input.TextArea rows={4} placeholder=""  value={ description } onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <div className="form-action">
            <Button type="primary" onClick={updateCollection} loading={ waiting }>{t("update")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCollection;