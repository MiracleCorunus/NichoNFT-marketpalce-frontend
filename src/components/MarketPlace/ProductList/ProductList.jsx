import { Typography, Button, Row, Col, Image, Input, Affix } from "antd";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import ProductCard from "components/ProductCard";
import SearchFilter from "components/common/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import "./ProductList.scss";
import { getNFTListApi } from "api/nftList";

import PhotosImg from "assets/images/new/marketPlace/photos.png";
import methodImg1 from "assets/images/new/grid_method.png";
import methodImg2 from "assets/images/new/grid_method2.png";
import methodActiveImg1 from "assets/images/new/grid_method_icon1.png";
import methodActiveImg2 from "assets/images/new/grid_method_icon2.png";

import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from "react-responsive";

const { Search } = Input;
const { Title } = Typography;
const PageSize = 48;
const SmallPageSize = 96;

const ProductList = () => {
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const { user, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [cardColumn, setCardColumn] = useState([6, 6, 8, 12, 12, 24]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 1, pageSize: PageSize });
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState();
  const [sort, setSort] = useState("created_desc_v2");
  const [listLoading, setListLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [smallView, setSmallView] = useState(false);

  // 分页
  const onPageChange = async (pageNo, pageSize) => {
    setPageInfo((prevState) => {
      return {
        ...prevState,
        pageNo,
        pageSize,
      };
    });
  };

  // 切换视图展示-重新拉起数据避免切换时数据对不上
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

  const requestList = () => {
    if (items.length < total) {
      setPageInfo((prevState) => {
        return {
          ...prevState,
          pageNo: pageInfo.pageNo + 1,
        };
      });
      getNFTList(sort, keyword, pageInfo.pageNo + 1, smallView);
    } else {
      setHasMore(false);
    }
  };

  // Get NFTs from API
  const getNFTList = async (sort, searchKwd, pageNo, smallView = false) => {
    try {
      pageNo = pageNo || pageInfo.pageNo;
      const params = {
        pageNo: pageNo,
        pageSize: smallView ? SmallPageSize : PageSize,
        recommended: false,
        sort: sort || null,
        search: searchKwd,
      };
      setListLoading(true);
      const { records, total } = await getNFTListApi(params);
      // console.log(records)

      setListLoading(false);
      if (records) {
        let result = pageNo === 1 ? records : items.concat(records);
        setItems(result);
        setTotal(total);
        result.length < total ? setHasMore(true) : setHasMore(false);
      }
    } catch (err) {
      setListLoading(false);
      console.log(err);
    }
  };

  // 搜索事件
  const onSearch = (value) => {
    setKeyword(value);
    setPageInfo((prevState) => {
      return {
        ...prevState,
        pageNo: 1,
      };
    });
    resetPageList(sort, value, smallView);
  };

  const keywordChange = (event) => {
    // setKeyword(event.target.value)
  };

  // 排序
  const changeSort = (sort) => {
    setSort(sort);
    resetPageList(sort, keyword, smallView);
  };

  // 第一页
  const resetPageList = (sort, keyword, smallView) => {
    setPageInfo((prevState) => {
      return {
        ...prevState,
        pageNo: 1,
      };
    });
    getNFTList(sort, keyword, 1, smallView);
  };

  useEffect(() => {
    getNFTList(sort);
  }, [user, isInitialized]);

  useEffect(() => {
    if (isMobile) {
      changeCardColumn([3, 3, 6, 8, 12, 12], true);
    } else {
      changeCardColumn([6, 6, 8, 12, 12, 24], false);
    }
  }, [isMobile]);

  return (
    <div className="product-list center-page com-black-bg2" id="scrollableDiv">
      <div>
        <Row justify="center" align="middle" style={{ marginBottom: "14px" }}>
          <Image preview={false} src={PhotosImg} />
        </Row>
        <Row justify="center" align="middle" style={{ marginBottom: "17px" }}>
          <Title level={2} strong>
            {t("exploreProduct")}
          </Title>
        </Row>
        {isMobile ? (
          <Affix offsetTop={50}>
            <Row
              justify="center"
              align="middle"
              style={{ marginBottom: "32px", flexWrap: "nowrap" }}
            >
              {/* <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} /> */}
              <Search
                prefix={<SearchOutlined />}
                placeholder={t("searchContent")}
                onChange={keywordChange}
                onSearch={onSearch}
                enterButton={t("search")}
                style={{ width: 457 }}
              />
              <SearchFilter changeSort={changeSort} sort={sort} />
            </Row>
          </Affix>
        ) : (
          <Row
            justify="center"
            align="middle"
            style={{ marginBottom: "32px", flexWrap: "nowrap" }}
          >
            {/* <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} /> */}
            <Search
              prefix={<SearchOutlined />}
              placeholder={t("searchContent")}
              onChange={keywordChange}
              onSearch={onSearch}
              enterButton={t("search")}
              style={{ width: 457 }}
            />
            <SearchFilter changeSort={changeSort} sort={sort} />
          </Row>
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
              src={cardColumn[1]===6 ? methodImg1 : methodActiveImg1}
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
              src={cardColumn[1]===3 ? methodImg2 : methodActiveImg2}
            />
          </Button>
        </Row>

        <InfiniteScroll
          dataLength={items?.length || 0}
          next={requestList}
          hasMore={hasMore}
          InfiniteScroll="0.7"
          endMessage={
            <p className="scroll-seen-all">
              {items?.length > 0 && "Yay! You have seen it all"}
            </p>
          }
          loader={<h4 className="scroll-loading">Loading...</h4>}
        >
          {/* <Spin spinning={listLoading}> */}
          <Row
            gutter={smallView ? [20, 30] : [30, 30]}
            justify="center"
            style={{ padding: "10px" }}
          >
            {items &&
              items.map((product, index) => (
                <Col
                  xxl={cardColumn[0]}
                  xl={cardColumn[1]}
                  lg={cardColumn[2]}
                  md={cardColumn[3]}
                  sm={cardColumn[4]}
                  xs={cardColumn[5]}
                  key={index}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
          </Row>
          {/* </Spin> */}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProductList;