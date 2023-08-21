import { useState, useEffect } from "react";
import { Button, Image, message, Row, Col } from "antd";
import { Typography } from "antd";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import { addFollowerApi } from "api/user";

import "./Card.scss";
import { ReactComponent as PlusIcon } from "assets/images/plus.svg";
import { Link } from "react-router-dom";
const { Title, Paragraph } = Typography;

function Card({ creator }) {
  const { t } = useTranslation();
  const [followCounter, setFollowCounter] = useState(0);
  const { user, Moralis } = useMoralis();
  const [followingStatus, setFollowingStatus] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const { username, avatar, bio, ethAddress, followers, following } = creator;

  // console.log(creator);

  const getSubText = (text, size) => {
    if (text?.length > size) {
      return text?.substring(0, size) + "...";
    }
    return text?.substring(0, size);
  };
  const showError = (msg) => {
    message.error(msg);
  };
  useEffect(() => {
    if (!creator) return;
    setFollowingStatus(following);
    setFollowCounter(followers);
  }, [creator]);

  const onClaim = async (isClaim) => {
    if (!user) return;
    try {
      if (ethAddress===user.get("ethAddress")) {
        showError(t("youCannotFollow"));
        return;
      }

      setFollowingStatus(isClaim);

      if (isClaim) {
        setFollowCounter(followCounter + 1);
      } else if (followCounter > 0) {
        setFollowCounter(followCounter - 1);
      }
      setWaiting(true);

      // save to database
      const params = {
        toUser: ethAddress,
      };
      await Moralis.Cloud.run("FollowUser", params);

      setWaiting(false);
    } catch (err) {
      console.log(err);
      showError(t("somethingWentWrong"));

      setFollowingStatus(!isClaim);

      if (isClaim) {
        setFollowCounter(followCounter - 1);
      } else {
        setFollowCounter(followCounter + 1);
      }

      setWaiting(false);
    }
  };
  return (
    <div className="wrapper-new">
      <div className="follow-item">
        <Link to={`/profile?address=${ethAddress}`}>
          <div className="owner-image">
            <Image
              preview={false}
              width={80}
              height={80}
              src={
                avatar && avatar.indexOf("http") != -1
                  ? avatar
                  : "/images/avatar.png"
              }
            />
          </div>
        </Link>
        <Link to={`/profile?address=${ethAddress}`}>
          <div>
            <Title level={5} className="title" ellipsis strong>
              {getSubText(username, 10)}
            </Title>
            {/* <Paragraph className="collect-count">
              {getSubText(bio, 10)}
            </Paragraph> */}
            <Paragraph className="collect-count">
              {t("followers")}: {followCounter}
            </Paragraph>
          </div>
        </Link>
        <div>
          {followingStatus ? (
            <Button
              goast="true"
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
              shape="round"
              className="follow-btn"
              onClick={() => onClaim(true)}
              loading={waiting}
            >
              {!waiting && <span>Follow</span>}{" "}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
