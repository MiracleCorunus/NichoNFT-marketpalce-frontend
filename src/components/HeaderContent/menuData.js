import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import { Menu, Button, Row, Tooltip } from "antd";
import { ReactComponent as NavSvg1 } from "assets/images/new/header/nav1.svg";
import { ReactComponent as NavSvg2 } from "assets/images/new/header/nav2.svg";
import { ReactComponent as NavSvg3 } from "assets/images/new/header/nav3.svg";
import { ReactComponent as NavSvg4 } from "assets/images/new/header/nav4.svg";
import { ReactComponent as Ranking_logo } from "assets/images/new/header/Ranking_logo.svg";

import Img1 from "assets/images/new/header/1.png";
import Img2 from "assets/images/new/header/2.png";
import Img3 from "assets/images/new/header/3.png";
import Img4 from "assets/images/new/header/4.png";
import Img5 from "assets/images/new/header/5.png";
import Img6 from "assets/images/new/header/6.png";
import Img7 from "assets/images/new/header/7.png";
import Img8 from "assets/images/new/header/8.png";
import Img9 from "assets/images/new/header/9.png";
import Img10 from "assets/images/new/header/10.png";
import Img11 from "assets/images/new/header/11.png";
import Img12 from "assets/images/new/header/12.png";
import Img13 from "assets/images/new/header/13.png";
import Img14 from "assets/images/new/header/14.png";
import Whitepaper from "assets/images/new/header/whitepaper.png";
import { t } from "i18next";
import Ai from "assets/images/new/header/ai.png";
import Invoice from "assets/images/new/header/invoice.png";

import { ReactComponent as AiIcon } from "assets/images/new/aiIcons/aiIcon.svg";
import invoiceIcon from "assets/images/new/aiIcons/invoiceIcon.svg";
import musicIcon from "assets/images/new/aiIcons/musicIcon.svg";
import imageIcon from "assets/images/new/aiIcons/imageIcon.svg";
import videoIcon from "assets/images/new/aiIcons/videoIcon.svg";
import marketIcon from "assets/images/new/aiIcons/marketIcon.png";
import { useEffect } from "react";

// Go to external link
const openLink = (link) => {
  console.log("LINK", link);
  window.open(link, "_blank");
};

