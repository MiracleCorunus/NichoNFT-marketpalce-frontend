import { useMoralis, useNFTBalances, useChain  } from "react-moralis";
import { Col, Row, Pagination, Button, Image, message } from "antd";
import "./NFTBalanceContent.scss";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import { useTranslation } from 'react-i18next';
// import { useNFTBalance } from "hooks/useNFTBalance";
import OtherNFTCard from "./OtherNFTCard";
// import { Icon } from "@iconify/react";
import methodImg1 from "assets/images/new/grid_method.png";
import methodImg2 from "assets/images/new/grid_method2.png";
import methodActiveImg1 from "assets/images/new/grid_method_icon1.png";
import methodActiveImg2 from "assets/images/new/grid_method_icon2.png";
import { getOwnedNFTsApi } from "api/nftList";
import { sleep } from "helpers/Utils";
import { getChainData } from "components/HeaderContent/chainData";

// const { Title, Paragraph } = Typography;

function NFTUnregistered() {
  const { t } = useTranslation();
  const [waiting, setWaiting] = useState(false);
  const [items, setItems] = useState();
  const { user, isInitialized, Moralis } = useMoralis();
  const { chainId } = useChain();
  // const { NFTBalance, fetchSuccess } = useNFTBalance();

  const [refresh, setRefresh] = useState(false);
  const { getNFTBalances, data, error } = useNFTBalances();

  const [cardColumn, setCardColumn] = useState([6, 6, 8, 12, 12, 24]);
  const [total, setTotal] = useState(0);
  const [pageInfo, setPageInfo] = useState({ pageNo: 1, pageSize: 50 });

  // Get NFT Balance
  useEffect(() => {
    const currentDomainStatus = (targeLink) => {
      // return "0x38"
      const currentHostname = window.location.hostname;
      if (currentHostname.includes("localhost")) return "same";
      if (targeLink.includes("test") && currentHostname.includes("test")) return "same";
      if (targeLink.includes("test") === false && currentHostname.includes("test") === false) return "same";
      
      if(currentHostname.includes("test")) return "0x61" // bsc testnet
      return "0x38" // bsc mainnet
    }
    const monitorNetwork = () => {
      try {
        if (!isInitialized || !user || !chainId || chainId === "") return;
        const chainInfo = getChainData(chainId);
        const curDS = currentDomainStatus(chainInfo.site_url)
        if (curDS === "same") {
          getNFTBalances({ params: { chain: chainId } });
        }  
      } catch (err) {
        console.log(err)
      }

    }
    monitorNetwork();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, user]);


  const addressEquals = (addr1, addr2) => {
    if (!addr1 || !addr2) return false;

    return addr1.toLowerCase()===addr2.toLowerCase();
  }

  const tokenIdEquals = (id1, id2) => {
    if (id1 === undefined || id2 === undefined) return false;
    return id1.toString()===id2.toString();
  }

  const getUserItems = async () => {
    try {
      if(!data) return;
      // console.log("Get user API started")
      const params = {
        ethAddress: user.get("ethAddress"),
        ...pageInfo
      };
      const { records, total } = await getOwnedNFTsApi(params);

      const tempList = data.result.filter((item) => {
        for(let i = 0; i < total; i++) {
          const record = records[i];
          if(addressEquals(record.tokenAddress, item.token_address) && tokenIdEquals(record.tokenId, item.token_id)) return false;
        }
        return true;
      })

      const totalCount = tempList.length;
      // console.log(records, 'records')
      // console.log(tempList, 'tempList')
      if(tempList && totalCount > 0) {
          setItems(tempList);
          setTotal(totalCount);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 分页
  const onPageChange = async (pageNo) => {
    setPageInfo((prevState) => {
      return {
        ...prevState,
        pageNo,
      };
    });
  };

  const changeCardColumn = (columnArr, smallView) => {
    setCardColumn(columnArr);
    if (smallView) {
      setPageInfo((prevState) => {
        return {
          ...prevState,
          pageSize: 100,
        };
      });
    } else {
      setPageInfo((prevState) => {
        return {
          ...prevState,
          pageSize: 50,
        };
      });
    }
  };

  useEffect(() => {
    if (!user || !data) return;

    getUserItems();
  }, [user, refresh, pageInfo, data]);

  const showSuccess = (msg) => {
    message.success(msg)
  }
  
  const showError = (msg) => {
    message.error(msg)
  }
  const registerAll = async () => {
    try {
      if (!items || items.length === 0 || !user) return;

      setWaiting(true)
      const queryParams = {
        metadataArray: items
      };

      const result = await Moralis.Cloud.run(
        "RegisterNFTs",
        queryParams
      );
      
      if(result) {
        showSuccess(t("successfullyRegisteredTime"))
        await sleep(5000)
        setRefresh(!refresh)
        setItems([])
      } else {
        showError(t("registerfailed"))
      }
    } catch (err) {
      console.log(err);
      showError(t("registerfailed"))
    } finally {
      setWaiting(false)
    }
  }

  return (
    <Fragment>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "30px" }}
      >
        <h3 className="total-counter">
          {t("totalItems")} {items?.length > 0 ? items?.length : 0}
        </h3>
        <div className="set-column-wrap">
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
        </div>
      </Row>

      {!items?.length &&
       <h3
        className="total-counter"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        { `Non-registered items`}
      </h3>
      }

      <Button onClick={() => registerAll() } loading={ waiting }>
        { waiting? t("registering") : t("registerAll") }
      </Button>

      <Row gutter={[30, 30]} style={{ marginTop: "30px" }}>
        {!error &&
          items &&
          items.map(
            (item, index) =>
              (
                <Col
                  xxl={cardColumn[0]}
                  xl={cardColumn[1]}
                  lg={cardColumn[2]}
                  md={cardColumn[3]}
                  sm={cardColumn[4]}
                  xs={cardColumn[5]}
                  key={index}
                >
                  <OtherNFTCard
                    product={item}
                    handleRefresh={() => setRefresh(!refresh)}
                  />
                </Col>
              )
          )}
      </Row>
      
      <Row style={{ padding: "28px 0" }}>
        <Pagination
          className="com-pagination"
          showQuickJumper
          current={pageInfo.pageNo}
          pageSize={pageInfo.pageSize}
          pageSizeOptions={[16, 32, 50, 100]}
          total={total}
          showTotal={(total) => `${t("total")} ${total} ${t("items")}`}
          onChange={onPageChange}
        />
      </Row>
    </Fragment>
  );
}

export default NFTUnregistered;
