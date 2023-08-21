import { Typography, Row, Col, message } from "antd";
import "./NFTBalanceHeader.scss";
import { ReactComponent as TwitterIcon } from "assets/images/twitter.svg";
// import { ReactComponent as MailIcon } from "assets/images/mail.svg";
import { useMoralis, useNativeBalance } from "react-moralis";
import { useEffect, useState } from "react";
import { truncateHash } from "helpers/Utils";
// import { Icon } from '@iconify/react';
// import { ReactComponent as HeartIcon } from 'assets/images/heart.svg';
import { CopyOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
function NFTBalanceHeader() {
  const { user, chainId } = useMoralis();
  const {
    data: balance,
    error,
    isLoading,
  } = useNativeBalance({
    chain: chainId,
    address: user?.get("ethAddress"),
  });
  const [avatarURL, setAvatarURL] = useState("/images/avatar.png");
  const [bannerURL, setBannerURL] = useState("/images/nicho-default1.jpeg");
  const openLink = (e) => {
    e.preventDefault();
    const web_link = user.get("website_link");
    if (web_link && web_link.length > 0) {
      window.location.href = web_link;
    }
  };
  // const openEmilLink = (e) => {
  //   e.preventDefault();
  //   const email = user.get("email");
  // }
  const showCopied = () => {
    message.success("Copied", 0.5);
  };

  useEffect(() => {
    if (!user) return;
    if (user.get("avatar")?.length > 0) {
      setAvatarURL(user.get("avatar"));
    }
    if (user.get("banner")) {
      setBannerURL(user.get("banner"));
    }
  }, [user]);

  return (
    <div className="nft-balance-header-new">
      <div
        className="bg-content"
        style={{ backgroundImage: `url(${bannerURL})` }}
      ></div>
      <Row
        className="personal-content"
        gutter={[30]}
        align="middle"
        justify="space-between"
      >
        <Col sm={12}>
          <div className="display-flex">
            <div className="user-avatar">
              <img src={avatarURL} alt="Nicho AI NFT" />
            </div>
            <div>
              <div className="user-name">
                <Title ellipsis level={5}>
                  {" "}
                  {user &&
                    (user.get("username").length > 10
                      ? truncateHash(user.get("username"), 6, 4)
                      : user.get("username"))}{" "}
                </Title>
                <div className="items-center" style={{ marginTop: "6px" }}>
                  <Paragraph ellipsis className="user-address">
                    {user && truncateHash(user.get("ethAddress"), 6, 4)}
                    &nbsp;
                    <CopyOutlined
                      onClick={() => {
                        navigator.clipboard.writeText(user.get("ethAddress"));
                        showCopied();
                      }}
                      title="copy"
                      style={{ color: "white" }}
                    ></CopyOutlined>
                  </Paragraph>
                </div>

                <div className="items-center" style={{ marginTop: "6px" }}>
                  <Paragraph ellipsis className="user-address">
                    {user &&
                      balance &&
                      !error &&
                      !isLoading &&
                      `BNB balance: ${balance.formatted ? balance.formatted : 0
                      }`}
                  </Paragraph>
                </div>
                <Paragraph className="bio-wrap" style={{ marginTop: "6px" }}>
                  {user && user.get("bio")}
                </Paragraph>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={12}>
          <Row justify="end">
            <a href="/updateUser">
              <EditOutlined style={{ fontSize: "20px", color: "#fff" }} />
            </a>
          </Row>

          <Row justify="end" style={{ paddingTop: "14px" }}>
            <a href={user && user.get("twitter_link")}>
              <TwitterIcon
                className="twitter-icon"
                width={22}
                height={24}
                onClick={(e) => openLink(e)}
              />
            </a>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default NFTBalanceHeader;
