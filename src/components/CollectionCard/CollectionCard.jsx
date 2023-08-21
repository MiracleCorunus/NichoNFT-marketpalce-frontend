import { useEffect } from 'react';
import { Image } from 'antd';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useMoralis } from 'react-moralis'
// import { ReactComponent as HeartIcon } from 'assets/images/heart.svg';
import './CollectionCard.scss';

const { Title, Paragraph } = Typography;

function CollectionCard({ collection }) {
  const { user, isInitialized } = useMoralis();
  // const [claimFavorite, setClaimFavorite] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;

  }, [user, isInitialized]);

  return (
    <div className="collection-card-new">
      <Link to={ `/viewCollection?collectionId=${collection.objectId}`}>
        <div className="collection-img-wrap">
          <Image rootClassName="collection-img collection-img1" preview={false} src={collection.featureImage}/>
          <Image rootClassName="collection-img collection-img2" preview={false} src={collection.featureImage}/>
          <Image rootClassName="collection-img collection-img3" preview={false} src={collection.featureImage}/>
          {/* TODO tokenUriList 有数据了再改回来*/}
          {/* {
            collection.tokenUriList && collection.tokenUriList[0] &&
            <Image rootClassName="collection-img collection-img2" preview={false} src={collection.tokenUriList[0]}/>
          }
          {
            collection.tokenUriList && collection.tokenUriList[1] &&
            <Image rootClassName="collection-img collection-img3" preview={false} src={collection.tokenUriList[1]}/>
          } */}
          <div className="owner-img">
            <Image preview={false} src={collection.logoImage}/>
          </div>
        </div>

      </Link>
      <div className="bot-wrap">
        <Title level={3} ellipsis={true} className="title">{collection.collectionTitle}</Title>
        <Paragraph className="description">{collection.collectionDescription}</Paragraph>
      </div>
      
    </div>
  )
}

export default CollectionCard;