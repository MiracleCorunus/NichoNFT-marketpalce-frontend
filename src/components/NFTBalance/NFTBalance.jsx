import './NFTBalance.scss';
import { Helmet } from 'react-helmet';
import SubTitle from 'components/common/SubTitle'
import NFTBalanceContent from './NFTBalanceContent';
import NFTBalanceHeader from './NFTBalanceHeader';

function NFTBalance() {
  return (
    <div className="nft-balance com-black-bg2">

      <Helmet>
        <title>Nicho AI NFT | My NFTs</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className='center-page'>
        <SubTitle title = {'Personal information'}/>
        <NFTBalanceHeader />
        <NFTBalanceContent />
      </div>
    </div>
  )
}

export default NFTBalance;