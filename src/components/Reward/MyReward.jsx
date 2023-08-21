import { useState, useEffect, Fragment } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis'
import { Typography, Card, Button, Tooltip, Row, Col, Upload, Modal, Spin, message, Select, Space } from 'antd';
import { useTranslation } from "react-i18next"
import { nichoRewardABI, rewardAddress, server_url } from 'contracts/constants';
import './Reward.scss';
import { getCurrentWeekNumber, truncateHash } from 'helpers/Utils';
import getUserInfo from 'api/getUserInfo';
import { styles } from './styles';
const { Title, Paragraph } = Typography;


const MyReward = ({ curWeekData }) => {
    const { user, isWeb3Enabled, isInitialized } = useMoralis();
    const { t } = useTranslation();
    const [ weekNum, setWeekNum] = useState(0);
    const [waiting, setWaiting] = useState(false);

    const [userRewardAmount, setUserRewardAmount] = useState(0);
    const [ userData, setUserData] = useState();
    const contractProcessor = useWeb3ExecuteFunction();

    const showError = (msg) => {
        message.error(msg)
    }    

    const showSuccess = (msg) => {
        const secondsToGo = 3;
        const modal = Modal.success({
          title: `${t("success")}!`,
          content: msg
        });
    
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
    }

    useEffect(() => {
        const weekNumber = getCurrentWeekNumber();
        // console.log(`The week number of the current date (${currentdate}) is ${result}.`);
        setWeekNum(weekNumber);
    }, []);

    useEffect(() => {
        const getUserData = async () => {
            if (user && curWeekData !== undefined) {
                try {
                    const userData = await getUserInfo(user.get("ethAddress"), curWeekData.rewardsNo);
                    setUserData(userData)
                } catch (err) {
                    console.log(err);
                }
            }
        }

        getUserData();
    }, [curWeekData, user])

    useEffect(() => {
        const getUserRewardAmount = () => {
            if (isInitialized && isWeb3Enabled && user) {
                fetchContractData();
            }
        }

        getUserRewardAmount();
    }, [user, isInitialized, isWeb3Enabled])

    const fetchContractData = () => {
        try {
            const params = {
                contractAddress: rewardAddress,
                functionName: "getUserRewardsAmount",
                abi: nichoRewardABI,
                params: {
                    user: user.get("ethAddress")
                }
            }

            contractProcessor.fetch({
                params,
                onSuccess: async (result) => {
                    console.log("tx: ", result);
                    setUserRewardAmount(result);
                },
                onError: (err) => {
                    console.log("Error: ", err.message);
                }
            })
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const onClaim = async () => {
        try {
            setWaiting(true);
            const params = {
                contractAddress: rewardAddress,
                functionName: "claimRewards",
                abi: nichoRewardABI,
                params: {

                }
            }

            await contractProcessor.fetch({
                params,
                onSuccess: async (result) => {
                    console.log("tx: ", result);
                    showSuccess(t("youClaimed"));
                    setUserRewardAmount(0)
                    setWaiting(false);
                },
                onError: (err) => {
                    console.log("Error: ", err);
                    showError(err)
                    setWaiting(false);
                }
            })
        } catch (err) {
            console.log("Error: ", err);
            showError(err)
            setWaiting(false);
        }
    }

    const ExtraTag = () => {
        return <span style={styles.cardTag}>
            wk. {weekNum}
        </span>
    }

    const UserInfoItem = ({title, val}) => {
        return <Space>
            <Title level={5} strong > { title } </Title>
            <Paragraph code={ true } type={ `secondary` }> { val }</Paragraph>
        </Space>
    }

    return <Fragment>
        <Card 
            headStyle={styles.cardHeader} 
            style={styles.card} 
            title="My reward" 
            bordered={false} 
            extra={ <ExtraTag /> }
        >
            <Space direction={ 'vertical' }>
                <UserInfoItem title={t("yourAddress")} val={ user && truncateHash(user.get("ethAddress"), 6, 4) } />
                <UserInfoItem title="Your commission value: " val={ userData && userData.currentCommissionValue? `${userData.currentCommissionValue} BNB` : "0 BNB" } />
                <UserInfoItem title="Balance: " val={ userData && userData.rewardValue? `${userData.rewardValue} Nicho` : "0 Nicho" } />
                <UserInfoItem 
                    title={t("claimablePeriod")}
                    val={ `${ curWeekData && curWeekData.beginDateOfWeek } ~ ${ curWeekData && curWeekData.endDateOfWeek }` } 
                />
                
                <div>
                    { userData && userData.rewardValue > 0 && userRewardAmount.toString() === userData.rewardAmount.toString() &&
                        <Button onClick={() => onClaim()} loading={ waiting }>Claim</Button>
                    }
                    
                    { userData && userData.rewardValue > 0 && userRewardAmount.toString() !== userData.rewardAmount.toString() &&
                        <Title level={5} type={ `success` } strong> Claimed </Title>
                    }

                    { (!userData || !userData.rewardAmount || userData.rewardAmount===0) && 
                        <Tooltip placement="right" title={t("haveStillWeek")}>
                            <Button type="primary" disabled>
                                {t("claim")}
                            </Button>
                        </Tooltip>
                    }
                </div>
            </Space>
        </Card>
    </Fragment>
}

export default MyReward;