/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Tabs, Row, Col, Typography, Image, Input, Button, Pagination, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { useMoralis } from 'react-moralis';
import { useTranslation } from 'react-i18next';
import CollectionCard from 'components/CollectionCard';
import { SearchOutlined } from '@ant-design/icons';
import './MyCollections.scss';
import Back from 'assets/images/new/back.png';
import methodImg1 from 'assets/images/new/grid_method.png';
import methodImg2 from 'assets/images/new/grid_method2.png';
import methodActiveImg1 from 'assets/images/new/grid_method_icon1.png';
import methodActiveImg2 from 'assets/images/new/grid_method_icon2.png';
import CollectionImg from 'assets/images/new/my_collection_icon.png';
// import SearchFilter from 'components/common/SearchFilter'
import { getUserCollectionApi } from 'api/user';
import { getFavoriteCollections } from 'api/user';

const { Search } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

const MyCollections = () => {
  const { user } = useMoralis();
  const { t } = useTranslation();
  const [collections, setCollections] = useState();
  const [isFocus, setFocus] = useState(false);
  const [favorCollections, setFavorCollections] = useState();
  const [cardColumn, setCardColumn] = useState([6, 6, 8, 12, 12, 24]);
  const [pageInfo, setPageInfo] = useState({pageNo: 1, pageSize: 50});
  const [total, setTotal] = useState(0);
  // const [keyword, setKeyword] = useState();
  const [sort, setSort] = useState();
  const [listLoading, setListLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  // const searchInput = useRef()

  const onFocus = (value) => { setFocus(true) };
  
  const onBlur = (value) => { setFocus(false) };

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const getCollectionList = async (sort, searchKwd) => {    
    // 新接口
    setListLoading(true)
    try {
      const params = {
        ...pageInfo,
        ethAddress: user.get("ethAddress"),
        search: searchKwd,
        sort: sort || null
      }
      const { records, total } = await getUserCollectionApi(params);
      // console.log(records)
      if (records) {
        setCollections(records)
        setTotal(total)
      }
    } catch (err) {
      console.error(err)
    }
    setListLoading(false)
  }

  // 新接口
  const getUserFavCollection = async(sort, searchKwd) => {
    const params = {
      ...pageInfo,
      ethAddress: user.get("ethAddress"),
      search: searchKwd,
      sort: sort || null
    }
    setListLoading(true)
    const { records, total } = await getFavoriteCollections(params);
    if (records) {
      setFavorCollections(records)
      setTotal(total)
    }
  }

  // 排序
  const changeSort = (sort) => {
    setSort(sort)
    getCurrList(sort)
  }

  // 搜索事件
  const onSearch = (value) => {
    // setKeyword(value)
    getCurrList(null, value)
  };

  // 分页  
  const onPageChange = async(pageNo) => {
    setPageInfo((prevState) => {
      return {
        ...prevState,
        pageNo
      }
    })
  };

  const keywordChange = (event) => {
    // setKeyword(event.target.value)
  };

  const getCurrList = (sort, searchKwd) => {
    if (activeKey === 1) {
      getCollectionList(sort, searchKwd)
    } else {
      getUserFavCollection(sort, searchKwd)
    }
  }

  const changeCardColumn = (columnArr, smallView) => {
    setCardColumn(columnArr)
    if(smallView) {
        setPageInfo((prevState) => {
            return {
                ...prevState,
                pageSize: 100
            }
        })
    } else {
        setPageInfo((prevState) => {
            return {
                ...prevState,
                pageSize: 50
            }
        })
    }
  }

  useEffect(() => {
    if (!user) return;
  
    getCollectionList();
    getUserFavCollection()
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getCurrList()
  }, [pageInfo]);

  
  return (
    <div className="my-collections-new center-page">
      <Helmet>
        <title>Nicho AI NFT | My Collections</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className="collection-list">
        <div className='back-box' style={{ paddingRight: '20px' }} onClick={() => window.history.back(-1)}>
          <Image preview={false} src={Back} />
        </div>

        <Image rootClassName='collection-bg-img' preview={false} width={332} height={73} src={CollectionImg} />

        <Tabs onChange={onTabChange} activeKey={activeKey}>

          <TabPane tab={t("created")} key="1">
            <Title className="collection-title" level={2} strong>{t("myCollections")}</Title>

            <Row justify="center" align="middle" style={{marginBottom: '32px'}}>
              <Search
                prefix={<SearchOutlined />}
                className={{'group-focus' : isFocus}}
                allowClear={true} 
                placeholder={t("searchContent")}
                onChange={keywordChange} 
                onSearch={onSearch}
                onFocus={onFocus}
                onBlur={onBlur}
                enterButton={t("search")} 
                style={{ width: 457 }}/>
              {/* <SearchFilter changeSort={changeSort} sort={sort}/> */}
            </Row>

            <Row justify="center" align="middle" style={{marginBottom: '35px'}}>
              <Button className="grid-method" onClick={() => changeCardColumn([6, 6, 8, 12, 12, 24], false)} >
                <Image preview={false} width={24} height={24} src={cardColumn[1] === 6 ? methodImg1 : methodActiveImg1}/>
              </Button>
              <Button className="grid-method" onClick={() => changeCardColumn([3, 3, 6, 8, 12, 12], true)} >
                <Image preview={false} width={24} height={24} src={cardColumn[1] === 3 ? methodImg2 : methodActiveImg2}/>
              </Button>
            </Row>

            <div className='tab-content'>
              <Spin spinning={listLoading}>
                <Row gutter={[30, 30]} justify="center">
                    {collections && collections.map((collection, index) => (
                      <Col xxl={cardColumn[0]} xl={cardColumn[1]} lg={cardColumn[2]} md={cardColumn[3]} sm={cardColumn[4]} xs={cardColumn[5]} key={index}>
                          <CollectionCard collection={collection}/>
                      </Col>
                    ))}
                </Row>
                <Row style={{padding: '28px 0'}}>
                  <Pagination 
                    className="com-pagination" 
                    showQuickJumper 
                    current={pageInfo.pageNo} 
                    pageSize={pageInfo.pageSize}
                    pageSizeOptions={[16, 32, 50, 100]}
                    total={total} 
                    showTotal={total => `Total ${total} items`}
                    onChange={onPageChange} />
                </Row>
              </Spin>
            </div>
          </TabPane>
          <TabPane tab={t("favorited")} key="2">
            <Title className="collection-title" level={2} strong>{t("myCollections")}</Title>

            <Row justify="center" align="middle" style={{marginBottom: '32px'}}>
              <Search
                prefix={<SearchOutlined />}
                className={{'group-focus' : isFocus}}
                allowClear={true} 
                placeholder={t("searchContent")}
                onChange={keywordChange} 
                onSearch={onSearch}
                onFocus={onFocus}
                onBlur={onBlur}
                enterButton={t("search")} 
                style={{ width: 457 }}/>
              {/* <SearchFilter changeSort={changeSort} sort={sort}/> */}
            </Row>

            <Row justify="center" align="middle" style={{marginBottom: '35px'}}>
              <Button className="grid-method" onClick={() => changeCardColumn([6, 6, 8, 12, 12, 24], false)} >
                <Image preview={false} width={24} height={24} src={cardColumn[1] === 6 ? methodImg1 : methodActiveImg1}/>
              </Button>
              <Button className="grid-method" onClick={() => changeCardColumn([3, 3, 6, 8, 12, 12], true)} >
                <Image preview={false} width={24} height={24} src={cardColumn[1] === 3 ? methodImg2 : methodActiveImg2}/>
              </Button>
            </Row>

            <div className='tab-content'>
              <Spin spinning={listLoading}>
                <Row gutter={[30, 30]} justify="center">
                  {favorCollections && favorCollections.map((collection, index) => (
                    <Col xxl={cardColumn[0]} xl={cardColumn[1]} lg={cardColumn[2]} md={cardColumn[3]} sm={cardColumn[4]} xs={cardColumn[5]} key={index}>
                      <CollectionCard collection={collection}/>
                    </Col>
                  ))}
                </Row>
                <Row style={{padding: '28px 0'}}>
                  <Pagination 
                    className="com-pagination" 
                    showQuickJumper 
                    current={pageInfo.pageNo} 
                    pageSize={pageInfo.pageSize}
                    pageSizeOptions={[16, 32, 50, 100]}
                    total={total} 
                    showTotal={total => `Total ${total} items`}
                    onChange={onPageChange} />
                </Row>
              
              </Spin>

            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default MyCollections;