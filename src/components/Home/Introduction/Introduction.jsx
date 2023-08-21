import { Col, Row } from "antd";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";
import './Introduction.scss';

function Introduction() {
  return (
    <Row gutter={[30, 30]} justify="center">
      <Col lg={12} md={24} sm={24}><LeftContent /></Col>
      <Col lg={12} md={24} sm={24}><RightContent /></Col>
    </Row>
  )
}

export default Introduction;