import { Row, Col, Typography, Button } from "antd";
import { useTranslation } from "react-i18next";
import "./FooterContent.scss";
import { ReactComponent as MediumIcon } from "assets/images/medium.svg";
import { ReactComponent as GithubIcon } from "assets/images/github.svg";
import { ReactComponent as TwitterIcon } from "assets/images/twitter.svg";
import { ReactComponent as TelegramIcon } from "assets/images/telegram.svg";
import { ReactComponent as CmcIcon } from "assets/images/cmc2.svg";
import { ReactComponent as DiscordIcon } from "assets/images/discord.svg";
import { ReactComponent as TiktokIcon } from "assets/images/tiktok.svg";
import Concept from "./Concept";
import { useHistory } from "react-router-dom";

const { Title, Paragraph } = Typography;

function FooterContent() {
  const history = useHistory();
  const { t } = useTranslation();
  const openLink = (link) => {
    link && window.open(link);
  };
  return (
    <div>
      <Concept />
      <div className="footer-content-new">
        <Row className="main">
          <Col xl={5} lg={5} md={10} sm={12} xs={12}>
            <Title level={3} strong>
              {t("info")}
            </Title>
            <div className="vertical-list">
              <Paragraph
                type="gray"
                className="link"
                onClick={() => openLink("http://doc.nichonft.com")}
              >
                {t("nichoBook")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() => openLink("/TermsAndConditions.pdf")}
              >
                {t("termsOfService")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://github.com/NichoNFT/NichoNFT-Documents/tree/main/Audit%20reports"
                  )
                }
              >
                {t("auditReport")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() => openLink("/PrivacyPolicy.pdf")}
              >
                {t("privacyPolicy")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() => openLink("https://t.me/NichoNFT")}
              >
                {t("reportArtist")}
              </Paragraph>
              {/* <Paragraph
                type="gray"
                className="link"
                onClick={() => openLink("https://medium.com/@NichoNFT")}
              >
                Blogs
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() => openLink("https://t.me/NichoNFT")}
              >
                NFT launchpad
              </Paragraph> */}
            </div>
          </Col>
          <Col xl={5} lg={5} md={10} sm={12} xs={12}>
            <Title level={3} strong>
              {t("tutorial")}
            </Title>
            <div className="vertical-list">
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/get-started-with-your-nicho-nft-journey-ceb3ec36802f"
                  )
                }
              >
                {t("getStarted")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/how-to-set-up-your-metamask-and-participate-in-nicho-nft-marketplace-6665a3c483b"
                  )
                }
              >
                {t("setupWallet")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/how-to-use-batch-mint-to-create-lots-of-nfts-in-nicho-nft-b48208c0a923"
                  )
                }
              >
                {t("batchMint")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/how-to-claim-vesting-tokens-from-vesting-smart-contract-108aca44231d"
                  )
                }
              >
                {t("claimVesting")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/how-the-own-collection-feature-works-on-nicho-c84f742d488c"
                  )
                }
              >
                {t("ownCollection")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/how-the-reward-system-v2-works-on-nicho-5767d8455b7"
                  )
                }
              >
                {t("getRewards")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/ai-image-generator-launched-ca49fec755fb"
                  )
                }
              >
                {t("aiGenerator")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://medium.com/@NichoNFT/login-to-nicho-with-your-social-media-accounts-now-b434dcf2ecf2"
                  )
                }
              >
                {t("socialAccountLogin")}
              </Paragraph>
            </div>
          </Col>
          <Col xl={5} lg={5} md={10} sm={12} xs={12}>
            <Title level={3} strong>
              {t("company")}
            </Title>
            <div className="vertical-list">
              <Paragraph
                type="gray"
                className="link"
                onClick={() => openLink("https://www.web3in.tech/")}
              >
                Web3in TL
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink(
                    "https://nichonft.gitbook.io/nicho-nft-whitepaper/overview-of-nicho-nft/the-team"
                  )
                }
              >
                Team
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() =>
                  openLink("https://www.linkedin.com/company/web3in-tech-lab/")
                }
              >
                LinkedIn
              </Paragraph>
            </div>
          </Col>
          <Col xl={5} lg={5} md={10} sm={12} xs={12}>
            <Title level={3} strong>
              {t("account")}
            </Title>
            <div className="vertical-list">
              <Paragraph
                type="gray"
                className="link"
                onClick={() => {
                  history.push("/updateUser");
                }}
              >
                {t("profile")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() => {
                  history.push("/myNfts");
                }}
              >
                {t("myNFTs")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() => {
                  history.push("/myCollections");
                }}
              >
                {t("myCollections")}
              </Paragraph>
              <Paragraph
                type="gray"
                className="link"
                onClick={() => {
                  history.push("/following");
                }}
              >
                {t("followers")}
              </Paragraph>
            </div>
          </Col>
          <Col className="col12" xl={4} lg={4} md={8} sm={24}>
            <div className="contact-wrap">
              <div className="social-group">
                <Button
                  shape="circle"
                  onClick={() => openLink("https://twitter.com/nichonft")}
                >
                  <TwitterIcon width={24} height={24} />
                </Button>
                <Button
                  shape="circle"
                  onClick={() => openLink("https://t.me/nichonft")}
                >
                  <TelegramIcon width={24} height={24} />
                </Button>
                <Button
                  className="medium-wrap"
                  shape="circle"
                  onClick={() => openLink("https://medium.com/@nichonft")}
                >
                  <MediumIcon width={24} height={24} />
                </Button>
                <Button
                  shape="circle"
                  onClick={() =>
                    openLink("https://github.com/Nichonft-organization")
                  }
                >
                  <GithubIcon width={26} height={26} />
                </Button>
                <Button
                  shape="circle"
                  onClick={() =>
                    openLink(
                      "https://coinmarketcap.com/community/profile/NichoNFT"
                    )
                  }
                >
                  <CmcIcon width={24} height={24} />
                </Button>
                <Button
                  shape="circle"
                  onClick={() => openLink("https://discord.gg/cHz9GV9gVN")}
                >
                  <DiscordIcon width={24} height={24} />
                </Button>
                <Button
                  shape="circle"
                  onClick={() => openLink("https://www.tiktok.com/@nicho_nft")}
                >
                  <TiktokIcon width={24} height={24} />
                </Button>
              </div>

              <div className="left">
                <Title level={3} strong>
                  {t("contactUs")}
                </Title>
                <div className="vertical-list">
                  <Paragraph type="gray">admin@nichonft.com</Paragraph>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="bottom" justify="center">
          <Paragraph>© Copyright 2022 - NichoNFT</Paragraph>
        </Row>
      </div>
    </div>
  );
}

export default FooterContent;
