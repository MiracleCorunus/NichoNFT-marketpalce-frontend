import { useState, useEffect, Fragment } from 'react';
import { Table, Card, Space, Button, Modal, Typography, message } from 'antd';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useTranslation } from 'react-i18next';
import getUserList from 'api/getUserList';
import { getCurrentWeekNumber, truncateHash } from 'helpers/Utils';
import { LeftOutlined, RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { styles } from './styles';
import './Reward.scss';
import getCheckAdmin from 'api/getCheckAdmin';
import { nichoRewardABI, rewardAddress } from 'contracts/constants';
import getRewardData from 'api/getRewardData';
const { Title, Paragraph } = Typography;

const UserRewardList = () => {
    const { user, isInitialized, isWeb3Enabled } = useMoralis();
    const { t } = useTranslation();

    const [ users, setUsers] = useState([]);
    const [ weekNum, setWeekNum] = useState(0);
    const [ isAdmin, setIsAdmin] = useState(false);
    const [ lastUpdatedNo, setLastUpdatedNo] = useState(0);

    const contractProcessor = useWeb3ExecuteFunction();

    useEffect(() => {
        const checkAdmin = async() => {
            try {
                if (!user) return;
                const result = await getCheckAdmin(user.get("ethAddress"));
                // console.log(result)
                setIsAdmin(result)
            } catch (err) {
                console.log(err)
            }
        }

        checkAdmin()
    }, [user]);

    useEffect(() => {
        const getLastRewardNo = () => {
            if (isInitialized && isWeb3Enabled && user) {
                fetchContractData();
            }
        }

        getLastRewardNo();
    }, [user, isInitialized, isWeb3Enabled])

    const fetchContractData = () => {
        try {
            const params = {
                contractAddress: rewardAddress,
                functionName: "lastUpdatedNo",
                abi: nichoRewardABI,
                params: {}
            }

            contractProcessor.fetch({
                params,
                onSuccess: async (result) => {
                    console.log("tx: ", result);
                    setLastUpdatedNo(result);
                },
                onError: (err) => {
                    console.log("Error: ", err.message);
                }
            })
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const columns = [
        {            
          title: t("no"),
          dataIndex: 'no',
          key: 'no',
        },
        {
          title: t("rewardNo"),
          dataIndex: 'rewardsNo',
          key: 'rewardsNo',
        },
        {
          title: t("userAddress"),
          dataIndex: 'userAddress',
          key: 'userAddress',
        },
        {
          title: t("rewardValue"),
          dataIndex: 'rewardValue',
          key: 'rewardValue',
        },
        {
          title: t("commissionValue"),
          dataIndex: 'currentCommissionValue',
          key: 'currentCommissionValue',
        },
        {
          title: t("percent"),
          dataIndex: 'percent',
          key: 'percent'
        },
    ];

    useEffect(() => {
        const weekNumber = getCurrentWeekNumber();
        // console.log(`The week number of the current date (${currentdate}) is ${result}.`);
        setWeekNum(weekNumber);
    }, []);

    useEffect(() => {
        const getUsersList = async () => {
            if (weekNum !== undefined && weekNum > 0) {
                try {
                    const usersList = await getUserList(weekNum);
                    if (!usersList) return null;

                    console.log("Reward List: ", usersList)

                    const dataList = [];
                    const len = usersList.length;
                    for (let i = 0; i < len; i++) {
                        const userReward = usersList[i];

                        dataList.push({
                            key: `${i}`,
                            no: `${i + 1}`,
                            rewardsNo: `${userReward.rewardsNo}`,
                            userAddress: `${ truncateHash(userReward.userAddress, 8, 6)}`,
                            rewardValue: `${userReward.rewardValue} Nicho`,
                            currentCommissionValue: `${userReward.currentCommissionValue} BNB`,
                            percent: `${(userReward.percent * 100).toFixed(3)} %`,

                        })
                    }
                    setUsers(dataList)
                } catch (err) {
                    console.log(err);
                }
            }
        }

        getUsersList();
    }, [weekNum])

    const prevWk = () => {
        if (weekNum > 2) {
            const newWkNum = weekNum - 1;
            setWeekNum(newWkNum);
        }
    }

    const nextWk = () => {
        if (weekNum < 52) {
            const newWkNum = weekNum + 1;
            setWeekNum(newWkNum);
        }
    }

    const WeekController = () => {
        return <Fragment>
            <Space align="center" style={styles.cardTag}>
                <LeftOutlined style={{ cursor: 'pointer' }} onClick={ prevWk } />
                <span> wk.{weekNum}</span>
                <RightOutlined style={{ cursor: 'pointer' }} onClick={ nextWk }/>
            </Space>
        </Fragment>
    }

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

    const updateRewardData = async () => {
        try {
            const rewardData = await getRewardData();
            console.log(rewardData)
            
            let rewardItems =[];
            for (let i = 0; i < rewardData.length; i++) {
                const item = rewardData[i];

                rewardItems.push({
                    no: item.no.toString(),
                    user: item.user,
                    amount: item.amount.toString(),
                    time: item.time.toString()
                })
            }

            // _rewardsItmes
            const params = {
                contractAddress: rewardAddress,
                functionName: "updateRewards",
                abi: nichoRewardABI,
                params: {
                    _rewardsItmes: rewardItems
                }
            }

            await contractProcessor.fetch({
                params,
                onSuccess: async (result) => {
                    console.log("tx: ", result);
                    showSuccess("Successfully upgraded!");
                },
                onError: (err) => {
                    console.log("Error: ", err);
                    showError(err)
                }
            })
        } catch (err) {
            console.log("Error: ", err);
        }

    }

    const showModal = () => {
        let msg = 'Are you sure to update the reward data?';
        if (lastUpdatedNo.toString().indexOf(weekNum.toString()) !== -1) {
            msg = 'You have already updated the reward data for this week. Do you want to update the data again?'
        }

        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: msg,
            okText: t("yes"),
            cancelButtonProps: { style: { color: '#d7a7e5'} },
            cancelText: t("neverMind"),
            onOk: updateRewardData
        });
    }

    return <div className='reward-list'>
        {
            isAdmin &&
            <div style={styles.adminButton}><Button onClick={ showModal }>
                {t("updateRewardData")}
            </Button></div>
        }

        <Card 
            headStyle={styles.cardHeader} 
            style={styles.card} 
            title={t("topUsers")}
            bordered={false} 
            extra={<WeekController/>}
        >
            <Table 
                dataSource={ users } 
                columns={ columns } 
                pagination={ false }
                scroll={{ x: 100 }}
            />
        </Card>
    </div>
}

export default UserRewardList;