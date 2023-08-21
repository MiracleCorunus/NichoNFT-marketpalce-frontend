/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Input, Row, Typography, Button, Image, Empty, Affix } from "antd";
import { Helmet } from 'react-helmet';
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import CollectionCard from "components/CollectionCard";
import MultipleSlider from "components/common/MultipleSlider";
import SearchFilter from "components/common/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { getCollectionsBannerApi } from "api/common";
import { getCollectionsApi } from "api/collections";

import StarImg from "assets/images/new/star.png";
// import FilterIcon from 'assets/images/new/filter_icon.png';
import methodImg1 from "assets/images/new/grid_method.png";
import methodImg2 from "assets/images/new/grid_method2.png";
import methodActiveImg1 from "assets/images/new/grid_method_icon1.png";
import methodActiveImg2 from "assets/images/new/grid_method_icon2.png";
import InfiniteScroll from "react-infinite-scroll-component";

import "./Collections.scss";
import { useMediaQuery } from "react-responsive";
const { Search } = Input;
const { Title } = Typography;
const PageSize = 48;
const SmallPageSize = 96;

const FilterList = [
  { label: "Recently Created", value: "created_desc_v2" },
  { label: "Largest Volume", value: "trade_volume_desc_v2" },
  { label: "Hot Trading", value: "daily_trade_volume_desc_v2" },
  { label: "Price Low to high", value: "floor_price_desc_v2" },
  { label: "Price high to low", value: "floor_price_asc_v2" },
  { label: "Most favorited", value: "followers_desc_v2" },
  { label: "Oldest", value: "created_asc_v2" },
];

