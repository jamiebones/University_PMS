import React from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  Button,
  HelpBlock
} from "react-bootstrap";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { Meteor } from "meteor/meteor";
import autoBind from "react-autobind";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";

import {
  NonTeachingPromotionPlacement,
  TeachingStaffPromotionPlacement,
  FindNextRank
} from "../../../modules/utilitiesComputation";
import { NonTeachingCadresAndProgression } from "../../../modules/cadresprogression";
import { TeachingCadresProgression } from "../../../modules/cadreprogressionacademic";

const StaffPromotionComponentStyle = styled.div``;

class StaffPromotionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newDesignation: "",
      promotionYear: "",
      proposedSalaryStructure: "",
      submitted: false
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.staffdesignation !== state.newDesignation) {
      //lets try to get the proposed salary step
      const salaryStep = props && props.salaryStructure.trim();
      //split the salarystep by space
      const salaryArray = salaryStep && salaryStep.split(" ");
      const scaleType = salaryArray[0];
      const step = parseInt(salaryArray[3]);
      if (scaleType.toUpperCase() == "CONTISS") {
        //non academic staff found here
        //find the next rank the person is moving to
        const cadreArray = NonTeachingCadresAndProgression();
        const nextRank = FindNextRank(cadreArray, props.staffdesignation);

        const { cadre, scale } = nextRank;

        const newStep = NonTeachingPromotionPlacement(step);

        //get the level

        return {
          proposedSalaryStructure: `${scaleType} ${scale} / ${newStep}`,
          newDesignation: cadre
        };
      } else {
        //here is academic staff
        const cadreArray = TeachingCadresProgression();
        const nextRank = FindNextRank(cadreArray, props.staffdesignation);
        const { cadre, scale } = nextRank;
        const newStep = TeachingStaffPromotionPlacement(step);
        //get the level
        return {
          proposedSalaryStructure: `${scaleType} ${scale} / ${newStep}`,
          newDesignation: cadre
        };
      }
    }

    return {};
  }

  onPromotinYearChange(value) {
    this.setState({ promotionYear: value });
  }

  saveChanges() {
    const {
      newDesignation,
      proposedSalaryStructure,
      submitted,
      promotionYear
    } = this.state;

    const {
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      staffdesignation,
      user
    } = this.props;

    if (promotionYear == "") {
      Bert.alert("Please enter the promotion year", "danger");
      return;
    }

    //build the object sending to the
    //server

    const object = {
      staffId,
      staffName: `${biodata.firstName} ${biodata.middleName} ${
        biodata.surname
      }`,
      oldDesignation: staffdesignation,
      newDesignation,
      oldSalaryStructure: salaryStructure,
      newSalaryStructure: proposedSalaryStructure,
      oldPromotionDate: dateOfLastPromotion,
      promotionYear: promotionYear,
      user
    };

    const confirmSubmit = confirm(
      `You are about updating the promotion year for ${
        object.staffName
      } from ${staffdesignation} to ${
        object.newDesignation
      } and from a salary scale of ${salaryStructure} to ${
        object.newSalaryStructure
      }. Promotion year: ${promotionYear} `
    );

    if (!confirmSubmit) return;

    const askToBeSure = confirm(
      `This action will be logged. Are you sure you want to continue`
    );

    if (!askToBeSure) return;

    this.setState({ submitted: !this.state.submitted });

    Meteor.call("staffMembers.promoteStaff", object, err => {
      if (!err) {
        Bert.alert(
          `${object.staffName} elevated to the rank of ${
            object.newDesignation
          } with effect from 1-Oct-${object.promotionYear}`,
          "success"
        );
        this.setState({ submitted: !this.state.submitted });
        this.props.onHide();
      } else {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert(`There was an error: ${error}`, "danger");
      }
    });
  }

  render() {
    const {
      salaryStructure,
      dateOfLastPromotion,
      staffdesignation
    } = this.props;

    const TEMPLATE2 = "xxxx";
    const parse2 = templateParser(TEMPLATE2, parseDigit);
    const format2 = templateFormatter(TEMPLATE2);

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
              <ControlLabel>Designation after promotion:</ControlLabel>
              <input
                type="text"
                disabled
                value={this.state.newDesignation}
                className="form-control"
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Former salary structure:</ControlLabel>
              <input
                type="text"
                disabled
                value={salaryStructure}
                className="form-control"
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Salary structure after promotion:</ControlLabel>
              <input
                type="text"
                disabled
                value={this.state.proposedSalaryStructure}
                className="form-control"
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Date of Last Promotion:</ControlLabel>
              <input
                type="text"
                disabled
                value={dateOfLastPromotion}
                className="form-control"
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Promotion year:</ControlLabel>
              <ReactInput
                value={this.state.promotionYear}
                onChange={value => this.onPromotinYearChange(value)}
                className="form-control"
                parse={parse2}
                format={format2}
                placeholder="0000"
              />
            </FormGroup>

            <ButtonToolbar>
              {this.props.onHide ? (
                <Button onClick={this.props.onHide}>Close</Button>
              ) : null}

              {this.state.newDesignation ? (
                <button
                  className="btn btn-danger "
                  disabled={this.state.submitted}
                  onClick={this.saveChanges}
                >
                  Save Promotion
                </button>
              ) : null}
            </ButtonToolbar>
          </Col>
        </Row>
      </StaffPromotionComponentStyle>
    );
  }
}

export default StaffPromotionComponent;
