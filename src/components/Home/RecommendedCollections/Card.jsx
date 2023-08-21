import { Image } from 'antd';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import './Card.scss';

const { Title, Paragraph } = Typography;
function Card({ collection }) {
  return (
    <div className="wrapper">
      <Link to="/nftDetail">
        <div className="collection-img">
          <Image preview={false} src={collection.collectionImg}/>
          <div className="owner-img">
            <Image preview={false} src={collection.ownerImg}/>
          </div>
        </div>
      </Link>
      <Title level={3} className="title">{collection.title}</Title>
      <Paragraph className="description" type="secondary">{collection.description}</Paragraph>
    </div>
  )
}

export default Card;