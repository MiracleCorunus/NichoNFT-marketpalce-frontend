/* eslint-disable react-hooks/exhaustive-deps */
import {
  Col,
  Row,
  Typography,
  message,
  Carousel,
  Image,
  Button,
  Tooltip,
} from "antd";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import useGetBNBPrice, {
  getFilteredPrice,
  convertPrice,
} from "hooks/useGetCoinPrice";
import { useTranslation } from "react-i18next"
import { HeartOutlined, EditOutlined } from "@ant-design/icons";
import ProductCard from "components/ProductCard";
import { getCollectionsDetail, getCollectionsItemsApi } from "api/collections";
import { Helmet } from 'react-helmet';

import Back from "assets/images/new/createNFT/back.png";
import BgImg from "assets/images/new/collectionView/bg.png";
import PhotoImg from "assets/images/new/collectionView/photos.png";
import SoldImg1 from "assets/images/new/collectionView/img_sold1.png";
import SoldImg2 from "assets/images/new/collectionView/img_sold2.png";
import AuthImg from "assets/images/new/collectionView/auth.png";
import methodImg1 from "assets/images/new/grid_method.png";
import methodImg2 from "assets/images/new/grid_method2.png";
import methodActiveImg1 from "assets/images/new/grid_method_icon1.png";
import methodActiveImg2 from "assets/images/new/grid_method_icon2.png";
import { LinkOutlined, DeleteOutlined } from "@ant-design/icons";
import Notification from "components/common/Notification";
import InfiniteScroll from "react-infinite-scroll-component";

import "./CollectionView.scss";
import ReportCollection from "components/Admin/ReportCollection";

const { Title, Paragraph } = Typography;
const PageSize = 48;
const SmallPageSize = 96;

