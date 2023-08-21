import { useEffect, useState } from "react";
import "./ThreeSlider.scss";
import { Image, Typography, Carousel } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { throttle } from "helpers/Utils";
const { Title, Paragraph } = Typography;

function ThreeSlider({ collections }) {
  const { Moralis } = useMoralis();
  const { t } = useTranslation();
  const list = collections;
  const [active, setActiveNum] = useState(3);
  const { isInitialized } = useMoralis();

  useEffect(() => {
    const clientWidth = document.body && document.body.clientWidth;
    if (!isInitialized || !collections?.length) return;
    if (clientWidth < 992) {
      return;
    }
    const timer = setInterval(() => {
      changeNext();
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  });

  const prevHandler = (e) => {
    e.preventDefault();
    throttle(changePrev, 350, true);
  };

  const nextHandler = (e) => {
    e.preventDefault();
    throttle(changeNext, 350, true);
  };

  function changePrev() {
    if (active <= 0) {
      setActiveNum(list.length - 1);
      return;
    }
    setActiveNum(active - 1);
  }

  function changeNext() {
    if (active >= list.length - 1) {
      setActiveNum(0);
      return;
    }
    setActiveNum(active + 1);
  }

  function filterPrev(idx, active) {
    const len = list.length;
    let flag = false;
    if (idx === active - 1 || (active === 0 && idx === len - 1)) {
      flag = true;
    }
    return flag;
  }

  function filterPrev2(idx, active) {
    const len = list.length;
    let flag = false;
    if (
      idx === active - 2 ||
      (active === 0 && idx === len - 2) ||
      (active === 1 && idx === len - 1)
    ) {
      flag = true;
    }
    return flag;
  }

  function filterNext(idx, active) {
    const len = list.length;
    let flag = false;
    if (idx === active + 1 || (active === len - 1 && idx === 0)) {
      flag = true;
    }
    return flag;
  }

  function filterNext2(idx, active) {
    const len = list.length;
    let flag = false;
    if (
      idx === active + 2 ||
      (active === len - 2 && idx === 0) ||
      (active === len - 1 && idx === 1)
    ) {
      flag = true;
    }
    return flag;
  }

  const clickHandle = (idx, active) => {
    if (filterPrev(idx, active) || filterPrev2(idx, active)) {
      changePrev();
    } else if (filterNext(idx, active) || filterNext2(idx, active)) {
      changeNext();
    }
  };

  return (
    <div>
      <div className="three-slider-comp dark-black">
        <div className="collection-list">
          <i className="left-arrow" onClick={(e) => prevHandler(e)} />
          <i className="right-arrow" onClick={(e) => nextHandler(e)} />
          {list?.length &&
            list.map((collection, idx) => (
              <div
                onClick={() => clickHandle(idx, active)}
                className={`collection-item ${
                  idx === active ? "active " : ""
                } ${filterPrev(idx, active) ? "prev " : ""} ${
                  filterNext(idx, active) ? "next " : ""
                }`}
                key={idx}
              >
                <Link
                  to={`/viewCollection?collectionId=${collection.objectId}`}
                >
                  <div className="collection-item-bot">
                    <div>
                      <Image
                        preview={false}
                        width={266}
                        height={266}
                        src={collection.tokenUriList[0]}
                      />

                      <div className="collection-item-info">
                        <img src={collection.logoImage} alt="Nicho AI NFT" />
                        <div className="collection-item-title">
                          <Paragraph
                            ellipsis
                            strong
                            style={{
                              maxWidth: "190px",
                              fontSize: "32px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {collection.collectionTitle}
                          </Paragraph>
                          <span style={{ fontSize: "8px", color: "grey" }}>
                            {t("floorPrice")}{" "}
                            {Moralis.Units.FromWei(
                              collection.floorPrice.toString()
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="collection-item-right">
                      <Image
                        preview={false}
                        width={170}
                        height={170}
                        src={collection.tokenUriList[1]}
                      />
                      <Image
                        preview={false}
                        width={170}
                        height={170}
                        src={collection.tokenUriList[2]}
                      />
                      <Image
                        preview={false}
                        width={170}
                        height={170}
                        src={collection.tokenUriList[3]}
                      />
                      <Image
                        preview={false}
                        width={170}
                        height={170}
                        src={collection.tokenUriList[4]}
                      />
                    </div>
                  </div>
                  {/* <div className="collection-item-info">
                    <img src={collection.logoImage} alt="Nicho AI NFT" />
                    <span>{collection.collectionTitle}</span>
                  </div> */}
                </Link>
              </div>
            ))}
        </div>
      </div>

      <Carousel
        className="carousel-wrap"
        style={{
          height: "415px",
          textAlign: "center",
          boxShadow: "0px 0px 20px rgb(89 86 229 / 61.8%)",
          margin: "2rem auto",
          padding: "2rem",
          borderRadius: "1rem",
        }}
      >
        {collections &&
          collections.map((collection, index) => (
            <div className="wrapper" key={index}>
              <Link to="/nftDetail">
                <div className="collection-img">
                  <Image
                    height={305}
                    preview={false}
                    src={collection.logoImage}
                    style={{ borderRadius: "1rem" }}
                  />
                </div>
                <Title level={3} className="title">
                  {collection.collectionTitle}
                </Title>
                <Paragraph className="description" ellipsis>
                  {collection.collectionDescription}
                </Paragraph>
              </Link>
            </div>
          ))}
      </Carousel>
    </div>
  );
}

export default ThreeSlider;
