import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  Button
} from "react-bootstrap";

import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { Meteor } from "meteor/meteor";

import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
import DroplistComponent from "../../components/DroplistComponent/DroplistComponent";
import { Promotion } from "../../../modules/classes/promotion";
import { findNextRankAndLevel } from "../../../modules/utilities";

const StaffPromotionComponentStyle = styled.div``;

export default function PromotionComponentNew(props) {
  const [newDesignation, setDesignation] = useState("");
  const [promotionYear, setpromotionYear] = useState("");
  const [proposedSalaryStructure, setproposedSalaryStructure] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newSalary, setNewSalary] = useState("");

  const {
    salaryStructure,
    dateOfLastPromotion,
    staffdesignation,
    staffCadres
  } = props;

  console.log(props);

  const TEMPLATE2 = "xxxx";
  const parse2 = templateParser(TEMPLATE2, parseDigit);
  const format2 = templateFormatter(TEMPLATE2);

  useEffect(() => {
    //will run once

    if (editing === false) {
      const nextLevlAndRank = findNextRankAndLevel(
        props.staffdesignation,
        props.staffCadres
      );
      const promotionObject = {
        biodata: props.biodata,
        staffId: props.staffId,
        lastPromotionDate: props.dateOfLastPromotion,
        salaryStructure: props.salaryStructure,
        designation: props.staffdesignation
      };
      const staffPromotion = new Promotion(promotionObject);
      const nextSalaryStructure = staffPromotion.getNewSalaryStructure(
        props.cadres
      );
      const newStaffSalary = staffPromotion.getSalaryRange(props.salaryScales);
      if (nextLevlAndRank !== null) {
        const { nextRank, nextLevel } = nextLevlAndRank;
        const { newStep, newSalaryScale } = nextSalaryStructure;
        setproposedSalaryStructure(newSalaryScale);
        setDesignation(nextRank);
        setNewSalary(newStaffSalary);
      }

      return () => {
        //component will unmount
      };
    }
  }, []);

  const onPromotinYearChange = value => {
    setpromotionYear(value);
  };

  const setSelectedDesignation = designation => {
    setDesignation(designation);
    setEditing(true);
  };

  const saveChanges = () => {
    const {
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      staffdesignation,
      user
    } = props;

    if (promotionYear == "") {
      Bert.alert("Please enter the promotion year", "danger");
      return;
    }

    //build the object sending to the
    //server

    const object = {
      staffId,
      staffName: `${biodata.firstName} ${biodata.middleName} ${biodata.surname}`,
      oldDesignation: staffdesignation,
      newDesignation,
      oldSalaryStructure: salaryStructure,
      newSalaryStructure: proposedSalaryStructure,
      oldPromotionDate: dateOfLastPromotion,
      promotionYear: promotionYear,
      user,
      newSalary
    };

    const confirmSubmit = confirm(
      `You are about updating the promotion year for ${object.staffName} from ${staffdesignation} to ${object.newDesignation} and from a salary scale of ${salaryStructure} to ${object.newSalaryStructure}. Promotion year: ${promotionYear} `
    );

    if (!confirmSubmit) return;

    const askToBeSure = confirm(
      `This action will be logged. Are you sure you want to continue`
    );

    if (!askToBeSure) return;

    setSubmitted(submitted => !submitted);
    Meteor.call("staffMembers.promoteStaff", object, err => {
      if (!err) {
        Bert.alert(
          `${object.staffName} elevated to the rank of ${object.newDesignation} with effect from 1-Oct-${object.promotionYear}`,
          "success"
        );
        setSubmitted(submitted => !submitted);
        props.onHide();
        //we call the method that selects those due for
        //promotion again here using the props makeRemoteCall
        props.makeRemoteCall(props.selectedDesignation);
      } else {
        setSubmitted(submitted => !submitted);
        Bert.alert(`There was an error: ${err}`, "danger");
      }
    });
  };

  const proposedSalary = e => {
    setproposedSalaryStructure(e.target.value);
  };

  return (
    <StaffPromotionComponentStyle>
      <Row>
        <Col md={12}>
          <FormGroup>
            <ControlLabel>Former designation:</ControlLabel>
            <input
              type="text"
              disabled
              value={staffdesignation}
              className="form-control"
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Former salary structure:</ControlLabel>
            <input
              type="text"
              disabled
              value={salaryStructure || ""}
              className="form-control"
            />
          </FormGroup>

          {newDesignation == "not defined" && (
            <div>
              <DroplistComponent
                data={props.designationsOfStaff}
                field="rank"
                label="Designation after promotion"
                placeholder="Search designation......"
                setValue={setSelectedDesignation}
                /*setInputValue={setInputValueChange}*/
              />
            </div>
          )}

          {newDesignation !== "not defined" && (
            <div>
              <FormGroup>
                <ControlLabel>Designation after promotion:</ControlLabel>
                <input
                  type="text"
                  disabled
                  value={newDesignation || ""}
                  className="form-control"
                />
              </FormGroup>
            </div>
          )}

          <FormGroup>
            <ControlLabel>Salary structure after promotion:</ControlLabel>
            <input
              type="text"
              value={proposedSalaryStructure || ""}
              className="form-control"
              onChange={proposedSalary}
            />
          </FormGroup>

          <FormGroup>
            <p>
              Annual Salary :{" "}
              <span>
                <b>{newSalary && newSalary.yearlySalary}</b>
              </span>
              <br />
              Salary Range :
              <span>
                <b>{newSalary && newSalary.yearlySalaryRange}</b>
              </span>
            </p>
          </FormGroup>

          <FormGroup>
            <ControlLabel>Date of Last Promotion:</ControlLabel>
            <input
              type="text"
              disabled
              value={dateOfLastPromotion || ""}
              className="form-control"
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Promotion year:</ControlLabel>
            <ReactInput
              value={promotionYear}
              onChange={value => onPromotinYearChange(value)}
              className="form-control"
              parse={parse2}
              format={format2}
              placeholder="0000"
            />
          </FormGroup>

          <ButtonToolbar>
            {props.onHide ? (
              <Button bsSize="small" onClick={props.onHide}>
                Close
              </Button>
            ) : null}

            <Button
              bsSize="small"
              bsStyle="info"
              onClick={() => {
                setDesignation("not defined");
                setEditing(true);
              }}
            >
              Manual
            </Button>

            {newDesignation !== "not defined" && newSalary ? (
              <Button
                bsSize="small"
                className="btn btn-danger "
                disabled={submitted}
                onClick={saveChanges}
              >
                Save Promotion
              </Button>
            ) : null}
          </ButtonToolbar>
        </Col>
      </Row>
    </StaffPromotionComponentStyle>
  );
}
