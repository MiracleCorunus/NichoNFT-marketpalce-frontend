import { useEffect, useState  } from 'react';
import { Row, Col, Tabs, Image } from 'antd';
import { useMoralis } from 'react-moralis';
import { useTranslation } from "react-i18next";
import Card from 'components/MarketPlace/RecommendedCreators/Card';
import './Following.scss';
import Back from 'assets/images/new/back.png';
import BgLine from 'assets/images/new/bg_line.png';
import Snail from 'assets/images/new/following/snail.png';
import Hearts from 'assets/images/new/following/hearts.png';
import { getFollowerUserApi, getFollowingUserApi } from 'api/user';

const { TabPane } = Tabs;


const Following = () => {
  const { user, Moralis, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();

  const getFollowing = async () => {  
    const params = {
        address: user.get("ethAddress")
    }   
    const { records, total } = await getFollowingUserApi(params);
    if (records) {
        setFollowing(records)
    }
 }
  const getFollowers = async () => {  
    const params = {
        address: user.get("ethAddress")
    }  
    const { records, total } = await getFollowerUserApi(params);
    if (records) {
        setFollowers(records)
    }
  }   

  useEffect(() => {
    if (!isInitialized || !user) return;
    getFollowers();
  }, [user, isInitialized]);

  
  useEffect(() => {
    if (!user) return;
    getFollowing();
  }, [user]);

  const onTabChange = (key) => {
    key==='1' ? getFollowers() : getFollowing()
  };
  
  return (
    <div className="my-followers-new center-page">
        <div>
            <div className='back-box' style={{ paddingRight: '20px' }} onClick={() => window.history.back(-1)}>
                <Image preview={false} src={Back} />
            </div>
            <Image rootClassName='snail-img' preview={false} width={332} height={73} src={Snail} />
            <Image rootClassName='hearts-img' preview={false} width={160} height={38} src={Hearts} />
            <Tabs defaultActiveKey="1" onChange={onTabChange}>
                <TabPane tab={t("myFollowers")} key="1">
                    <div className='tab-content' style={{backgroundImage: `url(${BgLine})`}}>
                        <Row gutter={[30, 30]}>
                            {followers && followers.map((follower, index) => (
                                <Col xl={3} lg={8} md={12} sm={24} key={index}>
                                    <Card creator={follower}/>
                                </Col>
                            ))}
                        </Row>
                        { !followers?.length && (<p className='empty-txt'>{t("noData")}</p>) }
                    </div>        
                    
                </TabPane>
                <TabPane className='tabs-tab2' tab={t("following")} key="2">
                    <div className='tab-content' style={{backgroundImage: `url(${BgLine})`}}>
                        <Row gutter={[0, 40]}>
                            {following && following.map((following, index) => (
                                <Col xl={3} lg={8} md={12} sm={24} key={index+'following'}>
                                    <Card creator={following}/>
                                </Col>
                            ))}
                        </Row>
                        { !following?.length && (<p className='empty-txt'>{t("noData")}</p>) }
                    </div>
                    
                </TabPane>
            </Tabs>
        </div>
    </div>
  );
}

export default Following;