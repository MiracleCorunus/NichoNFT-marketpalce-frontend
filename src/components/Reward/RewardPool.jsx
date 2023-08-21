import { useState, useEffect, Fragment } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis'
import { Typography, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { nichoRewardABI, rewardAddress, server_url } from 'contracts/constants';
import './Reward.scss';
import { getCurrentWeekNumber } from 'helpers/Utils';
import getUserInfo from 'api/getUserInfo';
import { styles } from './styles';
const { Title, Paragraph } = Typography;


const RewardPool = () => {
    const { isInitialized, isWeb3Enabled } = useMoralis();
    const { t } = useTranslation();
    const [ weekNum, setWeekNum] = useState(0);
    // Total reward amount distributed so far
    const [ poolSize, setPoolSize] = useState(0);
    const contractProcessor = useWeb3ExecuteFunction();

    useEffect(() => {
        const weekNumber = getCurrentWeekNumber();
        // console.log(`The week number of the current date (${currentdate}) is ${result}.`);
        setWeekNum(weekNumber);
    }, []);

    useEffect(() => {
        const getPoolData = () => {
            console.log("INI:", isInitialized)
            if (isInitialized && isWeb3Enabled && weekNum !== undefined && weekNum > 0) {
                fetchContractData();
            }
        }

        getPoolData();
    }, [weekNum, isInitialized, isWeb3Enabled])

    const fetchContractData = () => {
        try {
            const params = {
                contractAddress: rewardAddress,
                functionName: "totalUserRewardsCount",
                abi: nichoRewardABI,
                params: {

                }
            }

            console.log(params)
            contractProcessor.fetch({
                params,
                onSuccess: async (result) => {
                    console.log("tx: ", result);
                    setPoolSize(result);
                },
                onError: (err) => {
                    console.log("Error: ", err.message);
                }
            })
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const ExtraTag = () => {
        return <span style={styles.cardTag}>
            wk. {weekNum}
        </span>
    }

    const InfoItem = ({title, val}) => {
        return <Space>
            <Title level={5} strong > { title } </Title>
            <Paragraph code={ true } type={ `secondary` }> { val }</Paragraph>
        </Space>
    }

    return <Fragment>
        <Card 
            headStyle={styles.cardHeader} 
            style={styles.card} 
            title={t("rewardPool")}
            bordered={false} 
            extra={ <ExtraTag /> }
        >
            <InfoItem 
                title={t("totalRewardAmount")}
                val={ `${poolSize} Nicho` } 
            />
        </Card>
    </Fragment>
}

export default RewardPool;