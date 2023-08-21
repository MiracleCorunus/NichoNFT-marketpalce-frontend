import React, { useEffect, useState } from "react";
import nichoPlanet from "assets/images/new/NichoPlanet.pdf";
import { Spin, message } from "antd";
import { TypeAnimation } from "react-type-animation";
import { Helmet } from 'react-helmet';

const Whitepaper = () => {
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingContent(false);
    }, 8000);

    setTimeout(() => {
      message.info("Scroll down the image to view more");
    }, 11000);
  }, []);

  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", handleContextMenu);
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);

  return (
    <>
      <Helmet>
        <title>Nicho AI NFT | Whitepaper</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div
        className="center-page"
        style={{ marginTop: "5rem", position: "relative" }}
        // style={{ position: "relative", overflow: "hidden" }}
      >
        <embed
          style={{
            border: "1px solid rgb(83, 242, 212)",
            borderRadius: "2rem",
            boxShadow: "0px 0px 70px rgb(89 86 229 / 61.8%)",
          }}
          src={nichoPlanet + "#embedded=true&toolbar=0&navpanes=0"}
          type="application/pdf"
          height={735}
          width={"100%"}
        />
      </div>
      <div
        style={{
          position: "fixed",
          top: "50px",
          right: 0,
          left: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.9)",
          display: isLoadingContent ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
          // display: "none",
          //   overflow: "hidden",
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
          {/* <Typography.Title
            level={3}
            style={{
              background: "#217AFF",
              background: "linear-gradient(to right, #217AFF 0%, #AD6EFF 100%)",
              WebkitBackgroundClip: "text",
              webkitTextFillColor: "transparent",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: "2rem",
            }}
          >
            Linking you to web3
          </Typography.Title> */}
          <TypeAnimation
            sequence={[
              "Nicho",
              500,
              "Nicho is",
              500,
              "Nicho is Linking",
              500,
              "Nicho is Linking you",
              500,
              "Nicho is Linking you to",
              500,
              "Nicho is Linking you to web3",
              500,
              "Nicho is Linking you to web3 .",
              500,
              "Nicho is Linking you to web3 ..",
              500,
              "Nicho is Linking you to web3 ...",
              500,
              "Nicho is Linking you to web3 ....",
              500,
              "Nicho is Linking you to web3 .....",
              500,
              "Nicho is Linking you to web3 ......",
              500,
            ]}
            //  Continuing previous Text
            style={{
              background: "#217AFF",
              // eslint-disable-next-line no-dupe-keys
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
    </>
  );
};

export default Whitepaper;
