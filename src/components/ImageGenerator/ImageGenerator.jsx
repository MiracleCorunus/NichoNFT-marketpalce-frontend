/* eslint-disable array-callback-return */
/* eslint-disable no-throw-literal */
import {
  Button,
  Col,
  Input,
  Row,
  Typography,
  message,
  Space,
  Spin,
  Modal,
  Radio,
  Divider,
  Badge,
  Select,
  Popover,
  Tooltip,
} from "antd";
import { Helmet } from "react-helmet";
import ComeBackLater from "./ComeBackLater/ComeBackLater";
import React, { useEffect, useState } from "react";
import "./ImageGenerator.scss";
import baseImg from "./assets/NICHOAILOGO.svg";
import trendingIcon from "./assets/trending.png";
import exampleIcon from "./assets/exampleIcon.png";
import marketIcon from "./assets/marketIcon.png";
import { words } from "./assets/words.js";
import { WordCloud } from "@ant-design/plots";
import { saveAs } from "file-saver";
import { useMoralis, useWeb3Transfer, useMoralisQuery } from "react-moralis";
import { useTranslation } from "react-i18next";
import AiMintingForm from "./AiMintingForm/AiMintingForm";
import ImageCarousel from "./ImageCarousel/ImageCarousel";
import freeIcon from "./assets/freeIcon.png";
import { prompts, samples } from "./constants/prompts";
import { useMediaQuery } from "react-responsive";

// words cloud config
const config = {
  data: words,
  wordField: "name",
  weightField: "value",
  colorField: "name",
  // padding: 20,
  wordStyle: {
    fontFamily: "Roboto",
    fontSize: [16, 48],
    rotation: 0,
    padding: 6,
  },
  theme: "dark",
  random: () => 0.5,
  interactions: [
    {
      type: "element-active",
    },
  ],
  state: {
    active: {
      style: {
        lineWidth: 3,
      },
    },
  },
};

