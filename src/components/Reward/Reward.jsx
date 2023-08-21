import { useState, useEffect, Fragment } from 'react';
import { useMoralis } from 'react-moralis'
import { Typography, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import './Reward.scss';
import MyReward from './MyReward';
import RewardPool from './RewardPool';
import { Helmet } from 'react-helmet';
import UserRewardList from './UserRewardList';
import getCurrentWeekInfo from 'api/getCurrentWeekInfo';
import { styles } from './styles';

const { Title } = Typography;

const Reward = () => {
    const { user } = useMoralis();      
    const { t } = useTranslation();
    const [ curWeekData, setCurWeekData] = useState(0);
    // rewardsNo
    // beginDateOfWeek
    // endDateOfWeek

    useEffect(() => {
        const getWeekData = async () => {
            try {
                const weekData = await getCurrentWeekInfo();
                console.log("weekData: ",weekData)
                setCurWeekData(weekData)
            } catch (err) {
                console.log(err);
            }
        }

        getWeekData();
    }, [])

    return <div className='reward'>
        <Helmet>
        <title>Nicho AI NFT | Reward</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
        </Helmet>
        <div className="reward-header">
            <Title level={2} strong>{t("NichoNFTReward")}</Title>
        </div>
        <div className="page-content reward-content">
            <Fragment>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                    <Col xs={ 24 } sm={ 24 } md={ 12 } lg={12 } xl={ 12 } xxl={ 12 } style={styles.colMarginTop}>
                        <RewardPool curWeekData={ curWeekData }/>
                    </Col>
                    <Col xs={ 24 } sm={ 24 } md={ 12 } lg={12 } xl={ 12 } xxl={ 12 } style={styles.colMarginTop}>
                        { user && <MyReward curWeekData={ curWeekData }/> }
                    </Col>
                </Row>
            </Fragment>
            <Fragment>
                <Row gutter={16}>
                    <Col span={24}>
                        <UserRewardList curWeekData={ curWeekData }/>
                    </Col>
                </Row>
            </Fragment>
        </div>
    </div>
}

export default Reward;