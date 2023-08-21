
import { useState, useEffect } from 'react';
import { Collapse, Spin , Table, message } from 'antd';
import { UnorderedListOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useTranslation } from 'react-i18next';
import useGetBNBPrice, { getFilteredPrice } from 'hooks/useGetCoinPrice';
import { sleep, truncateHash } from 'helpers/Utils';
import { 
  auctionABI, 
  auctionAddress,
  ERC721ABI,
  marketplaceABI,
  marketplaceAddress
} from 'contracts/constants';
import { getOffersApi } from 'api/getNFTDetail';
const { Panel } = Collapse;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const showError = (msg) => {
  message.error(msg)
} 

const showInfo = (msg) => {
  message.success(msg)
}


const AcceptButton = ({ detail, offerCreator, onAcceptOfferHandle }) => {  
  const [ isAccept, setIsAccept] = useState(false);
  const { web3 } = useMoralis(); 
  const { t } = useTranslation();


  const contractProcessor = useWeb3ExecuteFunction();
  
  const approveNFT = async () => {
    try {
      const isTokenContract = (await web3.getCode(detail?.tokenAddress)).length > 5;
      if (!isTokenContract) {
        showError(t("detectedDifferentNetwork"));
        return false;
      }
      // APPROVE
      const approveParams = {        
        contractAddress: detail?.tokenAddress,
        functionName: "approve",
        abi: ERC721ABI,
        params: {          
            to: marketplaceAddress,
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
      console.log(t("approveError"), err)
      return false;
    }
  }
  // Accept Offer process
  const acceptProcess = async () => {
    const isMarketContract = (await web3.getCode(marketplaceAddress)).length > 5;
    if (!isMarketContract) {
      showError(t("detectedDifferentNetwork"));
      return false;
    }
    // Purchase
    const params = {
      contractAddress: marketplaceAddress,
      functionName: "acceptOffer",
      abi: marketplaceABI,
      params: {          
        tokenAddress: detail?.tokenAddress,
        tokenId: detail?.tokenId,
        offerCreator
      }
    }


    const acceptTx = await contractProcessor.fetch({ params });
    if (acceptTx) {
      await acceptTx.wait(1);
      showInfo(t("yourNFTSoldOut"));
      await sleep(1000);
      onAcceptOfferHandle();
    } else {
      showError(t("errorToListNFT"));
    }
  }

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
    if (approvedAddress.toUpperCase() === marketplaceAddress.toUpperCase()) {
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
              operator: marketplaceAddress
          },
      };
      const isApproved = await contractProcessor.fetch({ params });
      if (!isApproved) return false;
      return true;
    } catch (err) {
      return false;
    }
  };

  // Accept offer
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
    isAccept ? <Spin indicator={antIcon} /> : t("accept") }
  </button>;
}

const CancelButton = ({ detail, onCancelOfferHandle }) => {
  const [ isCancel, setIsCancel] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const { web3 } = useMoralis();
  const { t } = useTranslation();

  const cancel = async () => {
    try {
      if (isCancel) return false;

      const isMarketContract = (await web3.getCode(marketplaceAddress)).length > 5;
      if (!isMarketContract) {
        showError(t("detectedDifferentNetwork"));
        return false;
      }

      setIsCancel(true);
      // Cancel purchase
      const params = {
        contractAddress: marketplaceAddress,
        functionName: "cancelOffer",
        abi: marketplaceABI,
        params: {          
          tokenAddress: detail?.tokenAddress,
          tokenId: detail?.tokenId
        }
      }

      const cancelTx = await contractProcessor.fetch({ params });

      if(cancelTx) {
        await cancelTx.wait(1);
        showInfo(t("offerCanceled"));
        onCancelOfferHandle();
      } else showError(t("failedCancel"));
    } catch (err) {
      showError(`${t("failed")} ${err?.message}`);
    } finally {
      setIsCancel(false)
    }
  }

  return <button onClick={ cancel } >{
    isCancel ? <Spin indicator={antIcon} /> : t("cancel") }</button>;
}

const OfferList = ({detail, topRefreshData, onOfferHandle}) => {
    const { user } = useMoralis(); 
    const { t } = useTranslation();
    const [ offers, setOffers] = useState();
    const [refreshData, setRefreshData] = useState(false);

    const bnbPrice = useGetBNBPrice(1);

    const onCancelOfferHandle = () => {
      setRefreshData(!refreshData)
      onOfferHandle();
    }

    const onAcceptOfferHandle = () => {
      setRefreshData(!refreshData)
      onOfferHandle();
    }

    useEffect(() => {
      const fetchOffers = async () => {
        if(!detail) return;
        const params = {
          pageNo: 1,
          pageSize: 20,
          tokenAddress: detail.tokenAddress,
          tokenId: detail.tokenId
        };
        // console.log(detail);
        // const offerList = await Moralis.Cloud.run("getOffers", params);
        const { records: offerList, total} = await getOffersApi(params);
        // console.log("Offers: ", offerList);

        let tempOffers = [];
        for(let i = 0; i < total; i++) {
          // if (!offerList[i].isCancel) continue;
          const price = offerList[i].price;
          const usd_price = getFilteredPrice(bnbPrice * parseFloat(price)) 
          const creator = offerList[i].from;
          const truncated_creator = truncateHash(creator, 6, 2);
          let from = truncated_creator;
          let actions = <></>;
          if (user) {
            const userAddress = user.get("ethAddress");
            if (userAddress.toUpperCase()===creator.toUpperCase()) {
              from = "you";
              actions = <CancelButton detail={ detail } onCancelOfferHandle={ onCancelOfferHandle }/>;
            } else if (userAddress.toUpperCase()===detail.creator.toUpperCase()) {
              actions = <AcceptButton detail={ detail } offerCreator={ creator } onAcceptOfferHandle={ onAcceptOfferHandle }/>;
            }
          } 

          const tempOffer = {
            key: i.toString(),
            price: `${price} BNB`,
            usd_price,
            from,
            actions
          }

          tempOffers.push(tempOffer);
        }
        setOffers(tempOffers);
      }

      fetchOffers();
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
    ];
      
    return <div className='offerlist'>
        <Collapse defaultActiveKey={['1']}>
            <Panel header="Offers" key="1" extra={ <UnorderedListOutlined /> }>
                <Table 
                    dataSource={offers} 
                    columns={columns} 
                    pagination={ false }
                    scroll={{ x: 100, y: 280 }}
                />
            </Panel>
        </Collapse>
    </div>
};

export default OfferList;