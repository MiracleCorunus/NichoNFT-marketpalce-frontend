import { Tabs } from 'antd';
import './NFTBalanceContent.scss';
import './NFTCollection';
import { useTranslation } from "react-i18next";
import NFTCollection from './NFTCollection';
import NFTCreated from './NFTCreated';
import NFTFavorited from './NFTFavorited';
import NFTSold from './NFTSold';
import NFTUnregistered from './NFTUnregistered';

const { TabPane } = Tabs;

function NFTBalanceContent() {
  const { t } = useTranslation();
  return (
    <div className="nft-balance-content-new">
      <Tabs defaultActiveKey="1">
        <TabPane tab={t("myOwned")} key="1">
          <NFTCollection />
        </TabPane>
        <TabPane tab={t("mySold")} key="2">
          <NFTSold />
        </TabPane>
        <TabPane tab={t("myCreated")} key="3">
          <NFTCreated />
        </TabPane>
        <TabPane tab={t("myFavorited")} key="4">
          <NFTFavorited />
        </TabPane>
        <TabPane tab={t("myUnRegistered")} key="5">
          <NFTUnregistered />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default NFTBalanceContent;