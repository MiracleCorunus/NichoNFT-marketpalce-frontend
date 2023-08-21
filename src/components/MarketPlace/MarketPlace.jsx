import { useEffect, useState } from "react";
// import { Image, Carousel } from 'antd';
import { Helmet } from 'react-helmet';
import { useMoralis } from "react-moralis";
import RecommendedCreators from "./RecommendedCreators";
import ProductList from "./ProductList";
import ThreeSlider from "components/common/ThreeSlider";
import "./MarketPlace.scss";
import { getCollectionsBannerApi } from "api/common";
import { getUserListApi } from "api/user";

function MarketPlace() {
  const { user } = useMoralis();
  const [users, setUsers] = useState();
  const [collectionsBanner, setCollectionsBanner] = useState();

  // Get recommend creators.
  useEffect(() => {
    const getUsers = async () => {
      try {
        const userAddress = user ? user.get("ethAddress") : null;
        const params = {
          pageNo: 1,
          pageSize: 8,
          address: userAddress,
        };
        const { records } = await getUserListApi(params);
        if (records) {
          setUsers(records);
        }
      } catch (err) {
        console.error("getUserList:", err);
      }
    };
    getUsers();
  }, [user]);

  // Get recommended collections
  useEffect(() => {
    const getCollectionsBanner = async () => {
      try {
        const params = {
          pageNo: 1,
          pageSize: 5,
          recommendedSize: 5,
        };
        const { records } = await getCollectionsBannerApi(params);

        if (records) {
          setCollectionsBanner(records);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCollectionsBanner();
  }, []);

  return (
    <div className="marketplace-new">
      <Helmet>
        <title>Nicho AI NFT | Explorer</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className="com-black-bg2">
        <div className="center-page">
          <ThreeSlider collections={collectionsBanner} />
        </div>
      </div>
      <RecommendedCreators creators={users} />
      <ProductList />
    </div>
  );
}

export default MarketPlace;
