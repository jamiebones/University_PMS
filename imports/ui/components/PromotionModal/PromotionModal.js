import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import autoBind from "react-autobind";
//import StaffPromotionComponent from "../../components/StaffPromotionComponent/StaffPromotionComponent";
import NewStaffPromotionComponentNew from "../../components/NewStaffPromotionComponent/NewStaffPromotionComponent";
const PromotionModalStyle = styled.div``;

class PromotionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  render() {
    const { biodata, show, onHide } = this.props;

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
            <NewStaffPromotionComponentNew {...this.props} />
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      </PromotionModalStyle>
    );
  }
}

export default PromotionModal;