/**
 * GetItem class
 */
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// Left menus
export const leftMeunItems = (t) => {
  return [
    getItem(
      <span className="title-svg-wrap">
        <NavSvg1 />
        NFTs
      </span>,
      "sub1",
      null,
      [
        getItem(
          <Link to="/nftMarketPlace">
            <div className="img-box">
              <img src={Img1} alt="Nicho AI NFT" />
            </div>
            {t("explore")}
          </Link>,
          "/nftMarketPlace"
        ),
        getItem(
          <Link to="/collections">
            <div className="img-box">
              <img src={Img7} alt="Nicho AI NFT" />
            </div>
            {t("collection")}
          </Link>,
          "/collections"
        ),
        getItem(
          <Link to="/createNFT">
            <div className="img-box">
              <img src={Img4} alt="Nicho AI NFT" />
            </div>
            {t("createNft")}
          </Link>,
          "/createNFT"
        ),
        getItem(
          <Link to="/CreateOwnCollection">
            <div className="img-box">
              <img src={Img5} alt="Nicho AI NFT" />
            </div>
            {t("createCollection")}
          </Link>,
          "/CreateOwnCollection"
        ),
        getItem(
          <Link to="/RankingList">
            <div className="img-box">
              <Ranking_logo />
              {/* <img src={Img5} alt="Nicho AI NFT" /> */}
            </div>
            {t("rankingList")}
          </Link>,
          "/RankingList"
        ),
      ]
    ),
    getItem(
      <span className="title-svg-wrap">
        <NavSvg2 />
        {t("earn")}
      </span>,
      "sub2",
      null,
      [
        getItem(
          <Link to="/tradeToEarn">
            <div className="img-box">
              <img src={Img8} alt="Nicho AI NFT" />
            </div>
            {t("tradeToEarn")}
          </Link>,
          "/tradeToEarn"
        ),
        getItem(
          <Link to="/mintToEarn">
            <div className="img-box">
              <img src={Img9} alt="Nicho AI NFT" />
            </div>
            {t("mintToEarn")}
          </Link>,
          "/mintToEarn"
        ),
        getItem(
          <Link to="/staking">
            <div className="img-box">
              <img src={Img10} alt="Nicho AI NFT" />
            </div>
            {t("staking")}
          </Link>,
          "/staking"
        ),
      ]
    ),
    getItem(
      <span className="title-svg-wrap">
        <AiIcon width={24} height={24} />
        {/* <NavSvg3 /> */}
        {t("play")}
      </span>,
      "sub3",
      null,
      [
        // getItem(
        //   <Link to="/prediction">
        //     <div className="img-box">
        //       <img src={Img11} alt="Nicho AI NFT" />
        //     </div>
        //     {t("prediction")}
        //   </Link>,
        //   "/prediction"
        // ),

        // getItem(
        //   <a
        //     href="https://snapshot.org/#/nichonft.eth"
        //     target="_blank"
        //     rel="noreferrer"
        //   >
        //     <div className="img-box">
        //       <img src={Img12} alt="Nicho AI NFT" />
        //     </div>
        //     {t("voting")}
        //   </a>,
        //   "10"
        // ),

        // getItem(
        //   <Link to="/park">
        //     <div className="img-box">
        //       <img src={Img14} alt="Nicho AI NFT" />
        //     </div>
        //     {t("NICHOPPark")}
        //   </Link>,
        //   "/park"
        // ),
        getItem(
          <Link to="/imageGenerator">
            <div className="img-box">
              <img src={imageIcon} alt="Nicho AI NFT" width={32} height={32} />
            </div>
            {t("imageGenerator")}
          </Link>,
          "/imageGenerator"
        ),
        getItem(
          <Link to="/invoiceGenerator">
            <div className="img-box">
              <img
                src={invoiceIcon}
                alt="Nicho AI NFT"
                width={32}
                height={32}
              />
            </div>
            {t("invoiceGenerator")}
          </Link>,
          "/invoiceGenerator"
        ),
        getItem(
          <Tooltip title="COMING SOON">
            <Link to="#">
              <div className="img-box">
                <img
                  src={musicIcon}
                  alt="Nicho AI NFT"
                  width={32}
                  height={32}
                />
              </div>
              <span style={{ color: "gray" }}>{t("musicGenerator")}</span>
            </Link>
          </Tooltip>,
          "/musicGenerator"
        ),
        getItem(
          <Tooltip title="COMING SOON">
            <Link to="#">
              <div className="img-box">
                <img
                  src={videoIcon}
                  alt="Nicho AI NFT"
                  width={32}
                  height={32}
                />
              </div>
              <span style={{ color: "gray" }}>{t("videoGenerator")}</span>
            </Link>
          </Tooltip>,
          "/videoGenerator"
        ),
        getItem(
          <Tooltip title="COMING SOON">
            <Link to="#">
              <div className="img-box">
                <img
                  src={marketIcon}
                  alt="Nicho AI NFT"
                  width={32}
                  height={32}
                />
              </div>
              <span style={{ color: "gray" }}>{t("promptMarket")}</span>
            </Link>
          </Tooltip>,
          "/promptMarket"
        ),
      ]
    ),
    getItem(
      <span className="title-svg-wrap">
        <NavSvg4 />
        {t("NichoPlanet")}
      </span>,
      "sub4",
      null,
      [
        // getItem(<a href="https://test.nichonft.com/jettlucas" target="_blank" rel="noreferrer">
        //   <div className="img-box"><img src={Img13} alt="Nicho AI NFT"/></div>
        //   Jett Lucas</a>, '9'),

        getItem(
          <Link to="/prediction">
            <div className="img-box">
              <img src={Img11} alt="Nicho AI NFT" />
            </div>
            {t("prediction")}
          </Link>,
          "/prediction"
        ),

        getItem(
          <a
            href="https://snapshot.org/#/nichonft.eth"
            target="_blank"
            rel="noreferrer"
          >
            <div className="img-box">
              <img src={Img12} alt="Nicho AI NFT" />
            </div>
            {t("voting")}
          </a>,
          "10"
        ),

        getItem(
          <Link to="/park">
            <div className="img-box">
              <img src={Img14} alt="Nicho AI NFT" />
            </div>
            {t("NICHOPPark")}
          </Link>,
          "/park"
        ),

        getItem(
          <Link to="/jettlucas">
            <div className="img-box">
              <img src={Img13} alt="Nicho AI NFT" />
            </div>
            {t("JettLucas")}
          </Link>,
          "11"
        ),
        // getItem(
        //   <Link to="/whitepaper">
        //     <div className="img-box">
        //       <img src={Whitepaper} alt="Nicho AI NFT" width={32} height={32} />
        //     </div>
        //     {t("Whitepaper")}
        //   </Link>,
        //   "12"
        // ),
      ]
    ),
  ];
};

