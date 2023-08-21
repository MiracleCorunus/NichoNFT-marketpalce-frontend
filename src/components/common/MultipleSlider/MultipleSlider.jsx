import { useEffect, useState } from "react";
import "./MultipleSlider.scss";
import { Image, Typography, Carousel } from "antd";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { throttle } from "helpers/Utils";
import { useMediaQuery } from "react-responsive";
const { Title, Paragraph } = Typography;

function MultipleSlider({ collections }) {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  const [active, setActiveNum] = useState(3);
  const { isInitialized } = useMoralis();
  const [list, setList] = useState([]);

  useEffect(() => {
    const init = () => {
      if (!collections) return;
      if (collections.length===0) return;
      setList(collections);
    };

    init();
  }, [collections]);

  useEffect(() => {
    const clientWidth = document.body && document.body.clientWidth;
    if (!isInitialized || !collections) return;
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
      <div className="multiple-slider-comp dark-black">
        <div className="collection-list">
          <i className="left-arrow" onClick={(e) => prevHandler(e)} />
          <i className="right-arrow" onClick={(e) => nextHandler(e)} />
          {list &&
            list.map((collection, idx) => (
              <div
                onClick={() => clickHandle(idx, active)}
                className={`collection-item ${
                  idx === active ? "active " : ""
                } ${filterPrev(idx, active) ? "prev " : ""} ${
                  filterNext(idx, active) ? "next " : ""
                }${filterPrev2(idx, active) ? "prev2 " : ""}${
                  filterNext2(idx, active) ? "next2 " : ""
                }`}
                key={idx}
              >
                <Link
                  to={`/viewCollection?collectionId=${collection.objectId}`}
                >
                  <div className="collection-item-top">
                    <Image
                      preview={false}
                      width={45}
                      height={45}
                      src={collection.logoImage}
                    />
                    <div className="collection-title">
                      <Title level={3} className="title" ellipsis={true}>
                        {collection.collectionTitle}
                      </Title>
                      <Paragraph className="description" ellipsis={{ rows: 2 }}>
                        {collection.collectionDescription}
                      </Paragraph>
                    </div>
                  </div>
                  <div className="collection-item-bot">
                    <Image
                      preview={false}
                      width={266}
                      height={266}
                      src={collection.tokenUriList[0]}
                    />
                    <div className="collection-item-right">
                      <Image
                        preview={false}
                        width={128}
                        height={128}
                        src={collection.tokenUriList[1]}
                      />
                      <Image
                        preview={false}
                        width={128}
                        height={128}
                        src={
                          collection.tokenUriList && collection.tokenUriList[2]
                        }
                      />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>

      <Carousel
        className="carousel-wrap"
        style={{
          width: "98%",
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
              <Link to={`/viewCollection?collectionId=${collection.objectId}`}>
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
                <Paragraph className="description">
                  {collection.collectionDescription}
                </Paragraph>
              </Link>
            </div>
          ))}
      </Carousel>
    </div>
  );
}

export default MultipleSlider;
