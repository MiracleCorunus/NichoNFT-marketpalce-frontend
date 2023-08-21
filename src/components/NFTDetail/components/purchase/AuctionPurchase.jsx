import React, { Fragment, useEffect, useState } from 'react'
import { Space, Button, Tooltip, Collapse, message, Modal, Typography, Input  } from 'antd';
import { WalletOutlined, ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useTranslation } from 'react-i18next';
import useGetBNBPrice, { getFilteredPrice } from 'hooks/useGetCoinPrice';
import { auctionABI, auctionAddress } from 'contracts/constants';
import { getDateFromTime, getUTCTimeStamp, sleep } from 'helpers/Utils';

const { Panel } = Collapse;
const { Title } = Typography;

const showError = (msg) => {
    message.error(msg)
}

const showInfo = (msg) => {
    message.success(msg)
}

const AuctionPurchase = ({  detail, onPlaceBidHandle }) => {
    const { t } = useTranslation();
    const [isPlaceBid, setIsPlaceBid] = useState(false);
    const [price, setPrice] = useState();
    const [isBidModal, setIsBidModal] = useState(false);
    const [hasAlreadyBid, setHasAlreadyBid] = useState(false);
    const [expired, setExpired] = useState(false);
    const { user, Moralis, web3 } = useMoralis(); 
    const contractProcessor = useWeb3ExecuteFunction();
    const bnbPrice = useGetBNBPrice(1);

    const placeBid = async () => {
        try {
            if (detail.auctionPrice >= price) {
                showError(t("bidPrice"));
                return;
            }
            const currentTimestamp = parseInt(getUTCTimeStamp(0));
            if(currentTimestamp >= detail.expireAt) {
                showError(t("auctionEnded"));
                return;
            }

            const isContract = (await web3.getCode(auctionAddress)).length > 5;
            if (!isContract) {
                showError(t("detectedDifferentNetwork"));
                return;
            }

            setIsPlaceBid(true);

            const params = {
                contractAddress: auctionAddress,
                functionName: "placeBid",
                abi: auctionABI,
                params: {     
                    tokenAddress: detail.tokenAddress,
                    tokenId: detail.tokenId
                },
                msgValue: Moralis.Units.ETH(price)
            }
            
            const bidTx = await contractProcessor.fetch({ params, 
                onError: (err) => { throw err; }
            });
            if(bidTx) {
                await bidTx.wait(1);
                showInfo(t("successfullyRequested"));
                setIsBidModal(false);
                await sleep(1000);
                onPlaceBidHandle();
            } else {
                showError(t("failePlace"));
            }
        } catch (err) {
            showError(`${t("failed")} ${err?.data?.message}`);
        } finally {
            setIsPlaceBid(false);
        }

    }

    useEffect(() => {
        const checkExpired = () => {
            if(!detail) return;
            setExpired(parseInt(detail.expireAt) < parseInt(getUTCTimeStamp(0)))
        }
        checkExpired();
    }, [detail])
    useEffect(() => {
        const checkAlreadyBidStatus = async () => {
            try {
                if (!detail || !user) return;
                const queryParams = {
                    tokenAddress: detail.tokenAddress,
                    tokenId: detail.tokenId
                };
          
                const alreadyAuctionBid = await Moralis.Cloud.run(
                    "checkAlreadyAuctionBid",
                    queryParams
                );
                
                setHasAlreadyBid(alreadyAuctionBid);
            } catch (err) {
                console.log(err);
            }
        }

        checkAlreadyBidStatus()
    }, [detail, user]);
    return (
        <Fragment>
            <Modal
                open={ isBidModal || isPlaceBid }
                footer={false}
                closable={false}
                centered={true}
            >
                <div className="form-group">
                    <Title level={3} type="secondary">{t("placeBid")}</Title>
                    
                    <div className="form-item">                 
                        <div className='nft-price'>   
                            <Title level={5} type="primary">{t("bidP")}</Title>
                            <div>
                                {/* <span className='token-amount'>
                                    { /*offerPrice} BNB
                                </span> */}
                                <span className='token-price'>
                                    { getFilteredPrice(bnbPrice * parseFloat(price))}
                                </span>
                            </div>
                        </div>
                        <Input 
                            type="number" placeholder={`${t("eg")} 0.01`}
                            value={ price } 
                            onChange={(e) => setPrice(e.target.value) }
                        />   
                    </div>
                    <Space>
                        <Button type="primary" size='small' onClick={ placeBid } loading={ isPlaceBid }>
                            { isPlaceBid ? "In progress" : "Place bid" }
                        </Button>   
                        
                        { !isPlaceBid && 
                            <Button type="link" size='large' onClick={() => setIsBidModal(false)}>
                                {t("neverMind")}
                            </Button> }                 
                    </Space>
                </div>
            </Modal>
            <Collapse 
                defaultActiveKey={['1']}            
                expandIcon={() => <ClockCircleOutlined />}
            >
                <Panel 
                    header={ 
                        <span style={{ color: expired? '#ff7e7e': 'white' }}>
                            { !expired? 
                            `${t("saleEnds")} (${ getDateFromTime(detail?.expireAt) })`: 
                            `${t("saleBeenEnded")} (${ getDateFromTime(detail?.expireAt) })` }
                        </span>
                    }
                    key="1" 
                    extra={ <Tooltip placement="top" title={`Auction sale`}><QuestionCircleOutlined /></Tooltip> }
                >
                    <span >Current price</span>
                    <div className='auction-price'>
                        <span className='token-amount'>
                            { detail?.auctionPrice } BNB
                        </span>
                        <span className='token-price'>
                            ({ getFilteredPrice(bnbPrice * parseFloat(detail?.auctionPrice))})
                        </span>
                    </div>

                    {
                        !expired ?
                        (<Space>
                            { 
                                detail &&
                                user && 
                                (detail.creator===user.get("ethAddress") || hasAlreadyBid) ?

                                <Tooltip placement="right" title={ hasAlreadyBid ? t("alreadySentBid") :t("ownThisItem")}>
                                    <Button type="primary" disabled>
                                        <WalletOutlined />
                                        {t("placeB")}
                                    </Button>
                                </Tooltip>

                                :

                                <Fragment>
                                    <Button type="primary" onClick={ () => setIsBidModal(true) }>
                                        <WalletOutlined />
                                        {t("placeB")}
                                    </Button>
                                </Fragment>
                            }
                        </Space>): <></>
                    }
                    
                </Panel>
            </Collapse>
        </Fragment>
    );
}

export default AuctionPurchase;