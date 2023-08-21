import { useEffect, useState } from "react";
import Introduction from "./Introduction";
import Collections from "./Collections";
import Guide from "./Guide";
import { useMoralis } from "react-moralis";
import "./LandingPage.scss";
import Partners from "./Partners";
import Youtube from "./Youtube";
import { getCollectionsBannerApi } from "api/common";
import SplashScreen from "./SplashScreen/SplashScreen";
import MobileApp from "./MobileApp/MobileApp";

function LandingPage() {
  const { user, Moralis, isInitialized } = useMoralis();

  const [collectionsBanner, setCollectionsBanner] = useState();

  useEffect(() => {
    // document.getElementById('autoplayVideo').play();

    if (!isInitialized) return;
    const getCollectionsBanner = async () => {
      try {
        const params = {
          pageNo: 1,
          pageSize: 5,
          recommendedSize: 3,
        };
        const { records } = await getCollectionsBannerApi(params);
        if (records) {
          setCollectionsBanner(records);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCollectionsBanner();
  }, [isInitialized]);

  return (
    <>
      <div className="landing-page">
        <Introduction />
        <Collections collections={collectionsBanner} />
        <MobileApp />
        <Youtube />
        <Guide />
        <Partners />
      </div>
      <SplashScreen />
    </>
  );
}

export default LandingPage;
