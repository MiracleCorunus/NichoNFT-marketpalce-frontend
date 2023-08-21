import { Helmet } from 'react-helmet';
import './Profile.scss';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';

function Profile() {
  return (
    <div className="nft-balance com-black-bg2">
      <Helmet>
        <title>Nicho AI NFT | Profile</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className='center-page'>
        <ProfileHeader />
        <ProfileContent />
      </div>
    </div>
  )
}

export default Profile;