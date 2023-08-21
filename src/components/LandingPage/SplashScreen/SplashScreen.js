import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

const SplashScreen = () => {
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingContent(false);
    }, 3500);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: isLoadingContent ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          // marginTop: "-14rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TypeAnimation
          sequence={[
            "",
            100,
            "Linking",
            100,
            "Linking you",
            100,
            "Linking you to",
            100,
            "Linking you to web3",
            100,
            "Linking you to web3 .",
            100,
            "Linking you to web3 ..",
            100,
            "Linking you to web3 ...",
            100,
          ]}
          //  Continuing previous Text
          style={{
            // background: "#217AFF",
            background: "linear-gradient(to right, #217AFF 0%, #AD6EFF 100%)",
            WebkitBackgroundClip: "text",
            webkitTextFillColor: "transparent",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: "2rem",
          }}
          wrapper="h2"
          // repeat={Infinity}
        />
        <Spin size="large" style={{ marginTop: "1rem" }} />
      </div>
    </div>
  );
};

export default SplashScreen;
