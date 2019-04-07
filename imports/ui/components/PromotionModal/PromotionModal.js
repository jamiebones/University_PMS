import React from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  Modal,
  FormControl,
  Label,
  Button,
  HelpBlock
} from "react-bootstrap";
import styled from "styled-components";
import autoBind from "react-autobind";
import StaffPromotionComponent from "../../components/StaffPromotionComponent/StaffPromotionComponent";

const PromotionModalStyle = styled.div``;

class PromotionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  render() {
    const {
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      staffdesignation,
      show,
      onHide
    } = this.props;

    return (
      <PromotionModalStyle>
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>
              Editing Promotion Date For : {biodata && biodata.firstName}{" "}
              {biodata && biodata.surname}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StaffPromotionComponent {...this.props} />
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      </PromotionModalStyle>
    );
  }
}

export default PromotionModal;