// mobile Right menus
export const mobileMeunItems = (t) => {
  return [
    getItem(
      <span className="title-svg-wrap">
        <NavSvg1 />
        NFTs
      </span>,
      "sub1",
      null,
      [
        getItem(
          <Link to="/nftMarketPlace">
            <div className="img-box">
              <img src={Img1} alt="Nicho AI NFT" />
            </div>
            {t("explore")}
          </Link>,
          "/nftMarketPlace"
        ),
        getItem(
          <Link to="/collections">
            <div className="img-box">
              <img src={Img7} alt="Nicho AI NFT" />
            </div>
            {t("collection")}
          </Link>,
          "/collections"
        ),
        getItem(
          <Link to="/createNFT">
            <div className="img-box">
              <img src={Img4} alt="Nicho AI NFT" />
            </div>
            {t("createNft")}
          </Link>,
          "/createNFT"
        ),
        getItem(
          <Link to="/CreateOwnCollection">
            <div className="img-box">
              <img src={Img5} alt="Nicho AI NFT" />
            </div>
            {t("createCollection")}
          </Link>,
          "/CreateOwnCollection"
        ),
        getItem(
          <Link to="/RankingList">
            <div className="img-box">
              <Ranking_logo />
              {/* <img src={Img5} alt="Nicho AI NFT" /> */}
            </div>
            {t("rankingList")}
          </Link>,
          "/RankingList"
        ),
      ]
    ),
    getItem(
      <span className="title-svg-wrap">
        <NavSvg2 />
        {t("earn")}
      </span>,
      "sub2",
      null,
      [
        getItem(
          <Link to="/tradeToEarn">
            <div className="img-box">
              <img src={Img8} alt="Nicho AI NFT" />
            </div>
            {t("tradeToEarn")}
          </Link>,
          "/tradeToEarn"
        ),
        getItem(
          <Link to="/mintToEarn">
            <div className="img-box">
              <img src={Img9} alt="Nicho AI NFT" />
            </div>
            {t("mintToEarn")}
          </Link>,
          "/mintToEarn"
        ),
        getItem(
          <Link to="/staking">
            <div className="img-box">
              <img src={Img10} alt="Nicho AI NFT" />
            </div>
            {t("staking")}
          </Link>,
          "/staking"
        ),
      ]
    ),
    getItem(
      <span className="title-svg-wrap">
        <AiIcon width={20} height={20} />
        {/* <NavSvg3 /> */}
        {t("play")}
      </span>,
      "sub3",
      null,
      [
        // getItem(
        //   <Link to="/prediction">
        //     <div className="img-box">
        //       <img src={Img11} alt="Nicho AI NFT" />
        //     </div>
        //     {t("prediction")}
        //   </Link>,
        //   "/prediction"
        // ),

        // getItem(
        //   <a
        //     href="https://snapshot.org/#/nichonft.eth"
        //     target="_blank"
        //     rel="noreferrer"
        //   >
        //     <div className="img-box">
        //       <img src={Img12} alt="Nicho AI NFT" />
        //     </div>
        //     {t("voting")}
        //   </a>,
        //   "10"
        // ),

        // getItem(
        //   <Link to="/park">
        //     <div className="img-box">
        //       <img src={Img14} alt="Nicho AI NFT" />
        //     </div>
        //     {t("NICHOPark")}
        //   </Link>,
        //   "/park"
        // ),
        getItem(
          <Link to="/imageGenerator">
            <div className="img-box">
              <img src={imageIcon} alt="Nicho AI NFT" width={32} height={32} />
            </div>
            {t("imageGenerator")}
          </Link>,
          "/imageGenerator"
        ),
        getItem(
          <Link to="/invoiceGenerator">
            <div className="img-box">
              <img
                src={invoiceIcon}
                alt="Nicho AI NFT"
                width={32}
                height={32}
              />
            </div>
            {t("invoiceGenerator")}
          </Link>,
          "/invoiceGenerator"
        ),
        getItem(
          <Tooltip title="COMING SOON">
            <Link to="#">
              <div className="img-box">
                <img
                  src={musicIcon}
                  alt="Nicho AI NFT"
                  width={32}
                  height={32}
                />
              </div>
              <span style={{ color: "gray" }}>{t("musicGenerator")}</span>
            </Link>
          </Tooltip>,
          "/musicGenerator"
        ),
        getItem(
          <Tooltip title="COMING SOON">
            <Link to="#">
              <div className="img-box">
                <img
                  src={videoIcon}
                  alt="Nicho AI NFT"
                  width={32}
                  height={32}
                />
              </div>
              <span style={{ color: "gray" }}>{t("videoGenerator")}</span>
            </Link>
          </Tooltip>,
          "/videoGenerator"
        ),
        getItem(
          <Tooltip title="COMING SOON">
            <Link to="#">
              <div className="img-box">
                <img
                  src={marketIcon}
                  alt="Nicho AI NFT"
                  width={32}
                  height={32}
                />
              </div>
              <span style={{ color: "gray" }}>{t("promptMarket")}</span>
            </Link>
          </Tooltip>,
          "/promptMarket"
        ),
      ]
    ),
    getItem(
      <span className="title-svg-wrap">
        <NavSvg4 />
        {t("NichoPlanet")}
      </span>,
      "sub4",
      null,
      [
        // getItem(<a href="https://test.nichonft.com/jettlucas" target="_blank" rel="noreferrer">
        //   <div className="img-box"><img src={Img13} alt="Nicho AI NFT"/></div>
        //   Jett Lucas</a>, '9'),
        getItem(
          <Link to="/prediction">
            <div className="img-box">
              <img src={Img11} alt="Nicho AI NFT" />
            </div>
            {t("prediction")}
          </Link>,
          "/prediction"
        ),

        getItem(
          <a
            href="https://snapshot.org/#/nichonft.eth"
            target="_blank"
            rel="noreferrer"
          >
            <div className="img-box">
              <img src={Img12} alt="Nicho AI NFT" />
            </div>
            {t("voting")}
          </a>,
          "10"
        ),

        getItem(
          <Link to="/park">
            <div className="img-box">
              <img src={Img14} alt="Nicho AI NFT" />
            </div>
            {t("NICHOPark")}
          </Link>,
          "/park"
        ),

        getItem(
          <Link to="/jettlucas">
            <div className="img-box">
              <img src={Img13} alt="Nicho AI NFT" />
            </div>
            {t("JettLucas")}
          </Link>,
          "11"
        ),
      ]
    ),
    getItem(
      <span className="title-svg-wrap">
        <NavSvg4 />
        {t("my")}
      </span>,
      "my",
      null,
      [
        getItem(
          <Link to="/myNfts">
            <div className="img-box">
              <img src={Img1} alt="Nicho AI NFT" />
            </div>
            {t("myNFTs")}
          </Link>,
          "mynft"
        ),
        getItem(
          <Link to="/updateUser">
            <div className="img-box">
              <img src={Img2} alt="Nicho AI NFT" />
            </div>
            {t("editProfile")}
          </Link>,
          "edit-profile"
        ),
        getItem(
          <Link to="/createNFT">
            <div className="img-box">
              <img src={Img3} alt="Nicho AI NFT" />
            </div>
            {t("createNft")}
          </Link>,
          "create-nft"
        ),
        getItem(
          <Link to="/following">
            <div className="img-box">
              <img src={Img4} alt="Nicho AI NFT" />
            </div>
            {t("followers")}
          </Link>,
          "user-following"
        ),
        getItem(
          <Link to="/CreateOwnCollection">
            <div className="img-box">
              <img src={Img5} alt="Nicho AI NFT" />
            </div>
            {t("createCollection")}
          </Link>,
          "create-collection"
        ),
        getItem(
          <Link to="/myCollections">
            <div className="img-box">
              <img src={Img6} alt="Nicho AI NFT" />
            </div>
            {t("myCollections")}
          </Link>,
          "my-collections"
        ),
      ]
    ),
  ];
};