function CollectionView() {
  const { user, Moralis, isInitialized } = useMoralis();
  const { t } = useTranslation();
  let history = useHistory();

  const [items, setItems] = useState();
  const { search } = useLocation();
  const [name, setName] = useState("");
  const [logoImageUrl, setlogoImageUrl] = useState(null);
  const [username, setUsername] = useState("");
  const [externalLink, setExternalLink] = useState(null);
  const [royaltyFee, setRoyaltyFee] = useState(null);
  const [BannerImageUrl, setBannerImageUrl] = useState(null);
  const [cId, setCId] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [favorite, setFavorite] = useState(0);
  const [claimFavorite, setClaimFavorite] = useState(false);
  const [floorPrice, setFloorPrice] = useState(0);
  const [tradeVolume, setTradeVolume] = useState(0);
  const bnbPrice = useGetBNBPrice(1);
  const [showNotification, setShowNotification] = useState(false);
  const [cardColumn, setCardColumn] = useState([6, 6, 8, 12, 12, 24]);
  const [smallView, setSmallView] = useState(false);
  const [pageInfo, setPageInfo] = useState({ pageNo: 1, pageSize: PageSize });
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);


  const showError = (msg) => {
    message.error(msg);
  };

  // check if the link has valid http format
  const checkExternalLink = (link) => {
    if (link) {
      if (link.includes("https://") || link.includes("http://")) {
        return link;
      } else {
        return "https://" + link;
      }
    }
  };
  // console.log(externalLink);

  const openLink = (link) => {
    if (link !== null && link !== undefined && link !== "") {
      window.open(checkExternalLink(link));
    } else {
      showError(t("thisCollectionError"));
    }
  };

  const getCollection = async () => {
    const collectionId = new URLSearchParams(search).get("collectionId");
    try {
      const params = {
        id: collectionId,
      };
      // get all the info of a collection and display UI
      const collection = await getCollectionsDetail(params);
      if (!collection) return;
      // console.log("collection is ", collection);
      setExternalLink(collection.externalLink);
      setRoyaltyFee(collection.royaltyFee);
      setlogoImageUrl(collection.logoImage);
      setUsername(collection.username);
      setBannerImageUrl(collection.bannerImage);
      setName(collection.collectionTitle);
      // setDescription(collection.collectionDescription);
      setCId(collectionId);
      setUserAddress(collection.ethAddress);
      setFavorite(collection.favorite);
      setFloorPrice(
        convertPrice(
          Moralis.Units.FromWei(collection.floorPrice?.toString()),
          2
        )
      );
      setTradeVolume(
        convertPrice(
          Moralis.Units.FromWei(collection.tradeVolume?.toString()),
          2
        )
      );

      // check if the user has liked this collection or not
      const queryFavorite = new Moralis.Query("FavoriteCollection");
      queryFavorite.equalTo("collection_id", collectionId);
      queryFavorite.equalTo("from", user?.get("ethAddress"));
      const result = await queryFavorite.first();
      if (result) {
        setClaimFavorite(true);
      } else {
        setClaimFavorite(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCollectionItems = async (pageNo, smallView = false) => {
    try {
      pageNo = pageNo || pageInfo.pageNo;
      const collectionId = new URLSearchParams(search).get("collectionId");
      const params = {
        pageNo: pageNo || pageInfo.pageNo,
        pageSize: smallView ? SmallPageSize : PageSize,
        collectionId,
      };
      const { records, total } = await getCollectionsItemsApi(params);
      if (records) {
        let result = pageNo === 1 ? records : items.concat(records);
        setItems(result);
        setTotal(total);
        result.length < total ? setHasMore(true) : setHasMore(false);
      }
    } catch (err) {
      setHasMore(false);
      console.log(err);
    }
  };

  // // 分页
  // const onPageChange = async (pageNo, pageSize) => {
  //   setPageInfo((prevState) => {
  //     return {
  //       ...prevState,
  //       pageNo,
  //       pageSize,
  //     };
  //   });
  // };

  const requestList = () => {
    if (items?.length < total) {
      setPageInfo((prevState) => {
        return {
          ...prevState,
          pageNo: pageInfo.pageNo + 1,
        };
      });
      getCollectionItems(pageInfo.pageNo + 1, smallView);
    } else {
      setHasMore(false);
    }
  };

  // 第一页
  const resetPageList = (smallView) => {
    setPageInfo((prevState) => {
      return {
        ...prevState,
        pageNo: 1,
      };
    });
    getCollectionItems(1, smallView);
  };

  const changeCardColumn = (columnArr, smallView) => {
    setCardColumn(columnArr);
    setSmallView(smallView);
    setHasMore(true);
    if (smallView) {
      setPageInfo(() => {
        return {
          pageNo: 1,
          pageSize: SmallPageSize,
        };
      });
    } else {
      setPageInfo(() => {
        return {
          pageNo: 1,
          pageSize: PageSize,
        };
      });
    }
    resetPageList(smallView);
  };

  useEffect(() => {
    getCollection();
    getCollectionItems();
  }, [user,isInitialized]);

  // useEffect(() => {
  //   getCollectionItems();
  // }, [pageInfo]);

  const onClaim = async () => {
    try {
      // some error checking
      if (!user) return;
      if (userAddress === user.get("ethAddress")) {
        showError(t("actionCollectionError"));
        return;
      }
      const collectionId = new URLSearchParams(search).get("collectionId");
      const params = {
        cId: collectionId,
      };

      const response = await Moralis.Cloud.run("GiveHeartOnCollection", params);
      if (response) {
        setClaimFavorite(!claimFavorite);
        getCollection();
      } else {
        showError(t("cloudfunctionError"));
      }
    } catch (error) {
      console.log(error);
      showError(t("somethingWentWrong"));
    }
  };

  const deleteCollection = async () => {
    try {
      if (window.confirm(t("sureDelete")) === false) return;

      const collectionId = new URLSearchParams(search).get("collectionId");
      if (total && total > 0) {
        showError(t("canNotDeleteCollection"));
        return;
      }

      const deployedCollectionQuery = new Moralis.Query("DeployedCollections");
      deployedCollectionQuery.equalTo("objectId", collectionId);
      const deployedCollectionObject = await deployedCollectionQuery.first();
      if (deployedCollectionObject) {
        showError(t("collectionOwnedCollection"));
        return;
      }

      const collectionQuery = new Moralis.Query("Collections");
      collectionQuery.equalTo("objectId", collectionId);
      const collectionObject = await collectionQuery.first();
      if (collectionObject) {
        await collectionObject.destroy();
        setShowNotification(true);
      } else {
        showError(t("deleteFailed"));
      }
    } catch (err) {
      console.log(err);
      showError(t("deleteFailed"));
    }
  };

  return (
    <div className="view-collection-new page-content">
      <Helmet>
        <title>Nicho AI NFT | Collections</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className="com-sub-title">
        <div
          style={{ paddingRight: "20px" }}
          onClick={() => window.history.back(-1)}
        >
          <Image preview={false} src={Back} />
        </div>
        <span>{t("details")}</span>
      </div>

      <Carousel autoplay>
        <div>
          {BannerImageUrl && (
            <Image
              rootClassName="banner-image"
              preview={false}
              src={BannerImageUrl}
              width="100%"
              height={327}
            />
          )}
        </div>
      </Carousel>
      <ReportCollection />
      
      <div className="info-wrap view-body">
        <div
          className="info-content"
          style={{ backgroundImage: `url(${BgImg})` }}
        >
          {/* Edit Collection */}
          {user && userAddress === user.get("ethAddress") && (
            <Link
              to={`/editCollection?collectionId=${cId}`}
              className="edit-collection"
            >
              <Tooltip placement="top" title={"Edit"}>
                <EditOutlined />
              </Tooltip>
            </Link>
          )}

          {/* Delete Collection */}
          {user && userAddress === user.get("ethAddress") && (
            <span
              className="delete-collection"
              onClick={() => deleteCollection()}
            >
              <Tooltip placement="top" title={"Delete"}>
                <DeleteOutlined />
              </Tooltip>
            </span>
          )}

          <div className="left-cont">
            <div>
              <img
                src={logoImageUrl}
                className="logo-img-url"
                width={84}
                height={84}
                alt="Nicho AI NFT"
              />
            </div>
            <div className="user-wrap">
              <div className="user-wrap-header">
                <Title level={3} className="title" ellipsis>
                  {name}
                </Title>
                <div className="user-wrap-header-heart">
                  {claimFavorite ? (
                    <HeartOutlined
                      style={{
                        fontSize: "24px",
                        color: "#eb2f96",
                        cursor: "pointer",
                      }}
                      onClick={onClaim}
                    />
                  ) : (
                    <HeartOutlined
                      style={{
                        fontSize: "24px",
                        color: "#aaa",
                        cursor: "pointer",
                      }}
                      onClick={onClaim}
                    />
                  )}

                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#aaa",
                      marginLeft: "5px",
                    }}
                  >
                    {favorite}
                  </span>
                </div>
              </div>
              {/* <Title level={3} className="title" ellipsis>
                {name}
                <span style={{ marginLeft: "15px" }}>
                  {claimFavorite ? (
                    <HeartOutlined
                      style={{
                        fontSize: "24px",
                        color: "#eb2f96",
                        cursor: "pointer",
                      }}
                      onClick={onClaim}
                    />
                  ) : (
                    <HeartOutlined
                      style={{
                        fontSize: "24px",
                        color: "#aaa",
                        cursor: "pointer",
                      }}
                      onClick={onClaim}
                    />
                  )}

                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#aaa",
                      marginLeft: "5px",
                    }}
                  >
                    {favorite}
                  </span>
                </span>
              </Title> */}

              <Paragraph className="creater" ellipsis>
                {t("createdBy")}：
                <Link to={`/profile?address=${userAddress}`}>
                  <Paragraph ellipsis>{username} </Paragraph>
                </Link>
                <Image preview={false} src={AuthImg} width={14} />
              </Paragraph>

              <div className="action-group">
                <Paragraph className="link">
                  {t("extraLink")}：
                  <Tooltip placement="top" title={"External Link"}>
                    <LinkOutlined
                      onClick={() => {
                        openLink(externalLink);
                      }}
                    />
                  </Tooltip>
                </Paragraph>

                <Paragraph className="fee">
                  {t("creatorFee")}：
                  <span>{royaltyFee}%</span>
                </Paragraph>
              </div>
            </div>
          </div>

          <div className="right-cont">
            <div className="status-group">
              <div className="status-item">
                <Image preview={false} src={PhotoImg} width={40} height={40} />
                <div>
                  <Title level={3} strong>
                    {total ? total : 0}
                  </Title>
                  <Paragraph className="dark-gray-txt fs-14">
                    {t("totalItems")}
                  </Paragraph>
                </div>
              </div>
              <div className="status-item status-ite2">
                <Image preview={false} src={SoldImg1} width={40} height={40} />
                <div>
                  <Title level={3} strong style={{ color: "#53F2D4" }}>
                    {floorPrice} BNB
                  </Title>
                  <Paragraph>
                    <span className="dark-gray-txt fs-14">Floor price：</span>
                    {getFilteredPrice(bnbPrice * floorPrice)}
                  </Paragraph>
                </div>
              </div>
              <div className="status-item status-item3">
                <Image preview={false} src={SoldImg2} width={40} height={40} />
                <div>
                  <Title level={3} strong style={{ color: "#EA7FBE" }}>
                    {tradeVolume} BNB
                  </Title>
                  <Paragraph>
                    <span className="dark-gray-txt fs-14">Volume：</span>
                    {getFilteredPrice(bnbPrice * tradeVolume)}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* list */}
      <Row
        justify="center"
        align="middle"
        style={{ marginTop: "100px", marginBottom: "35px" }}
      >
        <Button
          className="grid-method"
          onClick={() => changeCardColumn([6, 6, 8, 12, 12, 24], false)}
        >
          <Image
            preview={false}
            width={24}
            height={24}
            src={cardColumn[1] === 6 ? methodImg1 : methodActiveImg1}
          />
        </Button>
        <Button
          className="grid-method"
          onClick={() => changeCardColumn([3, 3, 6, 8, 12, 12], true)}
        >
          <Image
            preview={false}
            width={24}
            height={24}
            src={cardColumn[1] === 3 ? methodImg2 : methodActiveImg2}
          />
        </Button>
      </Row>

      {/* <Spin spinning={listLoading}> */}
      <InfiniteScroll
        dataLength={items?.length || 0}
        next={requestList}
        hasMore={hasMore}
        endMessage={
          <p className="scroll-seen-all">
            {items?.length > 0 && "Yay! You have seen it all"}
          </p>
        }
        loader={<h4 className="scroll-loading">Loading...</h4>}
      >
        <div className="view-body">
          <Row gutter={[30, 30]} className="collection-list">
            {items &&
              items.map((product, index) => (
                <Col
                  xxl={cardColumn[0]}
                  xl={cardColumn[1]}
                  lg={cardColumn[2]}
                  md={cardColumn[3]}
                  sm={cardColumn[4]}
                  xs={cardColumn[5]}
                  key={index}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
          </Row>
        </div>
      </InfiniteScroll>

        {/* <Row style={{ padding: "28px 0" }}>
          <Pagination
            className="com-pagination"
            showQuickJumper
            current={pageInfo.pageNo}
            pageSize={pageInfo.pageSize}
            pageSizeOptions={[16, 32, 50, 100]}
            total={total}
            showTotal={(total) => `Total ${total} items`}
            onChange={onPageChange}
          />
        </Row> */}
      {/* </Spin> */}
      {showNotification && (
        <Notification
          type="success"
          message="Collection has been successfully deleted"
          header="Collection Deleted"
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

export default CollectionView;
