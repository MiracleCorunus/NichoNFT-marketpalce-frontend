
import { useState, useEffect } from 'react';
import { Collapse, Spin , Table, message } from 'antd';
import { UnorderedListOutlined, LoadingOutlined  } from '@ant-design/icons';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useTranslation } from 'react-i18next';
import useGetBNBPrice, { getFilteredPrice } from 'hooks/useGetCoinPrice';
import { checkExpired, getUTCTimeStamp, sleep, truncateHash } from 'helpers/Utils';
import { 
  auctionABI, 
  auctionAddress,
  ERC721ABI
} from 'contracts/constants';
import { getAuctionBidsApi } from 'api/getNFTDetail';

const { Panel } = Collapse;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const showError = (msg) => {
  message.error(msg)
} 

const showInfo = (msg) => {
  message.success(msg)
}

const AcceptButton = ({ detail, bidder, onActionHandle }) => {  
  const { t } = useTranslation();
  const [ isAccept, setIsAccept] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const { web3 } = useMoralis(); 
  
  /// NFT is approved to marketplace
  const checkApproved = async (address, tokenId) => {
    try {
    // Check if item was listed or not
    const params = {
        contractAddress: address,
        functionName: "getApproved",
        abi: ERC721ABI,
        params: {
            tokenId,
        },
    };
    
    const approvedAddress = await contractProcessor.fetch({ params });      
    if (approvedAddress.toUpperCase() === auctionAddress.toUpperCase()) {
        return true;
    } else return false;
    } catch (err) {
    return false;
    }
  };

  /// NFT is approved to marketplace
  const isApproveForAll = async (address, creator) => {
    try {
      // Check if item was listed or not
      const params = {
          contractAddress: address,
          functionName: "isApprovedForAll",
          abi: ERC721ABI,
          params: {
              owner: creator,
              operator: auctionAddress
          },
      };
      console.log(params)
      
      const isApproved = await contractProcessor.fetch({ params });
      if (!isApproved) return false;
      return true;
    } catch (err) {
      return false;
    }
  };

  /// Approve
  const approveNFT = async () => {
    try {

      const isContract = (await web3.getCode(detail?.tokenAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferentNetwork"));
        return false;
      }

      // APPROVE
      const approveParams = {        
        contractAddress: detail?.tokenAddress,
        functionName: "approve",
        abi: ERC721ABI,
        params: {          
          to: auctionAddress,
          tokenId: detail?.tokenId
        }
      }

      const apvTx = await contractProcessor.fetch({ params: approveParams });
      if(apvTx) {
        await apvTx.wait(1);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("Approve Error:", err)
      return false;
    }
  }

  const acceptProcess = async () => {   
    const isAuctionAddressContract = (await web3.getCode(auctionAddress)).length > 5;
    if (!isAuctionAddressContract) {
      showError(t("detectedDifferentNetwork"));
      return false;
    }

    // Sell
    const params = {
      contractAddress: auctionAddress,
      functionName: "acceptBid",
      abi: auctionABI,
      params: {     
        tokenAddress: detail?.tokenAddress,
        tokenId: detail?.tokenId,
        bidder: bidder
      }
    }

    const acceptTx = await contractProcessor.fetch({ params, onError: (err) => { throw err.data } });
    if (acceptTx) {
      await acceptTx.wait(1);
      showInfo(t("yourNFTSoldOut"));
      await sleep(1000);
      onActionHandle();
    } else {
      showError(t("errorToListNFT"))
    }
  }

  const accept = async () => {
    try {
      setIsAccept(true);
      
      // APPROVE
      let isApproved1 = await checkApproved(detail.tokenAddress, detail.tokenId);
      let isApproved2 = await isApproveForAll(detail.tokenAddress, detail.creator);
      
      if(!isApproved1 && !isApproved2) {
        const result = await approveNFT();            
        if (!result) {
          showError(t("NFTTokenApprove"))
          setIsAccept(false);
          return;
        }
      }

      await acceptProcess();  
      
    } catch (err) {
      showError(`${t("failed")} ${err?.message}`);
    } finally {
      setIsAccept(false);
    }
  }

  return <button onClick={ accept }> {
    isAccept ? <Spin indicator={antIcon} /> : "Accept" }
  </button>;
}

const CancelButton = ({ detail, onActionHandle}) => {
  const [ isCancel, setIsCancel] = useState(false);
  const { t } = useTranslation();
  const contractProcessor = useWeb3ExecuteFunction();
  const { web3 } = useMoralis(); 
  
  const cancel = async () => {
    try {
      if(checkExpired(detail.expireAt) === false) {
        showError(t("notAbleCancel"));
        return;
      }

      const isContract = (await web3.getCode(auctionAddress)).length > 5;
      if (!isContract) {
        showError(t("detectedDifferentNetwork"));
        return;
      }

      setIsCancel(true);
      // Purchase
      const params = {
          contractAddress: auctionAddress,
          functionName: "cancelBid",
          abi: auctionABI,
          params: {          
            tokenAddress: detail.tokenAddress,
            tokenId: detail.tokenId
          }
      }

      const cancelTx = await contractProcessor.fetch({
        params,
        onError: (err) => { throw err?.data }
      });

      if(cancelTx) {
        await cancelTx.wait(1);
        showInfo(t("successfullyCanceled"));
        onActionHandle();
      } else {
        showError(t("cancelBid"))
      }
    } catch (err) {
      showError(`${t("failed")} ${err?.message}`);
    } finally {
      setIsCancel(false)
    }
  }

  return <button onClick={ cancel } >{
    isCancel ? <Spin indicator={antIcon} /> : t("cancel") }</button>;
}

// Auction Bids
const BidList = ({detail, topRefreshData, onBidderHandle}) => {
    const { user } = useMoralis();
    const { t } = useTranslation();
    const [ bidders, setBidders] = useState();
    const [refreshData, setRefreshData] = useState(false);

    const bnbPrice = useGetBNBPrice(1);

    const onActionHandle = () => {
      setRefreshData(!refreshData)
      onBidderHandle();
    }

    useEffect(() => {
      const fetchBidders = async () => {
        if(!detail) return;
        const params = {
          tokenAddress: detail.tokenAddress,
          tokenId: detail.tokenId
        };
        // console.log(detail);
        // const bidList = await Moralis.Cloud.run("getAuctionWholeBidders", params);
        const { records: bidList, total } = await getAuctionBidsApi(params);
        // console.log("Bidders: ", bidList, total);

        let tempBidders = [];
        for(let i = 0; i <total; i++) {
          const bidItem = bidList[i];
          if(bidItem.isCancel) continue;

          const price = bidItem.price;
          const usd_price = getFilteredPrice(bnbPrice * parseFloat(price)) 
          const bidder = bidItem.from;
          const truncated_bidder = truncateHash(bidder, 6, 2);
          // const transactionHash = bidItem.transaction;
          const auctionId = bidItem.auctionId;

          const currentTimestamp = parseInt(getUTCTimeStamp(0));
            
          let from = truncated_bidder;
          let actions = <></>;
          let is_expired = false;

          if(detail.auctionId !== auctionId) {
            is_expired=true;
          } else if(checkExpired(detail.expireAt)) {
            is_expired=true;
          }

          console.log(detail.auctionId, auctionId, currentTimestamp, detail.expireAt)

          if (user) {
            const userAddress = user.get("ethAddress");
            if (userAddress.toUpperCase() === bidder.toUpperCase()) {
              from = "you";
              actions = <CancelButton detail={ detail } onActionHandle={ onActionHandle }/>;
            } else if (userAddress.toUpperCase() === detail.creator.toUpperCase()) {
              if (!is_expired) {
                actions = <AcceptButton detail={ detail } onActionHandle={ onActionHandle } bidder={ bidder }/>;
              }              
            }
          } 

          const tempBidder = {
            key: i.toString(),
            price: `${price} BNB`,
            usd_price,
            from,
            actions,
            status: is_expired?t("expired"):""
          }

          tempBidders.push(tempBidder);
        }
        setBidders(tempBidders);
      }

      fetchBidders();
    }, [refreshData, detail, user, topRefreshData])
      
    const columns = [
        {
          title: t("price"),
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: t("USDPrice"),
          dataIndex: 'usd_price',
          key: 'usd_price',
        },
        {
          title: t("from"),
          dataIndex: 'from',
          key: 'from',
        },
        {
          title: '',
          dataIndex: 'actions',
          key: 'actions'
        },
        {
          title: '',
          dataIndex: 'status',
          key: 'status'
        }
    ];
      
    return <div className='offerlist'>
        <Collapse defaultActiveKey={['1']}>
            <Panel header="Auction bidders" key="1" extra={ <UnorderedListOutlined /> }>
                <Table 
                    dataSource={bidders} 
                    columns={columns} 
                    pagination={ false }
                    scroll={{ x: 100 }}
                />
            </Panel>
        </Collapse>
    </div>
};

export default BidList;