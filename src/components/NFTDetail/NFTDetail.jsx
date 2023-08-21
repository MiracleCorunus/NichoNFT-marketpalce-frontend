import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
  Typography,
  // Button,
  Row,
  Col,
  Image,
  // Tabs,
  // Modal,
  // Input,
  message,
  // Ske,
  // Divider,
} from "antd";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useTranslation } from "react-i18next";
import { HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';

import "./NFTDetail.scss";
// import Creator from "./components/Minter";
// import RelatedItem from "./components/RelatedItem";
import OfferList from "./components/OfferList";
import FixedPurchase from "./components/purchase/FixedPurchase";
import MyNFTAction from "./components/purchase/MyNFTAction";
import AuctionPurchase from "./components/purchase/AuctionPurchase";
import Sell from "./components/Sell";
import BidList from "./components/BidList";
import Back from "assets/images/new/createNFT/back.png";
import Mountain from "assets/images/new/NFTDetail/mountain.svg";
import Rainbow from "assets/images/new/NFTDetail/rainbow.svg";
// import BgIcon1 from "assets/images/new/detail_icon1.png";
// import BgIcon2 from "assets/images/new/detail_icon2.png";
import { getUserRecommendNFTsApi } from "api/nftList";
// import { getNFTDetailApi } from "api/nftList";

import ItemActivity from "./components/ItemActivity";
// import dummyData from "./dummyData.json";

import {
  auctionAddress,
  ERC721ABI,
  marketplaceAddress,
} from "contracts/constants";
import { getNFTDetailApi } from "api/getNFTDetail";
import Minter from "./components/Minter";
import Owner from "./components/Owner";
import ExternalLink from "./components/ExternalLink";
import EtherscanLink from "./components/EtherscanLink";
import { useMediaQuery } from "react-responsive";
import Description from "./components/Description";
import RelatedItem from "./components/RelatedItem";
import ReportNFT from "components/Admin/ReportNFT";

const { Title, Paragraph } = Typography;

function NFTDetail() {
  const { user, Moralis, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const { search } = useLocation();
  const [nftDetail, setNftDetail] = useState();
  // const [nftDetail, setNftDetail] = useState(dummyData);
  const [items, setItems] = useState();

  // If sell
  const [sellOption, setSellOption] = useState(false);
  const [followingStatus, setFollowingStatus] = useState(false);
  // const [favorite, setFavorite] = useState(0);
  const [refreshData, setRefreshData] = useState(false);
  // const [auctionItem, setAuctionItem] = useState();
  const contractProcessor = useWeb3ExecuteFunction();

  const showError = (msg) => {
    message.error(msg);
  };

  // const showInfo = (msg) => {
  //   message.success(msg);
  // };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Get NFT detail
    const getItem = async () => {
      if (!isInitialized) return;
      try {
        const id = new URLSearchParams(search).get("id");
        const userAddress = user ? user.get("ethAddress") : null;
        const params = {
          id,
          userAddress,
        };
        // const tokenList = await Moralis.Cloud.run("getItem", params);
        let detail = await getNFTDetailApi(params);
        // console.log("Detail: ", detail);
        if (!detail) return;

        const avatar =
          detail.creatorAvatar && detail.creatorAvatar.length > 0
            ? detail.creatorAvatar
            : "/images/avatar.png";
        const minter_avatar =
          detail.minterAvatar && detail.minterAvatar.length > 0
            ? detail.minterAvatar
            : "/images/avatar.png";
        // const itemPrice = Moralis.Units.FromWei(price, 18);
        const isAuctionList = detail.auctionPrice > 0 && detail.fixedPrice===0;
        const mainAddress = isAuctionList ? auctionAddress : marketplaceAddress;
        // console.log(mainAddress, isAuctionList);

        let isApproved1 = await checkApproved(
          detail.tokenAddress,
          detail.tokenId,
          mainAddress
        );
        let isApproved2 = await isApproveForAll(
          detail.tokenAddress,
          detail.creator,
          mainAddress
        );
        let isApproved = isApproved1 || isApproved2;
        // console.log("Is", isApproved);

        detail.isListed = detail.isListed && isApproved;
        detail.creatorAvatar = avatar;
        detail.minterAvatar = minter_avatar;

        // console.log("Detail: ", detail);
        setNftDetail(detail);

        // check if the user has liked this nft or not
        const queryFavorite = new Moralis.Query("FavoriteNFT");
        queryFavorite.equalTo("token_address", detail.tokenAddress);
        queryFavorite.equalTo("token_id", detail.tokenId.toString());
        queryFavorite.equalTo("from", user?.get("ethAddress"));
        const result = await queryFavorite.first();
        if (result) {
          setFollowingStatus(true);
        } else {
          setFollowingStatus(false);
        }

        // setFollowingStatus(detail.following);

        const recommendParams = {
          pageNo: 1,
          pageSize: 4,
          tokenId: detail.tokenId,
          collectionId: detail.collectionId
        };
        const { records } = await getUserRecommendNFTsApi(
          recommendParams
        );
        // console.log("RecommendedItem", records, total);
        if (records) {
          setItems(records);
        }

        //TODO LIST
        // Auction item check
        // const auctionParam = {
        //   tokenId: tokenId,
        //   tokenAddress: tokenAddress,
        // };
        // const auction = await Moralis.Cloud.run(
        //   "getAuctionItem",
        //   auctionParam
        // );
        // console.log("Auction:", auction, auctionParam);
        // setAuctionItem(auction);
      } catch (err) {
        console.log(err);
      }
    };
    getItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized, refreshData, search]);

  /// NFT is approved to marketplace
  const checkApproved = async (address, tokenId, mainAddress) => {
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
      if (approvedAddress.toUpperCase() === mainAddress.toUpperCase()) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  };

  /// NFT is approved to marketplace
  const isApproveForAll = async (address, creator, mainAddress) => {
    try {
      // Check if item was listed or not
      const params = {
        contractAddress: address,
        functionName: "isApprovedForAll",
        abi: ERC721ABI,
        params: {
          owner: creator,
          operator: mainAddress,
        },
      };
      // console.log(params);

      const isApproved = await contractProcessor.fetch({ params });
      if (!isApproved) return false;
      return true;
    } catch (err) {
      return false;
    }
  };

  // Give favorite
  const onClaim = async () => {
    try {
      if (!user || !nftDetail) return;
      if (nftDetail?.creator === user.get("ethAddress")) {
        showError(t("actionCollectionError"));
        return;
      }

      // update the database
      const params = {
        tokenAddress: nftDetail.tokenAddress,
        tokenId: nftDetail.tokenId.toString(),
      };

      await Moralis.Cloud.run("GiveHeartOnNFT", params);
      setFollowingStatus(!followingStatus);
      setRefreshData(!refreshData);

      // setFollowingStatus(!followingStatus);
      // setRefreshData(!refreshData);
      // const ItemsTable = Moralis.Object.extend("TokenList");
      // const itemsQuery = new Moralis.Query(ItemsTable);
      // itemsQuery.equalTo("objectId", objectId);
      // const queryResult = await itemsQuery.first();

      // if (!queryResult) return;
      // setFollowingStatus(isClaim);

      // if (isClaim) {
      //   queryResult.set("favorite", favorite + 1);
      //   setFavorite(favorite + 1);
      // } else if (favorite > 0) {
      //   queryResult.set("favorite", favorite - 1);
      //   setFavorite(favorite - 1);
      // }
      // await queryResult.save();

      // const FavoriteTable = Moralis.Object.extend("Favorite");
      // const query = new Moralis.Query(FavoriteTable);
      // query.equalTo("token_id", objectId);
      // query.equalTo("address", user.get("ethAddress"));
      // const results = await query.first();

      // if (results===null || results===undefined || results.length===0) {
      //   const favoriteObj = new FavoriteTable();
      //   favoriteObj.set("address", user.get("ethAddress"));
      //   favoriteObj.set("token_id", objectId);
      //   favoriteObj.set("claim", isClaim);
      //   await favoriteObj.save();
      // } else {
      //   results.set("claim", isClaim);
      //   await results.save();
      // }
    } catch (err) {
      console.log(err);
      showError(t("somethingWentWrong"));
    }
  };

  // onSellActionHandle
  const onSellActionHandle = () => {
    setSellOption(!sellOption);
  };
  // const isBigScreen = useMediaQuery({
  //   minWidth: 1183,
  // });
  const isSmallScreen = useMediaQuery({ maxWidth: 993 });

  // console.log(isBigScreen);
  return (
    <>
      <Helmet>
        <title>Nicho AI NFT | NFT Detail</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div
        className="nft-detail-new center-page2"
        style={{ marginTop: "100px" }}
      >
        {/* Image display next to the details of works */}
        <div
          style={{
            position: "absolute",
            top: -49,
            zIndex: 2,
            right: "245px",
            display: isSmallScreen ? "none" : "block",
          }}
        >
          <Image preview={false} src={Mountain} width={359} height={98} />
        </div>

        <div
          style={{
            position: "absolute",
            right: 10,
            top: -107,
            zIndex: 1,
            display: isSmallScreen ? "none" : "block",
          }}
        >
          <Image preview={false} src={Rainbow} width={350} height={175} />
        </div>

        {/* show image on top of the card */}
        <div className="card" style={{ paddingTop: 0 }}>
          <div
            className="com-sub-title"
            style={{
              padding: "0px",
              height: "48px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                marginRight: "20px",
                marginLeft: "10px",
                backgroundColor: "#161822",
                padding: "5px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => window.history.back(-1)}
            >
              <Image preview={false} src={Back} style={{ marginBottom: 3 }} />
            </div>
            <span style={{ color: "#161822" }}>Details of works</span>
            {/* Image display next to the details of works */}
            {/* <div style={{ position: "relative", flex: 1 }}>
              <Image
                preview={false}
                src={Mountain}
                width={359}
                height={98}
                style={{
                  // paddingBottom: "24px",
                  position: "absolute",
                  bottom: "21%",
                  left: isBigScreen ? "126.5%" : "110%",
                  zIndex: -1,
                  display: isSmallScreen ? "none" : "block",
                }}
              />
            </div>
            <div style={{ position: "relative", flex: 1 }}>
              <div
                style={{
                  position: "absolute",
                  right: 15,
                  bottom: -41,
                  zIndex: -2,
                  display: isSmallScreen ? "none" : "block",
                }}
              >
                <Image preview={false} src={Rainbow} width={350} height={175} />
              </div>
            </div> */}
          </div>

          <Row gutter={[0, 0]} className="">
            <Col md={11} sm={24}>
              <div className="image-wrapper" style={{ marginTop: "40px" }}>
                <Image
                  preview={false}
                  src={
                    nftDetail
                      ? nftDetail.tokenIpfs
                      : "images/nft-placeholder2.png"
                  }
                />
              </div>
              <ReportNFT />
            </Col>

            {sellOption && (
              <Col md={13} sm={24}>
                <Sell
                  detail={nftDetail}
                  onListUpdateHandle={() => {
                    setRefreshData(!refreshData);
                    setSellOption(!sellOption);
                  }}
                />
              </Col>
            )}

            {!sellOption && nftDetail && (
              <Col md={13} sm={24}>
                {/* <!-- NFT name --> */}
                <div>
                  <Title level={4} style={{ fontSize: "36px" }} strong>
                    {nftDetail?.tokenName}
                  </Title>

                  <div className="collection-favorite">
                    <div className="collection">
                      <Link
                        className="category"
                        to={`/viewCollection?collectionId=${nftDetail?.collectionId}`}
                      >
                        {nftDetail?.collectionTitle}
                      </Link>
                    </div>

                    {/* <!-- Favorite --> */}
                    <div className="favorite-action">
                      {followingStatus ? (
                        <HeartOutlined
                          style={{
                            fontSize: "24px",
                            color: "#eb2f96",
                            cursor: "pointer",
                          }}
                          onClick={() => onClaim()}
                        />
                      ) : (
                        <HeartOutlined
                          style={{
                            fontSize: "24px",
                            color: "#ccc",
                            cursor: "pointer",
                          }}
                          onClick={() => onClaim()}
                        />
                      )}
                      <Paragraph className="helper">
                        {nftDetail.favorite}
                      </Paragraph>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#0F0D14",
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <div
                    className="my-nft-action"
                    style={{ position: "relative" }}
                  >
                    {isInitialized &&
                      user &&
                      nftDetail &&
                      nftDetail.creator === user.get("ethAddress") && (
                        <MyNFTAction
                          onCancelHandle={() => setRefreshData(!refreshData)}
                          onUpdatePriceHandle={() =>
                            setRefreshData(!refreshData)
                          }
                          detail={nftDetail}
                          onSellActionHandle={onSellActionHandle}
                          sellOption={sellOption}
                        />
                      )}
                  </div>
                  <div style={{ marginTop: "-5px" }}>
                    {nftDetail && (
                      <FixedPurchase
                        onBuyHandle={() => setRefreshData(!refreshData)}
                        onMakeOfferHandle={() => setRefreshData(!refreshData)}
                        detail={nftDetail}
                      />
                    )}

                    {nftDetail &&
                      nftDetail.isListed &&
                      nftDetail.auctionPrice > 0 && (
                        <AuctionPurchase
                          detail={nftDetail}
                          onPlaceBidHandle={() => setRefreshData(!refreshData)}
                        />
                      )}
                  </div>
                </div>
                {/* Minter && Owner */}
                <div
                  style={{
                    backgroundColor: "#0F0D14",
                    padding: 20,
                    borderRadius: 10,
                    marginTop: "10px",
                  }}
                >
                  {/* <!-- Description --> */}
                  {/* <Paragraph style={{ margin: "22px 0 0", color: "#ccc" }}>
                  {nftDetail?.tokenDescription}
                </Paragraph> */}
                  <Description detail={nftDetail} />
                  <hr style={{ borderColor: "#1D1F31", marginTop: "10px" }} />
                  <Row
                    gutter={[0, 0]}
                    style={{
                      padding: "0",
                      marginTop: "20px",
                      backgroundColor: "#0F0D14",
                    }}
                    className="bot-wrap"
                  >
                    <Col md={12} sm={12} style={{ display: "flex" }}>
                      <Minter detail={nftDetail} />
                    </Col>
                    <Col md={12} sm={12}>
                      <Owner detail={nftDetail} />
                    </Col>
                  </Row>
                  <Row
                    gutter={[0, 0]}
                    style={{
                      padding: "0",
                      // marginTop: "20px",
                      backgroundColor: "#0F0D14",
                    }}
                    className="bot-wrap"
                  >
                    <Col md={12} sm={12} style={{ display: "flex" }}>
                      <ExternalLink detail={nftDetail} />
                    </Col>
                    <Col md={12} sm={12}>
                      <EtherscanLink detail={nftDetail} />
                    </Col>
                  </Row>
                </div>
              </Col>
            )}
          </Row>
        </div>

        {/* 列表开始 */}
        <Row>
          <Col md={24} sm={24}>
            <BidList
              detail={nftDetail}
              topRefreshData={refreshData}
              onBidderHandle={() => setRefreshData(!refreshData)}
            />

            <OfferList
              detail={nftDetail}
              topRefreshData={refreshData}
              onOfferHandle={() => setRefreshData(!refreshData)}
            />
          </Col>
        </Row>
        <ItemActivity
          detail={nftDetail}
          topRefreshData={refreshData}
          onOfferHandle={() => setRefreshData(!refreshData)}
        />
        <RelatedItem items={items} />
      </div>
    </>
  );
}
export default NFTDetail;
