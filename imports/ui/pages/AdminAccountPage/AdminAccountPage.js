import React from "react";
import { Col, Row } from "react-bootstrap";
import AdminCreateUserAccount from "../../components/AdminCreateUserAccount/AdminCreateUserAccount";
import AccountGroup from "../../components/AccountGroup/AccountGroup";

export default (AdminAccountPage = () => (
  <Row>
    <Col md={6}>
      <AdminCreateUserAccount />
    </Col>

    <Col md={6}>
      <AccountGroup />
    </Col>
  </Row>
));
