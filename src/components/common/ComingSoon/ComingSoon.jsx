import React from "react";
import { Col, Row } from "antd";
import LeftContent from "./components/LeftContent";
import RightContent from "./components/RightContent";

const ComingSoon = () => {
    return (
        <div className="Introduction dark-grey">
            <div className="center-page">
            <Row gutter={[30, 30]} justify="center">
                <Col lg={12} md={24} sm={24}><LeftContent /></Col>
                <Col lg={12} md={24} sm={24}><RightContent /></Col>
            </Row>
            </div>
        </div>
    );
}

export default ComingSoon;