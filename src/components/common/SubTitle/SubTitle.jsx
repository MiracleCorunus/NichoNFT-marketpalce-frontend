import "./SubTitle.scss"
import { Image } from 'antd';
import Back from 'assets/images/new/createNFT/back.png';


function SubTitle({ title }) {

  return (
    <div className="com-sub-title">
      <div style={{ paddingRight: '20px' }} onClick={() => window.history.back(-1)}>
        <Image preview={false} src={Back} />
      </div>
      <span >{ title }</span>
    </div>
  );
}

export default SubTitle;