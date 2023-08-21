import "./UploadIconComp.scss"
import { Image } from 'antd';
import UploadIcon from 'assets/images/new/createNFT/upload.png';


function UploadIconComp({ title }) {
  return (
    <Image preview={false} src={UploadIcon}/>
  );
}

export default UploadIconComp;