// right menus

// Top menus
export const TopMenu = (props) => {
  const { logout, user, account } = useMoralis();
  const { t } = props;

  useEffect(() => {
    if (!user || !account) {
      return;
    }
    // Account does not match
    if (user.get("ethAddress") !== account) {
      logout();
    }
  }, [user, account])
  return (
    <Menu className="user-dropdown">
      <Menu.Item key={"mynft"}>
        <Link to="/myNfts">
          <div className="img-box">
            <img src={Img1} alt="Nicho AI NFT" />
          </div>
          {t("myNFTs")}
        </Link>
      </Menu.Item>
      <Menu.Item key={"edit-profile"}>
        <Link to="/updateUser">
          <div className="img-box">
            <img src={Img2} alt="Nicho AI NFT" />
          </div>
          {t("editProfile")}
        </Link>
      </Menu.Item>
      <Menu.Item key={"create-nft"}>
        <Link to="/createNFT">
          <div className="img-box">
            <img src={Img3} alt="Nicho AI NFT" />
          </div>
          {t("createNft")}
        </Link>
      </Menu.Item>
      <Menu.Item key={"user-following"}>
        <Link to="/following">
          <div className="img-box">
            <img src={Img4} alt="Nicho AI NFT" />
          </div>
          {t("followers")}
        </Link>
      </Menu.Item>
      <Menu.Item key={"create-collection"}>
        <Link to="/CreateOwnCollection">
          <div className="img-box">
            <img src={Img5} alt="Nicho AI NFT" />
          </div>
          {t("createCollection")}
        </Link>
      </Menu.Item>
      <Menu.Item key={"my-collections"}>
        <Link to="/myCollections">
          <div className="img-box">
            <img src={Img6} alt="Nicho AI NFT" />
          </div>
          {t("myCollections")}
        </Link>
      </Menu.Item>
      <Menu.Item className="logout" key={"logout"}>
        <Link to="/" onClick={logout}>
          {t("logout")}
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export const PageMenu = (
  <Menu>
    <Menu.Item key={"explore"}>
      <Link to="/nftMarketPlace">Explore</Link>
    </Menu.Item>
    <Menu.Item key={"collections"}>
      <Link to="/collections">Collections</Link>
    </Menu.Item>
    <Menu.Item key={"earn"}>
      <Link to="/tradeToEarn">Earn</Link>
    </Menu.Item>
    <Menu.Item
      key={"contract"}
      onClick={() =>
        openLink(
          "https://medium.com/@NichoNFT/get-started-with-your-nicho-nft-journey-ceb3ec36802f"
        )
      }
    >
      Guide to Journey
    </Menu.Item>
    <Menu.Item
      key={"governance"}
      onClick={() => openLink("https://snapshot.org/#/nichonft.eth")}
    >
      Governance
    </Menu.Item>
  </Menu>
);
