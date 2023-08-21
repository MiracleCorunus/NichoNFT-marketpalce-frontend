import { Typography, Button, Row, Col, message } from "antd";
import "./ProfileHeader.scss";
import { useLocation } from "react-router";
import { ReactComponent as TwitterIcon } from "assets/images/twitter.svg";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { truncateHash } from "helpers/Utils";
import { getUserDetailApi } from "api/user";

const { Title, Paragraph } = Typography;

const showError = (msg) => {
  message.error(msg);
};

function ProfileHeader() {
  const { user, isInitialized, Moralis } = useMoralis();
  const { t } = useTranslation();
  const [avatarURL, setAvatarURL] = useState("/images/avatar.png");
  const { search } = useLocation();
  const [userData, setUserData] = useState();
  const [followCounter, setFollowCounter] = useState(0);
  const [followingStatus, setFollowingStatus] = useState(false);
  const [waiting, setWaiting] = useState(false);
  // const [claimFavorite, setClaimFavorite] = useState(false);
  const [ bannerURL, setBannerURL ] = useState(null)

  const openLink = (e) => {
    e.preventDefault();
    const webLink = userData.websiteLink;
    if (webLink && webLink.length > 0) {
      window.location.href = webLink;
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (!isInitialized) return;

      try {
        const address = new URLSearchParams(search).get("address");
        if (!address) {
          window.history.back(-1)
          return;
        }

        const userAddress = user ? user.get("ethAddress") : null;
        const params = {
          userAddress: userAddress,
          ethAddress: address,
        };
        const data = await getUserDetailApi(params);
        console.log(data);

        if (data) {
          if (data.avatar?.length > 0) {
            setAvatarURL(data.avatar);
          }
          if (data.banner?.length > 0) {
            setBannerURL(data.banner);
          } else {
            setBannerURL('/images/rec-collect-2.jpg');
          }
          setUserData(data);
          setFollowingStatus(data.following);
          setFollowCounter(data.followers);
        }
      } catch (err) {
        console.error("getUserDetail:", err);
      }
    };
    getData();
  }, [isInitialized, user, search]);

  const onClaim = async (isClaim) => {
    if (!user || waiting) return;
    const address = new URLSearchParams(search).get("address");
    if (!address) return;

    if (address===user.get("ethAddress")) {
      showError(t("youCannotFollow"));
      return;
    }
    try {
      setWaiting(true);
      setFollowingStatus(isClaim);

      if (isClaim) {
        setFollowCounter(followCounter + 1);
      } else if (followCounter > 0) {
        setFollowCounter(followCounter - 1);
      }
      // save to database
      const params = {
        toUser: address,
      };
      await Moralis.Cloud.run("FollowUser", params);
    } catch (err) {
      console.log(err);
      showError(t("somethingWentWrong"));

      setFollowingStatus(!isClaim);

      if (isClaim) {
        setFollowCounter(followCounter - 1);
      } else {
        setFollowCounter(followCounter + 1);
      }
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="nft-balance-header-new">
      <div className="bg-content" style={{backgroundImage: `url(${bannerURL})`}}>
      </div>

      <Row className='personal-content' gutter={[30]} align="middle" justify="space-between">
        <Col sm={12}>
          <div className='display-flex'>
            <div className="user-avatar">
              <img src={avatarURL} alt="Nicho AI NFT"/>

              {followingStatus ? (
              <Button
                goast="true"
                type="primary"
                shape="round"
                className="follow-btn"
                onClick={() => onClaim(false)}
                loading={waiting}
              >
                {!waiting && <span>Unfollow</span>}{" "}
              </Button>
            ) : (
              <Button
                goast="true"
                type="primary"
                shape="round"
                className="follow-btn"
                onClick={() => onClaim(true)}
                loading={waiting}
              >
                {!waiting && (
                  <span>
                    Follow
                  </span>
                )}{" "}
              </Button>
            )}
            </div>
            <div>
              <div className='user-name'>
                <Title ellipsis level={5}>
                  {userData &&
                    (userData.username.length > 10
                      ? truncateHash(userData.username, 6, 4)
                      : userData.username)}
                </Title>
                <div className='items-center' style={{ marginTop: '6px' }}>
                  {/* {claimFavorite ? (
                    <HeartOutlined
                      style={{
                        fontSize: "18px",
                        color: "#eb2f96",
                        cursor: "pointer",
                      }}
                      onClick={onClaim}
                    />
                  ) : (
                    <HeartOutlined
                      style={{
                        fontSize: "18px",
                        color: "#aaa",
                        cursor: "pointer",
                      }}
                      onClick={onClaim}
                    />
                  )}

                  <span style={{color: '#fff', fontSize: '12px', padding: '0 12px 0 6px'}}>{ followCounter }</span> */}
                  <span style={{color: '#999', fontSize: '12px', padding: '0 12px 0 0'}}>
                    {t("myFollowers")}：
                    <span style={{color: '#fff'}}>{ followCounter }</span>
                  </span>
                  <Paragraph ellipsis className='user-address'>{truncateHash(userData && userData.ethAddress, 6, 4)}</Paragraph>
                </div>
                <Paragraph className="bio-wrap" style={{ marginTop: '6px' }}>{userData && userData.bio}</Paragraph>
              </div>
            </div>

          </div>

        </Col>
        <Col sm={12}>
          <Row justify="end" style={{paddingTop: '14px'}}>
            <a href={ user && user.get("twitter_link")}>
              <TwitterIcon className="twitter-icon" width={22} height={24} onClick={(e) => openLink(e) }/>
            </a>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ProfileHeader;