function Collections() {
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const { user, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const [collectionsBanner, setCollectionsBanner] = useState();
  const [collectionList, setCollectionList] = useState([]);
  const [cardColumn, setCardColumn] = useState([6, 6, 8, 12, 12, 24]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 1, pageSize: PageSize });
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState();
  const [sort, setSort] = useState("created_desc_v2");
  // eslint-disable-next-line no-unused-vars
  const [_listLoading, setListLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [smallView, setSmallView] = useState(false);

  const getCollectionList = async (
    sort,
    searchKwd,
    pageNo,
    smallView = false
  ) => {
    try {
      pageNo = pageNo || pageInfo.pageNo;
      const params = {
        pageNo: pageNo || pageInfo.pageNo,
        pageSize: smallView ? SmallPageSize : PageSize,
        sort: sort || null,
        search: searchKwd,
      };
      setListLoading(true);
      const { records, total } = await getCollectionsApi(params);
      setListLoading(false);
      // console.log("Collections: ", records);
      if (records) {
        let result = pageNo === 1 ? records : collectionList.concat(records);
        setCollectionList(result);
        setTotal(total);
        result.length < total ? setHasMore(true) : setHasMore(false);
      }
    } catch (err) {
      setListLoading(false);
      console.log(err);
    }
  };

  // 第一页
  const resetPageList = (sort, keyword, smallView) => {
    setPageInfo((prevState) => {
      return {
        ...prevState,
        pageNo: 1,
      };
    });
    getCollectionList(sort, keyword, 1, smallView);
  };

  const changeCardColumn = (columnArr, smallView) => {
    setCardColumn(columnArr);
    setSmallView(smallView);
    setHasMore(true);
    if (smallView) {
      setPageInfo(() => {
        return {
          pageNo: 1,
          pageSize: SmallPageSize,
        };
      });
    } else {
      setPageInfo(() => {
        return {
          pageNo: 1,
          pageSize: PageSize,
        };
      });
    }
    resetPageList(sort, keyword, smallView);
  };

  const getCollectionBanner = async () => {
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

  const requestList = () => {
    if (collectionList.length < total) {
      setPageInfo((prevState) => {
        return {
          ...prevState,
          pageNo: pageInfo.pageNo + 1,
        };
      });
      getCollectionList(sort, keyword, pageInfo.pageNo + 1, smallView);
    } else {
      setHasMore(false);
    }
  };

  // 排序
  const changeSort = (sort) => {
    setSort(sort);
    resetPageList(sort, keyword, smallView);
  };

  // 搜索事件
  const onSearch = (value) => {
    setKeyword(value);
    resetPageList(sort, value, smallView);
  };

  const keywordChange = (event) => {
    // setKeyword(event.target.value)
  };

  useEffect(() => {
    // if (!isInitialized) return;
    getCollectionList(sort);
    getCollectionBanner();
  }, [user, isInitialized]);

  return (
    <div className="collections-new page-content">
      <Helmet>
        <title>Nicho AI NFT | Collections</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className="top">
        <MultipleSlider collections={collectionsBanner} />
      </div>

      <Row justify="center" align="middle" style={{ margin: "14px 0" }}>
        <Image preview={false} width={53} height={50} src={StarImg} />
      </Row>
      <Row justify="center" align="middle" style={{ marginBottom: "17px" }}>
        <Title level={2} strong>
          {t("exploreCollections")}
        </Title>
      </Row>

      {isMobile ? (
        <>
          <Affix offsetTop={50}>
            <Row
              justify="center"
              align="middle"
              style={{ marginBottom: "32px", flexWrap: "nowrap" }}
            >
              <Search
                prefix={<SearchOutlined />}
                allowClear={true}
                placeholder={t("searchContent")}
                onChange={keywordChange}
                onSearch={onSearch}
                enterButton={t("search")}
                style={{ width: 457 }}
              />
              <SearchFilter
                changeSort={changeSort}
                filterList={FilterList}
                sort={sort}
              />
            </Row>
          </Affix>
        </>
      ) : (
        <>
          <Row
            justify="center"
            align="middle"
            style={{ marginBottom: "32px", flexWrap: "nowrap" }}
          >
            <Search
              prefix={<SearchOutlined />}
              allowClear={true}
              placeholder={t("searchContent")}
              onChange={keywordChange}
              onSearch={onSearch}
              enterButton={t("search")}
              style={{ width: 457 }}
            />
            <SearchFilter
              changeSort={changeSort}
              filterList={FilterList}
              sort={sort}
            />
          </Row>
        </>
      )}

      <Row justify="center" align="middle" style={{ marginBottom: "35px" }}>
        <Button
          className="grid-method"
          onClick={() => changeCardColumn([6, 6, 8, 12, 12, 24], false)}
        >
          <Image
            preview={false}
            width={24}
            height={24}
            src={cardColumn[1] === 6 ? methodImg1 : methodActiveImg1}
          />
        </Button>
        <Button
          className="grid-method"
          onClick={() => changeCardColumn([3, 3, 6, 8, 12, 12], true)}
        >
          <Image
            preview={false}
            width={24}
            height={24}
            src={cardColumn[1] === 3 ? methodImg2 : methodActiveImg2}
          />
        </Button>
      </Row>

      <InfiniteScroll
        dataLength={collectionList?.length || 0}
        next={requestList}
        hasMore={hasMore}
        endMessage={
          <p className="scroll-seen-all">
            {collectionList?.length > 0 && "Yay! You have seen it all"}
          </p>
        }
        loader={<h4 className="scroll-loading">Loading...</h4>}
      >
        <div className="view-body">
          {/* <Spin spinning={listLoading}> */}
          <Row
            gutter={smallView ? [20, 55] : [30, 55]}
            justify="left"
            style={{ padding: "10px" }}
          >
            {collectionList &&
              collectionList.map((collection, index) => (
                <Col
                  xxl={cardColumn[0]}
                  xl={cardColumn[1]}
                  lg={cardColumn[2]}
                  md={cardColumn[3]}
                  sm={cardColumn[4]}
                  xs={cardColumn[5]}
                  key={index}
                >
                  <CollectionCard collection={collection} />
                </Col>
              ))}
            {collectionList && !collectionList.length && (
              <Empty className="com-empty-center" />
            )}
          </Row>
          {/* </Spin> */}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Collections;