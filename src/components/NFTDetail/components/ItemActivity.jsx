
import { useState, useEffect } from 'react';
import { Collapse, Spin, Table, message } from 'antd';
import {
  UnorderedListOutlined, LoadingOutlined,
  TagFilled, ShoppingCartOutlined,
  SwapOutlined, AlertFilled,
  DownloadOutlined
} from '@ant-design/icons';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useTranslation } from 'react-i18next';
import useGetBNBPrice, { getFilteredPrice } from 'hooks/useGetCoinPrice';
import { truncateHash } from 'helpers/Utils';
import { getItemActivityApi } from 'api/getNFTDetail';
const { Panel } = Collapse;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


const getIcon = (activityType) => {
  if (activityType==="Listing") return <TagFilled />
  else if (activityType==="Sale") return <ShoppingCartOutlined />
  else if (activityType==="Transfer") return <SwapOutlined />
  else if (activityType==="Mint") return <AlertFilled />
  else if (activityType==="CanelListing") return <DownloadOutlined />
  else return <></>

}
const ItemActivity = ({ detail, topRefreshData }) => {
  const { user, Moralis, isInitialized } = useMoralis();
  const { t } = useTranslation();
  const [items, setItems] = useState();
  const [refreshData, setRefreshData] = useState(false);

  // const bnbPrice = useGetBNBPrice(1);

  // Get item activities
  useEffect(() => {

    const fetchActivity = async () => {
      if (!detail) return;

      const params = {
        pageNo: 1,
        pageSize: 20,
        tokenAddress: detail.tokenAddress,
        tokenId: detail.tokenId
      }
      const { records: items, total } = await getItemActivityApi(params);
      // console.log(items)

      let tempItems = [];
      for (let i = 0; i < total; i++) {
        const item = items[i];
        const from = item.from==="" ? "" :
          <a href={`https://bscscan.com/address/${item.from}`} target="_blank">{truncateHash(item.from, 6, 4)}</a>;
        const to = item.to==="" ? "" :
          <a href={`https://bscscan.com/address/${item.to}`} target="_blank">{truncateHash(item.to, 6, 4)}</a>;

        const eventItem = <>{getIcon(item.activityType)} {item.activityType==="CanelListing" ? "Cancel Listing" : item.activityType} </>
        const temp = {
          key: `${i}`,
          event: eventItem,
          usd_price: item.price ? `${item.price} BNB` : "",
          from: from,
          to: to,
          // transaction: <a href= {`https://testnet.bscscan.com/tx/${detail.transaction}`} target="_blank">Browse the details</a>
          created_at: item.createdAt
        }
        tempItems.push(temp);
      }
      // console.log(tempItems)
      setItems(tempItems);
    }

    fetchActivity();
  }, [refreshData, detail, user, isInitialized, topRefreshData])

  const columns = [
    {
      title: t("event"),
      dataIndex: 'event',
      key: 'event',
    },
    {
      title: t("price"), // USD Price
      dataIndex: 'usd_price',
      key: 'usd_price',
    },
    {
      title: t("from"),
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: t("to"),
      dataIndex: 'to',
      key: 'to',
    },
    // {
    //   title: 'Transaction',
    //   dataIndex: 'transaction',
    //   key: 'transaction'
    // },  
    {
      title: t("date"),
      dataIndex: 'created_at',
      key: 'created_at'
    },
  ];

  return <div className='offerlist'>
    <Collapse defaultActiveKey={['1']}>
      <Panel header="Item Activity" key="1" extra={<UnorderedListOutlined />}>
        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          scroll={{ x: 100, y: 280 }}
        />
      </Panel>
    </Collapse>
  </div>
};

export default ItemActivity;