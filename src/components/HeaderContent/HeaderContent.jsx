import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Layout,
  Button,
  Dropdown,
  Alert,
  Space,
  Drawer,
  message,
  Modal,
  Row,
  Col,
  Image,
  Typography,
  Divider,
  Tooltip,
  Popover,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DownOutlined,
  CloseOutlined,
  TranslationOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import LogoSvg from "assets/images/new/beta.svg";
import { useMoralis, useChain } from "react-moralis";
import { useTranslation } from "react-i18next";
import Text from "antd/lib/typography/Text";

// Custom modules
import { chainData, getChainData } from "./chainData";
import { leftMeunItems, TopMenu, mobileMeunItems } from "./menuData";
import "./HeaderContent.scss";
import { connectors } from "./config";

import chainCheckedIcon from "assets/images/new/header/chain_checked.png";
import BscModelBg from "assets/images/new/bsc_model_bg.png";
import nichoLogoPng from "assets/images/new/nichoimg2.png";
import web3authLogo from "assets/images/new/web3auth.svg";
import web3authLogo2 from "assets/images/new/web3Auth2.png";
import Web2Wallet from "./Web2Wallet/Web2Wallet";
import { useMediaQuery } from "react-responsive";

const { Header } = Layout;

const isOnMainnet = window.location.href.includes(chainData[1].site_url);

const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
  connector: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "27px 0px 4px 0",
    cursor: "pointer",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    height: "30px",
    // width: "32px",
  },
};

const showError = (msg) => {
  message.error(msg);
};