const ImageGenerator = () => {
  const { t } = useTranslation();

  const [keywords, setKeywords] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [imageList, setImageList] = useState();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAcceptingPayment, setIsAcceptingPayment] = useState(false);
  const { isAuthenticated, user, Moralis } = useMoralis();
  const { fetch: transferPayment } = useWeb3Transfer();
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
  const [paymentCurrency, setPaymentCurrency] = useState("BNB");
  const [isOpenMintModal, setIsOpenMintModal] = useState(false);
  const [hasCreditsLimitReached, setHasCreditsLimitReached] = useState(false);
  const [numberOfAiImages, setNumberOfAiImages] = useState(1);
  const [isUserFirstTime, setIsUserFirstTime] = useState(false);
  const [openExamplePrompt, setOpenExamplePrompt] = useState(false);

  const BNB_FEE = 0.001;
  const NICHO_FEE = 10;
  const PAYMENT_RECEIVER =
    process.env.REACT_APP_OPENAI_PAYMENT_RECEIVER_ADDRESS;
  const NICHO_TOKEN_ADDRESS = process.env.REACT_APP_NICHO_TOKEN_CONTRACT;
  const isMobile = useMediaQuery({ maxWidth: 991 });

  const { fetch: fetchAiGeneratorConfigs, data: aiGeneratorConfigs } =
    useMoralisQuery(
      "AiGeneratorConfigs",
      (query) => query.equalTo("address", PAYMENT_RECEIVER),
      [],
      { autoFetch: true }
    );

  useEffect(() => {
    if (aiGeneratorConfigs) {
      const currentUsage = aiGeneratorConfigs[0]?.get("current_usage");
      const maximumAllowance = aiGeneratorConfigs[0]?.get("maximum_allowance");
      if (currentUsage && maximumAllowance && currentUsage > maximumAllowance) {
        setHasCreditsLimitReached(true);
      }
    }
  }, [aiGeneratorConfigs]);

  const acceptPayment = async () => {
    try {
      if (user && isAuthenticated) {
        if (isUserFirstTime && numberOfAiImages === 1) {
          setIsOpenPaymentModal(false);
          generateAiImage();
          return;
        }

        setIsAcceptingPayment(true);

        if (paymentCurrency === "BNB") {
          await transferPayment({
            params: {
              type: "native",
              amount: isUserFirstTime
                ? Moralis.Units.ETH(BNB_FEE * numberOfAiImages - BNB_FEE)
                : Moralis.Units.ETH(BNB_FEE * numberOfAiImages),
              receiver: PAYMENT_RECEIVER,
            },
            onError: (error) => {
              message.error(error?.data?.message || error?.message);
              setIsAcceptingPayment(false);
            },
            onSuccess: async (tx) => {
              await tx.wait(1);
              message.success("Payment (BNB) is transferred");
              setIsOpenPaymentModal(false);
              setIsAcceptingPayment(false);
              generateAiImage();
            },
          });
        } else if (paymentCurrency === "NICHO") {
          await transferPayment({
            params: {
              type: "erc20",
              amount: isUserFirstTime
                ? Moralis.Units.Token(
                    NICHO_FEE * numberOfAiImages - NICHO_FEE,
                    9
                  )
                : Moralis.Units.Token(NICHO_FEE * numberOfAiImages, 9),
              receiver: PAYMENT_RECEIVER,
              contractAddress: NICHO_TOKEN_ADDRESS,
            },
            onError: (error) => {
              message.error(error?.data?.message || error?.message);
              setIsAcceptingPayment(false);
            },
            onSuccess: async (tx) => {
              await tx.wait(1);
              message.success("Payment (NICHO) is transferred");
              setIsOpenPaymentModal(false);
              setIsAcceptingPayment(false);
              generateAiImage();
            },
          });
        } else {
          throw "Payment is not supported yet";
        }
      } else {
        throw "Not Authorized";
      }
    } catch (error) {
      message.error(error);
      setIsAcceptingPayment(false);
    }
    //  finally {
    //   setIsAcceptingPayment(false);
    // }
  };

  const downloadImage = () => {
    if (imageUrl === "" || imageUrl === undefined) {
      message.error(t("noImageToDownload"));
      return;
    }
    saveAs(imageUrl, "myImage.png");
  };
  // console.log(user.get("openai_usage"));
  const checkIfPaymentRequired = async () => {
    if (keywords === "" || keywords === undefined) {
      message.error(t("keywordsIsEmpty"));
      return;
    }
    if (user && isAuthenticated) {
      if (user.get("openai_usage") === undefined) {
        user.set("openai_usage", 0);
        await user.save();
        setIsUserFirstTime(true);
        // generateAiImage();
        setIsOpenPaymentModal(true);
      } else if (user.get("openai_usage") === 0) {
        // generateAiImage();
        setIsUserFirstTime(true);
        setIsOpenPaymentModal(true);
      } else {
        setIsOpenPaymentModal(true);
      }
    }
  };
  // console.log(imageList);
  const generateAiImage = async () => {
    try {
      setIsGenerating(true);
      setImageList(undefined);
      setImageUrl(undefined);
      const params = {
        prompt: keywords,
        n: numberOfAiImages,
        size: "512x512",
        response_format: "b64_json",
      };
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify(params),
        }
      );
      const data = await response.json();

      if (data.data && data.data[0].b64_json) {
        // console.log(data.data[0].b64_json);
        if (data.data.length > 1) {
          let tempImageList = [];
          await Promise.all(
            data.data.map((image) => {
              tempImageList.push("data:image/png;base64," + image.b64_json);
            })
          );
          setImageUrl(tempImageList[0]);
          setImageList(tempImageList);
        } else {
          setImageUrl("data:image/png;base64," + data.data[0].b64_json);
        }
        user.increment("openai_usage", numberOfAiImages);
        await user.save();
        setIsUserFirstTime(false);
        setTimeout(() => setIsGenerating(false), 4000);

        const results = await fetchAiGeneratorConfigs();
        if (results[0]) {
          results[0]?.increment("current_usage", numberOfAiImages);
          await results[0]?.save();
        } else {
          console.log("Error to update ai generator config ");
        }
      } else {
        setIsGenerating(false);
        throw "Error to get image";
      }
    } catch (err) {
      message.error(err);
      setIsGenerating(false);
    }
  };
  const LoadingOverlay = () => {
    return (
      <div className="generator-overlay">
        <Typography.Title level={4} style={{ marginBottom: "2rem" }}>
          {t("imageGeneratingPleaseWait")}
        </Typography.Title>
        <Spin size="large" />
      </div>
    );
  };

  const LoginErrorOverlay = () => {
    return (
      <div className="generator-login-error">
        <Typography.Title level={4}>
          {t("pleaseConnectWallet")}
        </Typography.Title>
      </div>
    );
  };

  const selectNumberOfImageOptions = [
    {
      value: 1,
      label: isUserFirstTime ? (
        <span>
          <span>1</span>
          <span style={{ marginLeft: "1rem" }}>
            <img src={freeIcon} alt="free icon" width={24} height={24} />
          </span>
        </span>
      ) : (
        <span>1</span>
      ),
    },
    { value: 5, label: <span>5</span> },
    { value: 10, label: <span>10</span> },
  ];

  const aiMintingFormConfig = {
    setIsOpenMintModal,
    imageUrl,
  };

  const imageCarouselConfig = {
    imageList,
    setImageUrl,
  };

  const ExamplePrompts = () => (
    <div
      style={{
        width: "280px",
        height: "300px",
        color: "white",
        overflowY: "scroll",

        // border: "1px solid white",
      }}
    >
      {prompts.map((prompt, index) => (
        // <Tooltip title="Click to use the prompts" placement="bottom">
        <div
          onClick={() => {
            setKeywords(prompt);
          }}
          key={index}
          className="ai-prompt"
          style={{
            border: "0.5px solid rgb(83, 242, 212)",
            borderRadius: "0.5rem",
            padding: "1rem",
            margin: "0.5rem",
            background: "#16181A",
          }}
        >
          {prompt}
        </div>
        // </Tooltip>
      ))}
    </div>
  );
  return (
    <>
      <Helmet>
        <title>NichoNFT | AI NFT Generator</title>
        <meta
          name="description"
          content="AI-NFT generator powered by artificial intelligence."
        />
        <meta
          name="keywords"
          content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator"
        />
      </Helmet>
      <Modal
        centered
        open={isOpenMintModal}
        footer={false}
        closable={false}
        width={600}
      >
        <AiMintingForm {...aiMintingFormConfig} />
      </Modal>
      {/* {isOpenMintModal ? (
        <div className="ai-mint-form-overlay">
          <AiMintingForm {...aiMintingFormConfig} />
        </div>
      ) : null} */}
      <div className="center-page">
        <div className="generator-wrapper">
          {!isAuthenticated && !user && <LoginErrorOverlay />}
          {isGenerating && <LoadingOverlay />}
          <div className="top-content">
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                <img
                  src={imageUrl ?? baseImg}
                  alt="AI NFT"
                  className="content-image"
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                <div className="content-input">
                  <div>
                    <Typography.Title
                      className="content-input-title"
                      level={2}
                      // style={{ textAlign: "center", marginBottom: "0rem" }}
                    >
                      {t("aIImageGenerator")}
                    </Typography.Title>
                    <Typography.Paragraph
                      style={{
                        textAlign: "center",
                        color: "grey",
                      }}
                    >
                      {t("pleaseRead")}
                      <a
                        href="https://medium.com/@NichoNFT/ai-image-generator-launched-ca49fec755fb"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {t("hereAnEmpty")}
                      </a>{" "}
                      {t("forInstructionToUse")}
                    </Typography.Paragraph>
                    <Typography.Paragraph
                      style={{
                        textAlign: "center",
                        marginBottom: "1rem",
                        color: "grey",
                      }}
                    >
                      *{t("WeCharge")}
                      <strong style={{ color: "green" }}>
                        {BNB_FEE} BNB
                      </strong>{" "}
                      {t("or")}
                      <strong style={{ color: "green" }}>
                        {NICHO_FEE} NICHO
                      </strong>{" "}
                      {t("perImage")} (
                      <strong style={{ color: "white" }}>{t("free")}</strong>
                      {t("forTheFirstImage")})
                    </Typography.Paragraph>
                  </div>
                  <div className="content-input-example">
                    <div className="content-input-example-right">
                      <Tooltip title={"Click to see prompts"}>
                        <Popover
                          // style={{ overflow: "hidden" }}
                          // arrowPointAtCenter
                          content={<ExamplePrompts />}
                          color="black"
                          trigger={"click"}
                          open={openExamplePrompt}
                          onOpenChange={(visible) =>
                            setOpenExamplePrompt(visible)
                          }
                          placement="top"
                        >
                          <Button
                            style={{ height: "42px" }}
                            icon={
                              <img
                                src={exampleIcon}
                                width={24}
                                height={24}
                                alt="example icon"
                                style={{ marginRight: "1rem" }}
                              />
                            }
                          >
                            {t("promptExample")}
                          </Button>
                        </Popover>
                      </Tooltip>
                      <Popover
                        style={{ width: "300px" }}
                        color="black"
                        content={
                          <div style={{ color: "white", textAlign: "center" }}>
                            <p style={{ fontWeight: "900" }}>
                              {t("popoverComingSoon")}
                            </p>
                            <p style={{ fontWeight: "200" }}>
                              {t("popoverDescription")}
                            </p>
                          </div>
                        }
                      >
                        <Button
                          style={{ height: "42px" }}
                          icon={
                            <img
                              src={marketIcon}
                              width={24}
                              height={24}
                              alt="market icon"
                              style={{ marginRight: "1rem" }}
                            />
                          }
                          // disabled
                        >
                          {t("promptMarketplace")}
                        </Button>
                      </Popover>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography.Text
                          className="select-title-magic-text"
                          style={{ fontSize: "1rem" }}
                        >
                          {t("aiModel")}
                        </Typography.Text>
                        <Select
                          size="middle"
                          defaultValue={"dalle"}
                          style={{ width: "160px" }}
                          options={[
                            { value: "dalle", label: "DALL-E" },
                            {
                              value: "stableDiffusion",
                              label: "STABLE DIFFUSION",
                              disabled: true,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  {/* <img
                    src={aiImage}
                    alt="ai image"
                    width={"50%"}
                    height={"50%"}
                    style={{ marginBottom: "1rem" }}
                  /> */}
                  <div className="content-input-details">
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography.Title
                        level={5}
                        style={{ textAlign: "center" }}
                      >
                        {t("enter")} {t("keywords")} / {t("phrases")}
                      </Typography.Title>
                    </div>
                    <Input.TextArea
                      disabled={!isAuthenticated || !user}
                      showCount
                      maxLength={1000}
                      className="content-input-textarea"
                      placeholder={t(
                        "maximumWordsAre1000YouCanSeeSomeExamplesBelow"
                      )}
                      onChange={(e) => {
                        e.preventDefault();
                        setKeywords(e.target.value);
                      }}
                      value={keywords}
                    />
                    <Space
                      size={"large"}
                      style={{
                        marginTop: "16px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        onClick={checkIfPaymentRequired}
                        // onClick={generateAiImage}
                        loading={isGenerating}
                        disabled={!isAuthenticated || !user}
                      >
                        {t("generate")}
                      </Button>
                      <Button
                        onClick={downloadImage}
                        disabled={
                          imageUrl === "" ||
                          imageUrl === undefined ||
                          !isAuthenticated ||
                          !user
                            ? true
                            : false || isGenerating
                        }
                      >
                        {t("download")}
                      </Button>
                      <Badge count={<img src={trendingIcon} alt="AI NFT" />}>
                        <Button
                          type="primary"
                          onClick={() => setIsOpenMintModal(true)}
                          disabled={
                            imageUrl === "" ||
                            imageUrl === undefined ||
                            !isAuthenticated ||
                            !user
                              ? true
                              : false || isGenerating
                          }
                        >
                          {t("mintNow")}
                        </Button>
                      </Badge>
                    </Space>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="sample-gallery">
            <div
              style={{ textAlign: "center", fontSize: "2rem", width: "100%" }}
            >
              <Typography.Text className="select-title-magic-text">
                {t("sampleGallery")}
              </Typography.Text>
            </div>
            <div className="sample-gallery-image">
              {samples.map((sample, index) => (
                <Tooltip title={sample.prompt} key={index}>
                  <img
                    style={{
                      border: "1px solid gray",
                      borderRadius: "0.5rem",
                    }}
                    src={sample.image}
                    alt={sample.prompt}
                    width={isMobile ? 90 : 130}
                    height={isMobile ? 90 : 130}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="bottom-content">
            {!imageList ? (
              <WordCloud {...config} />
            ) : (
              <ImageCarousel {...imageCarouselConfig} />
            )}
          </div>
        </div>
        <Typography.Paragraph style={{ textAlign: "center" }}>
          *Powered by{" "}
          <a href="https://openai.com/" target={"_blank"} rel="noreferrer">
            OpenAi
          </a>
        </Typography.Paragraph>
      </div>
      <Modal centered open={isOpenPaymentModal} footer={false} closable={false}>
        <div className="select-payment-modal">
          <Typography.Title level={3}>
            {t("selectPaymentType")}
          </Typography.Title>
          {paymentCurrency === "BNB" ? (
            <Typography.Paragraph style={{ color: "grey" }}>
              Fee:{" "}
              {isUserFirstTime && numberOfAiImages === 1 ? (
                <strong style={{ color: "green", fontSize: "20px" }}>
                  FREE
                </strong>
              ) : isUserFirstTime ? (
                <strong style={{ color: "green", fontSize: "20px" }}>
                  {(BNB_FEE * numberOfAiImages - BNB_FEE).toFixed(3)} BNB
                </strong>
              ) : (
                <strong style={{ color: "green", fontSize: "20px" }}>
                  {BNB_FEE * numberOfAiImages} BNB
                </strong>
              )}
            </Typography.Paragraph>
          ) : (
            <Typography.Paragraph style={{ color: "grey" }}>
              Fee:{" "}
              {isUserFirstTime && numberOfAiImages === 1 ? (
                <strong style={{ color: "green", fontSize: "20px" }}>
                  FREE
                </strong>
              ) : isUserFirstTime ? (
                <strong style={{ color: "green", fontSize: "20px" }}>
                  {NICHO_FEE * numberOfAiImages - NICHO_FEE} NICHO
                </strong>
              ) : (
                <strong style={{ color: "green", fontSize: "20px" }}>
                  {NICHO_FEE * numberOfAiImages} NICHO
                </strong>
              )}
            </Typography.Paragraph>
          )}
          <Divider style={{ background: "grey" }} />
          <div className="select-payment-modal-content">
            <Radio.Group
              value={paymentCurrency}
              onChange={(e) => setPaymentCurrency(e.target.value)}
              disabled={isAcceptingPayment}
              // style={isAcceptingPayment && { color: "white" }}
            >
              <Space direction="vertical">
                <Radio value={"BNB"} className="select-payment-radio">
                  BNB
                </Radio>
                <Radio
                  value={"NICHO"}
                  // className="select-payment-radio-disabled"
                  className="select-payment-radio"
                  // disabled={isAcceptingPayment}
                >
                  NICHO
                </Radio>
              </Space>
            </Radio.Group>
            <div className="select-payment-modal-select">
              <Typography.Text
                style={{
                  color: "white",
                  marginBottom: "0.5rem",
                  fontSize: "14px",
                }}
              >
                {t("selectNoOfImages")}
              </Typography.Text>
              <Select
                disabled={isAcceptingPayment}
                // defaultValue={1}
                style={{ width: "100%" }}
                value={numberOfAiImages}
                onChange={(value) => setNumberOfAiImages(value)}
                options={selectNumberOfImageOptions}
              />
            </div>
          </div>
          <Space style={{ marginTop: "1rem" }} size="large">
            <Button
              onClick={() => setIsOpenPaymentModal(false)}
              disabled={isAcceptingPayment}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={acceptPayment}
              type="primary"
              loading={isAcceptingPayment}
              disabled={isAcceptingPayment}
            >
              {t("generate")}
            </Button>
          </Space>
        </div>
      </Modal>
      {hasCreditsLimitReached ? <ComeBackLater /> : null}
    </>
  );
};

export default ImageGenerator;
