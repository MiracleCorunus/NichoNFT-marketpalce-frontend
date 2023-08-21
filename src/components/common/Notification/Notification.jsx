import { SendOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next"
import CloseButton from "assets/images/new/notification/notification_close_button.svg";
import ErrorIcon from "assets/images/new/notification/notification_error_icon.svg";
import successIcon from "assets/images/new/notification/notification_success_icon.svg";
import React, { useEffect, useState } from "react";
import "./Notification.scss";

const Notification = ({ type, header, message, isVisible, action }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isVisible);
  const [secondCounter, setSecondCounter] = useState(5);

  // console.log(secondCounter);

  const handleClose = () => {
    setVisible(false);
    setSecondCounter(0);
    action();
  };

  useEffect(() => {
    if (type !== "error") {
      let interval = setInterval(() => {
        setSecondCounter((prev) => {
          if (prev === 0) {
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // close the modal when the timer hit 0
  useEffect(() => {
    if (secondCounter === 0) {
      setVisible(false);
      action();
    }
  }, [secondCounter]);

  return (
    <div
      className="app__notification_modal"
      style={{ display: visible ? "block" : "none" }}
    >
      <div className="app__notification_notify-container">
        <div className="app__notification_notify-header">
          <Tooltip placement="top" title="Close" zIndex={9999}>
            <img
              src={CloseButton}
              alt="close button"
              width={24}
              height={24}
              className="app__notification_notify-img"
              onClick={handleClose}
            />
          </Tooltip>
          <div>{header}</div>
        </div>
        <div className="app__notification_notify-content">
          {type === "error" ? (
            <img src={ErrorIcon} alt="Nicho AI NFT" width={128} height={128} />
          ) : (
            <img src={successIcon} alt="Nicho AI NFT" width={128} height={128} />
          )}
          {type !== "error" ? (
            <div className="app__notification_notify-message">{message}</div>
          ) : (
            <div
              className="app__notification_notify-message"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
          {type !== "error" && (
            <button
              className="app__notification_notify-button"
              onClick={handleClose}
            >
              {t("refresh")} ({secondCounter})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
