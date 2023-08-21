import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./style.scss";
import "./App.scss";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";

import HeaderContent from "components/HeaderContent";
import Home from "components/Home";
import FooterContent from "components/FooterContent";
import MarketPlace from "components/MarketPlace";
import NFTBalance from "components/NFTBalance/NFTBalance";
import Profile from "components/Profile";
import CreateNFT from "components/CreateNFT";
import UpdateUser from "components/UpdateUser";
import NFTDetail from "components/NFTDetail";
import CreateCollection from "components/CreateCollection";
import CollectionView from "components/CollectionView";
import MyCollections from "components/MyCollections";
import Collections from "components/Collections";

import EditCollection from "components/EditCollection";
import Following from "components/Following";
import BatchNFT from "components/BatchNFT";

import LandingPage from "components/LandingPage";
import Reward from "components/Reward";
import EventPage from "components/EventPage";
import TradeToEarn from "components/TradeToEarn";
import MintToEarn from "components/MintToEarn";
import Staking from "components/Staking";
import Prediction from "components/Prediction";
import RankingList from "components/RankingList";
import CreateOwnCollection from "components/CreateOwnCollection";
import Park from "components/Park";
import ImageGenerator from "components/ImageGenerator";
import InvoiceGenerator from "components/InvoiceGenerator";
import Whitepaper from "components/Whitepaper/Whitepaper";

const { Footer, Content } = Layout;

const App = () => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout>
      <Router>
        <HeaderContent />

        <Content>
          <CacheSwitch>
            <Route path="/myNfts">
              <NFTBalance />
            </Route>
            <Route path="/imageGenerator">
              <ImageGenerator />
            </Route>
            <Route path="/whitepaper">
              <Whitepaper />
            </Route>
            <Route path="/invoiceGenerator">
              <InvoiceGenerator />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <CacheRoute path="/nftMarketPlace">
              <MarketPlace />
            </CacheRoute>
            <Route path="/createNFT">
              <CreateNFT />
            </Route>
            <Route path="/batchNFT">
              <BatchNFT />
            </Route>
            <Route path="/createCollection">
              <CreateCollection />
            </Route>
            <Route path="/createOwnCollection">
              <CreateOwnCollection />
            </Route>
            <CacheRoute path="/viewCollection">
              <CollectionView />
            </CacheRoute>
            <Route path="/updateUser">
              <UpdateUser />
            </Route>
            <Route path="/nftDetail">
              <NFTDetail />
            </Route>
            <Route path="/myCollections">
              <MyCollections />
            </Route>
            <CacheRoute path="/collections">
              <Collections />
            </CacheRoute>
            <Route path="/editCollection">
              <EditCollection />
            </Route>
            <Route path="/following">
              <Following />
            </Route>
            {/* <Route path="/landingPage">
              <LandingPage />
            </Route> */}
            <Route path="/reward">
              <Reward />
            </Route>
            <Route path="/jettlucas">
              <EventPage />
            </Route>
            <Route path="/tradeToEarn">
              <TradeToEarn />
            </Route>
            <Route path="/mintToEarn">
              <MintToEarn />
            </Route>
            <Route path="/staking">
              <Staking />
            </Route>
            <Route path="/prediction">
              <Prediction />
            </Route>
            <Route path="/RankingList">
              <RankingList />
            </Route>
            <Route path="/park">
              <Park />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/">
              <LandingPage />
            </Route>
          </CacheSwitch>
        </Content>
        <Footer>
          <FooterContent />
        </Footer>
      </Router>
    </Layout>
  );
};

export default App;