function HeaderLayout() {
  const {
    authenticate,
    web3,
    isAuthenticated,
    account,
    user,
    isInitialized,
    Moralis,
  } = useMoralis();
  const { switchNetwork, chainId } = useChain();
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  // const bnbPriceCoin = useGetBNBPrice(1);
  const isMobile = useMediaQuery({ maxWidth: 991 });
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  const [avatarImg, setAvatarImg] = useState("images/avatar.png");

  const [isError, setIsError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [languageType, setLanguageType] = useState();

  const [showWrongNetworkModal, setShowWrongNetworkModal] = useState(false);
  const [currentLeftMenu, setCurrentLeftMenu] = useState("");
  const headerRef = useRef()
  // const [collapsed, setCollapsed] = useState(false);
  // const toggleCollapsed = () => {
  //   setCollapsed(!collapsed);
  // };

  //------------------- NETWORK Monitor -------------------------------
  const [currentChain, setCurrentChain] = useState(
    isOnMainnet ? chainData[1] : chainData[0]
  );
  // When different screen loads, screen should goes up.
  useEffect(() => {
    window.scrollTo(0, 0);
    const lng = localStorage.getItem("languageType");
    setLanguageType(lng);
  }, [pathname]);

  // whenever chainId changes, need to display correct network on selection.
  useEffect(() => {
    const currentDomainStatus = (targeLink) => {
      // return "0x38"
      const currentHostname = window.location.hostname;
      if (currentHostname.includes("localhost")) return "same";
      if (targeLink.includes("test") && currentHostname.includes("test"))
        return "same";
      if (
        targeLink.includes("test") === false &&
        currentHostname.includes("test") === false
      )
        return "same";

      if (currentHostname.includes("test")) return "0x61"; // bsc testnet
      return "0x38"; // bsc mainnet
    };
    console.log(Moralis.connectorType);
    const monitorNetwork = async () => {
      if (!chainId || chainId === "") return;
      const chainInfo = getChainData(chainId);
      setCurrentChain(chainInfo);

      // If this chain is disabled, notifiy about it.
      if (chainInfo.disabled) {
        setShowWrongNetworkModal(true);
      } else {
        setShowWrongNetworkModal(false);

        const curDS = currentDomainStatus(chainInfo.site_url);
        console.log(curDS);
        if (curDS !== "same") {
          await switchNetwork(curDS);
        }
        // console.log(window.location.hostname)
        // openLink(chainInfo.site_url);
      }
    };
    monitorNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

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
      const url = checkExternalLink(link);
      window.location.replace(url);
    } else {
      showError("Invalid Link");
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("languageType", lng);
    setLanguageType(lng);
  };

  const languageContent = (
    <div className="lang-dropdown-wrap">
      <div
        className={`lang-item ${languageType === "en" ? "active" : ""}`}
        onClick={() => {
          changeLanguage("en");
        }}
      >
        English
      </div>
      <div
        className={`lang-item ${languageType === "cn" ? "active" : ""}`}
        onClick={() => {
          changeLanguage("cn");
        }}
      >
        中文
      </div>
       <div
        className={`lang-item ${languageType === "es" ? "active" : ""}`}
        onClick={() => {
          changeLanguage("es");
        }}
      >
        español
      </div>
      <div
        className={`lang-item ${languageType === "ja" ? "active" : ""}`}
        onClick={() => {
          changeLanguage("ja");
        }}
      >
        Japanese
      </div>
      
    </div>
  );

  // Monitor user data changes.
  useEffect(() => {
    if (!isInitialized || !isAuthenticated || !user) return;
    const avatar = user.get("avatar");
    if (avatar !== undefined) {
      setAvatarImg(avatar);
    }
  }, [user, isInitialized, isAuthenticated]);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const showAlert = () => {
    setIsError(true);
  };
  const showGuide = () => {
    const metamaskExtension =
      "https://medium.com/@NichoNFT/how-to-set-up-your-metamask-and-participate-in-nicho-nft-marketplace-6665a3c483b";
    window.open(metamaskExtension, "_blank");
  };

  const onLeftMenuClick = (e) => {
    setCurrentLeftMenu(e.key);
  };

  const mobMenuClick = (e) => {
    setVisible(false);
  };

  const addLogout = (e) => {
    if (!isAuthenticated) return;

    let documentWidth = document.body.clientWidth;
    if (documentWidth > 1200) return;

    let myMenu = null;
    let hasLogout = false;
    mobileMeunItems.forEach((item) => {
      if (item.key === "my") {
        console.log(item, "item");
        myMenu = item;
        item.children.forEach((subItem) => {
          if (item.key === "logout") {
            hasLogout = true;
          }
        });
      }
    });

    if (!hasLogout) {
      myMenu.children.push({
        label: (
          <div className="logout">
            <Link to="/">{t("logout")}</Link>
          </div>
        ),
        key: "logout",
        icon: null,
        children: null,
      });
    }
  };

  // Select network from list
  const handleNetworkChange = (data) => {
    if (data.disabled) return;
    console.log("Handle:", data);
    setCurrentChain(data);
  };

  // When user click confirm button after select desired network.
  const SwitchChosenNetwork = async () => {
    if (chainId) {
      const chainInfo = getChainData(chainId);
      if (chainInfo.disabled) {
        await switchNetwork(currentChain.chainId);
      }
    }
    openLink(currentChain.site_url);
    setShowModal(false);
  };

  // Handle for scroll action
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    addLogout();

    const onScroll = () => setOffset(window.pageYOffset);

    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const web3Authenticate = async () => {
    console.log("CurrentID:", currentChain.chainId);
    setShowWeb3AuthAgreeModal(false);
    setHasUserClickTandC(false);
    await authenticate({
      provider: "web3Auth",
      clientId: process.env.REACT_APP_CLIENT_ID,
      chainId: currentChain.chainId,
      appLogo: nichoLogoPng,
    });

    // const result = document.getElementsByClassName("w3ajs-external-wallet w3a-group").remove();
  };

  // state variable for web3auth wallet
  const [showWeb3AuthAgreeModal, setShowWeb3AuthAgreeModal] = useState(false);
  const [hasUserClickTandC, setHasUserClickTandC] = useState(false);

  // web2 wallet state variable
  const [showWeb2Wallet, setShowWeb2Wallet] = useState(false);

  useEffect(() => {
    if (user && isAuthenticated && Moralis.connectorType === "web3Auth") {
      setShowWeb2Wallet(true);
    } else {
      setShowWeb2Wallet(false);
    }
  }, [user, isAuthenticated]);

  return (
    <Header
      ref={headerRef}
      className={
        offset > 10 ? "header custom-header2" : "header custom-header1"
      }
    >
      {/* Web3auth term and condition modal */}
      <Modal
        open={showWeb3AuthAgreeModal}
        footer={null}
        // title="Read Before Using"
        closable={false}
        centered={true}
        onCancel={() => {
          setShowWeb3AuthAgreeModal(false);
          setHasUserClickTandC(false);
        }}
        width={375}
      >
        <div className="web3auth-content">
          <Typography.Title level={3} className="web3auth-content-title">
            {t("readBeforeUsing")}
          </Typography.Title>
          <Divider style={{ background: "white" }} />
          <Typography.Paragraph style={{ textAlign: "center" }}>
            {t("pleaseClick")}{" "}
            <span
              className="web3auth-link"
              onClick={() => {
                window.open(
                  "https://medium.com/@NichoNFT/login-to-nicho-with-your-social-media-accounts-now-b434dcf2ecf2"
                );
                setHasUserClickTandC(true);
              }}
            >
              {t("here")}
            </span>{" "}
            {t("readTerms")}
          </Typography.Paragraph>
          <div className="web3auth-button-group">
            <Button
              style={{ width: "100%", background: "red" }}
              onClick={() => {
                setShowWeb3AuthAgreeModal(false);
                setHasUserClickTandC(false);
              }}
            >
              {t("neverMind")}
            </Button>
            {hasUserClickTandC ? (
              <Button
                style={{
                  width: "100%",
                  marginTop: "2rem",
                  background: "green",
                }}
                onClick={web3Authenticate}
              >
                {t("readDisclaimer")}
              </Button>
            ) : (
              <Tooltip
                title="Please Read the disclaimer first"
                placement="bottom"
              >
                <Button
                  disabled
                  style={{
                    width: "100%",
                    marginTop: "2rem",
                    background: "green",
                  }}
                  onClick={web3Authenticate}
                >
                  {t("readDisclaimer")}
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </Modal>
      {/* NETWORK LIST modal */}
      <Modal
        open={showModal || showWrongNetworkModal}
        footer={false}
        closable={false}
        centered={true}
        maskClosable={true}
        onCancel={() => setShowModal(false)}
        className="bsc-model"
        width={361}
      >
        <div
          className="form-group"
          style={{ backgroundImage: `url(${BscModelBg})` }}
        >
          {/* Wrong Network */}
          {showWrongNetworkModal && (
            <div style={{ margin: "15px", color: "#fb7272", fontSize: "16px" }}>
              {t("chooseNetwork")}
            </div>
          )}
          {/* Network List */}
          <Row className="">
            {chainData &&
              chainData.map(
                (item, index) =>
                  item.visible && (
                    <Col xl={24} lg={24} md={24} sm={24} key={index}>
                      <Row
                        className={{
                          mainnet: true,
                          "mainnet-curr": currentChain.value === item.value,
                          disabled: item.disabled,
                        }}
                        onClick={() => handleNetworkChange(item)}
                        align="middle"
                        justify="space-between"
                      >
                        <Row align="middle">
                          <div className="mainnet-item">
                            <img
                              src={item.logoUrl}
                              style={{ width: "14px" }}
                              alt="Nicho AI NFT"
                            />
                          </div>
                          {/* {tmpchain.value === item.value && (<Icon icon="carbon:dot-mark" color="#0fa958" height="10" style={{position: 'relative', left: '-5px'}} />)} */}
                          {item.label}

                          {currentChain.value === item.value && (
                            <img
                              className="anticon-check"
                              src={chainCheckedIcon}
                              alt="Nicho AI NFT"
                            />
                          )}
                        </Row>
                        {/* <Icon icon="emojione-monotone:gear" color="white" height="12" /> */}
                      </Row>
                    </Col>
                  )
              )}
          </Row>
          {/* Confirm Button */}
          <Row justify="center" style={{ margin: "16px 0 15px" }}>
            <Button
              className="theme-tiff-button"
              type="primary"
              onClick={() => SwitchChosenNetwork()}
              style={{ marginRight: "15px" }}
            >
              {t("confirm")}
            </Button>
          </Row>
        </div>
      </Modal>

      {(!isAuthenticated || !account) && (
        <Modal
          open={isAuthModalVisible}
          footer={null}
          onCancel={() => setIsAuthModalVisible(false)}
          bodyStyle={{
            padding: "0",
            fontSize: "17px",
            fontWeight: "500",
          }}
          className="wallet-modal"
        >
          <div
            className="connectors"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,133px)",
            }}
          >
            {connectors.map(({ title, icon, connectorId }, key) => (
              <div
                style={styles.connector}
                key={key}
                onClick={async () => {
                  try {
                    if (connectorId === "web3auth") {
                      setShowWeb3AuthAgreeModal(true);
                      // web3Authenticate();
                    } else if (connectorId === "walletconnect") {
                      await authenticate({
                        provider: connectorId,
                        mobileLinks: [
                          "rainbow",
                          "metamask",
                          "argent",
                          "trust",
                          "imtoken",
                          "pillar",
                        ],
                      });
                    } else {
                      if (web3 && !web3.givenProvider) {
                        showAlert();
                        setIsAuthModalVisible(false);
                        return;
                      }
                      if (isMobile) {
                        if (title === "Metamask") {
                          if (window.ethereum) {
                            // console.log(window.location.hostname);
                            await authenticate({
                              provider: connectorId,
                            });
                            window.localStorage.setItem(
                              "connectorId",
                              connectorId
                            );
                            setIsAuthModalVisible(false);
                          } else {
                            window.open(
                              `https://metamask.app.link/dapp/${window.location.hostname}/`
                            );
                          }
                        }
                        return;
                      }

                      await authenticate({
                        provider: connectorId,
                      });
                    }

                    window.localStorage.setItem("connectorId", connectorId);
                    setIsAuthModalVisible(false);
                  } catch (e) {
                    console.error(e);
                    showError("SignIn Failed");
                  }
                }}
              >
                <img src={icon} alt={title} style={styles.icon} />
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                  color="#fff"
                >
                  {title}
                </Text>
              </div>
            ))}
          </div>
        </Modal>
      )}
      <div className="metamask-setup">
        {isError && (
          <Alert
            message="Provider Error"
            description="No provider was found"
            type="error"
            action={
              <Space direction="vertical" align="end">
                <span
                  onClick={() => setIsError(false)}
                  style={{ cursor: "pointer" }}
                >
                  <CloseOutlined />
                </span>
                <a size="small" href="#" primary onClick={showGuide}>
                  {t("needHelp")}
                </a>
              </Space>
            }
          />
        )}
      </div>
      <nav className="menuBar header-content">
        <div className="logo">
          <Link to="/">
            <img
              style={{ width: "180px" }}
              src={LogoSvg}
              alt="Nicho AI NFT"
              onClick={() => {
                setCurrentLeftMenu("");
              }}
            />
          </Link>
        </div>
        <div className="menuCon">
          <div className="leftMenu">
            <Menu
              onClick={onLeftMenuClick}
              selectedKeys={[currentLeftMenu]}
              mode="horizontal"
              items={leftMeunItems(t)}
            />
          </div>
          <div
            className="rightMenu"
            style={{ display: "flex", alignItems: "center", height: "46px" }}
          >
            {/* language */}
            <Popover overlayClassName="lang-popover" getPopupContainer={() => headerRef.current} content={languageContent}>
              <Space>
                <TranslationOutlined className="lang-icon" />
              </Space>
            </Popover>

            {/* web2 wallet button */}
            {showWeb2Wallet && <Web2Wallet currentChain={currentChain} />}
            {/* <Web2Wallet currentChain={currentChain} /> */}

            {!isAuthenticated && !account && (
              <Button
                type="primary"
                className="connect-wallet"
                onClick={() => setIsAuthModalVisible(true)}
              >
                {t("connectWallet")}
              </Button>
            )}
            {/* {isAuthenticated && (
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  <img src={avatarImg} className="user-avatar"/> <DownOutlined/>
                </a>
              </Dropdown>
            )} */}

            {isAuthenticated && (
              <div>
                <Dropdown overlay={<TopMenu t={t} />}>
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img src={avatarImg} className="user-avatar" alt="Nicho AI NFT" />
                    <DownOutlined />
                  </a>
                </Dropdown>
              </div>
            )}

            <div style={{ marginLeft: "15px", display: "inline-block" }}>
              <Button
                type="primary"
                className="choose-net"
                onClick={() => setShowModal(true)}
              >
                <Row align="middle">
                  <span>
                    {currentChain && currentChain.value} &nbsp;&nbsp;&nbsp;{" "}
                  </span>
                  <i className="xsj-icon" />
                </Row>
              </Button>
            </div>

            <Button className="barsMenu border-none" onClick={showDrawer}>
              <span className="barsBtn"></span>
            </Button>
          </div>

          <Drawer
            title=""
            placement="right"
            closable={true}
            onClose={onClose}
            open={visible}
            className="mob-right-drawer"
            width={300}
          >
            <div className="mob-logo-wrap">
              <Link to="/" onClick={() => setVisible(false)}>
                <Image preview={false} height={48} src={nichoLogoPng} />
              </Link>

              <div
                className="drawer-right-close"
                onClick={() => setVisible(false)}
              >
                <CloseOutlined />
              </div>
            </div>
            <div className="mob-meun-scroll">
              <Menu
                mode="inline"
                theme="dark"
                items={mobileMeunItems(t)}
                onClick={mobMenuClick}
                className="mob-right-menu"
              />
            </div>

            <div className="mob-footer-wrap">
              {!isAuthenticated && !account && (
                <Button
                  type="primary"
                  onClick={() => setIsAuthModalVisible(true)}
                >
                  {t("connectWallet")}
                </Button>
              )}

              <Button
                type="primary"
                className="choose-net"
                onClick={() => setShowModal(true)}
              >
                <Row align="middle">
                  <span>
                    {currentChain && currentChain.value} &nbsp;&nbsp;&nbsp;{" "}
                  </span>
                  <i className="xsj-icon" />
                </Row>
              </Button>

              <span></span>
            </div>
          </Drawer>
        </div>
      </nav>
    </Header>
  );
}

export default HeaderLayout;
