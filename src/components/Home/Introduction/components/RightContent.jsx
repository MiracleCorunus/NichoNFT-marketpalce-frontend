import { Image, Row } from 'antd';
import './RightContent.scss';
import MaskImg from 'assets/images/mask.jpg';
import GunnerImg from 'assets/images/gunner.jpg';
import MonkeyImg from 'assets/images/monkey-1.jpg';

function RightContent() {
  return (
    <div className="right-content">
      {/* <div className="left-img">
        <Image preview={false} width={282} height={384} src={MaskImg} />
      </div>
      <div className="right-img">
        <Image preview={false} src={GunnerImg} width={222} height={230} />
        <Image preview={false} src={MonkeyImg} width={222} height={230} />
      </div> */}
      <Row className="top-img" align='bottom' justify='center'>
        <Image preview={false} src={GunnerImg} width={252} height={230} className='me-2' />
        <Image preview={false} width={272} height={304} src={MaskImg} />
      </Row>
      <div className="bottom-img">
        <Image preview={false} src={MonkeyImg} width={262} height={230} />
      </div>
    </div>
  );
}

export default RightContent;