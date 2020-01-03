import React, { useEffect, useState } from "react";
import { Row, Col, Modal, ButtonToolbar, Button } from "react-bootstrap";
import styled from "styled-components";
import moment from "moment";
import { Meteor } from "meteor/meteor";
import { capAllFirstLetter } from "../../../modules/utilities";
import { base64ToBlob } from "../../../modules/base64-to-blob.js";
import fileSaver from "file-saver";
if (Meteor.isClient) import "./PromotionShowModal.scss";

const PromotionModalStyles = styled.div``;

export default PromotionModalShow = props => {
  const [staff, setStaff] = useState("");
  const [show, setShow] = useState(false);
  const {
    staffId,
    oldDesignation,
    newDesignation,
    newSalaryStructure,
    promotionYear,
    promotionSalary,
    councilDate,
    registrarName,
    staffTitle
  } = props.promotionDetails;

  const onHide = () => {
    setShow(!show);
  };

  const continuePrintingLetter = () => {
    //we continue printing the promotion letter here
    event.preventDefault();
    const promotedStaffDetails = props.promotionDetails;
    const { target } = event;
    target.innerHTML = "<em>Downloading...</em>";
    target.setAttribute("disabled", "disabled");
    Meteor.call(
      "promotedstaff.printpromotionletter",
      promotedStaffDetails,
      (err, res) => {
        if (!err) {
          const blob = base64ToBlob(res);
          fileSaver.saveAs(blob, "promotion_letter.pdf");
          target.innerText = "Print Promotion letter";
          target.removeAttribute("disabled");
          setShow(!show);
          props.promotionDetails.resetModal();
          //reload the list here again from the server
          props.promotionDetails.reloadList(promotedStaffDetails.year);
        } else {
          setShow(!show);
          target.innerText = "Print Promotion letter";
          target.removeAttribute("disabled");
          console.log(err);
        }
      }
    );
  };

  useEffect(() => {
    //lets get the staff object here by queying the database for the staff data
    Meteor.call("staffmembers.getStaffById", staffId, (err, staff) => {
      if (!err) {
        setStaff(staff);
        setShow(true);
      } else {
        console.log(err);
      }
    });
  }, []);
  return (
    <PromotionModalStyles>
      <Row>
        <Col md={12}>
          <Modal show={show} onHide={onHide} bsSize="large">
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-sm">
                {staffTitle}. {staff && staff.biodata.firstName}{" "}
                {staff && staff.biodata.middleName}{" "}
                {staff && staff.biodata.surname}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                UU/PF/SAMPLE/001
                <span className="pull-right">
                  {moment(new Date()).format("MMMM DD YYYY")}
                </span>
              </p>

              <p>
                <b>
                  {staffTitle}. {staff && staff.biodata.firstName}{" "}
                  {staff && staff.biodata.middleName}{" "}
                  {staff && staff.biodata.surname}
                </b>
              </p>

              <p>{staff && staff.currentPosting}</p>
              <p>University of Uyo</p>
              <p>Uyo</p>
              <br />
              <p>
                Dear {staffTitle}. {staff && staff.biodata.surname},
              </p>

              <p className="big-para">
                <b>NOTIFICATION OF PROMOTION</b>
              </p>

              <p>
                I am pleased to inform you that on the recommendation of the
                Appointments and Promotions Commitee{" "}
                {staff && staff.type == "1"
                  ? "(Academic Staff)"
                  : staff && staff.staffClass == "Senior Staff"
                  ? "(Senior Administrative and Technical Staff)"
                  : "(Junior Staff)"}
                , the Governing Council at its <b>Special Meeting</b> held on{" "}
                <b>{councilDate}</b> approved your promotion from the rank of{" "}
                <b>
                  <span className="cap">
                    {oldDesignation && capAllFirstLetter(oldDesignation)}
                  </span>
                </b>{" "}
                to the rank of{" "}
                <b>
                  <span className="cap">
                    {newDesignation && capAllFirstLetter(newDesignation)}
                  </span>
                  .
                </b>
              </p>

              <p>
                The promotion is with effect from{" "}
                <b>October 01, {promotionYear}</b>. Your annual salary with
                effect from that date is <b>{promotionSalary.yearlySalary}</b>{" "}
                in <b>{newSalaryStructure}</b>{" "}
                <b>(ie {promotionSalary.yearlySalaryRange}).</b>
              </p>

              <p>
                Your next increment thereafter, is with effect from{" "}
                <b>October 01, {parseInt(promotionYear) + 1}</b>
              </p>

              <p>Please acknowledge receipt of this letter.</p>

              <p>Congratulations!</p>

              <p>Yours sincerely,</p>

              <p className="registrarSignature">
                <b>{registrarName}</b> <br />
                <span>REGISTRAR AND SECRETARY TO COUNCIL</span>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <ButtonToolbar>
                <Button bsStyle="danger" onClick={() => setShow(!show)}>
                  Cancel
                </Button>
                <Button
                  bsStyle="success"
                  onClick={() => continuePrintingLetter()}
                >
                  Print Promotion letter
                </Button>
              </ButtonToolbar>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </PromotionModalStyles>
  );
};
