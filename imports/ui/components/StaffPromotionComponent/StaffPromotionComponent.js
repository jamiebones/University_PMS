import React from "react";
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
import autoBind from "react-autobind";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";

import {
  NonTeachingPromotionPlacement,
  FindNextRank
} from "../../../modules/utilitiesComputation";
import { NonTeachingCadresAndProgression } from "../../../modules/cadresprogression";
import { TeachingCadresProgression } from "../../../modules/cadreprogressionacademic";
import DroplistComponent from "../../components/DroplistComponent/DroplistComponent";

const StaffPromotionComponentStyle = styled.div``;

class StaffPromotionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newDesignation: "",
      promotionYear: "",
      proposedSalaryStructure: "",
      submitted: false,
      selectedDesignation: "",
      editing: false
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.editing == false) {
      //lets try to get the proposed salary step
      const salaryStep = props && props.salaryStructure.trim();
      //split the salarystep by space
      const salaryArray = salaryStep && salaryStep.split("/");
      //split the first part to extract the type
      const scaleArray = salaryArray[0].split(" ");
      const scaleType = scaleArray[0];

      const step = parseInt(salaryArray[salaryArray.length - 1]);
      if (scaleType.toUpperCase() == "CONTISS") {
        //non academic staff found here
        //find the next rank the person is moving to
        const cadreArray = NonTeachingCadresAndProgression();
        const nextRank = FindNextRank(cadreArray, props.staffdesignation);
        if (nextRank) {
          let { cadre, scale } = nextRank;
          const newStep = NonTeachingPromotionPlacement(step);
          //get the level

          return {
            proposedSalaryStructure: `${scaleType} ${scale} / ${newStep}`,
            newDesignation: cadre || "not defined"
            // editing: cadre == null ? true : false
          };
        }
      } else {
        //here is academic staff
        const cadreArray = TeachingCadresProgression();
        const nextRank = FindNextRank(cadreArray, props.staffdesignation);
        if (nextRank) {
          const { cadre, scale } = nextRank;
          const newStep = step - 2;
          //get the level
          return {
            proposedSalaryStructure: `${scaleType} ${scale} / ${newStep}`,
            newDesignation: cadre || "not defined"
            // editing: cadre == null ? true : false
          };
        }
      }
    }

    return null;
  }

  onPromotinYearChange(value) {
    this.setState({ promotionYear: value });
  }

  setSelectedDesignation(designation) {
    this.setState({ newDesignation: designation });
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
        //we call the method that selects those due for
        //promotion again here using the props makeRemoteCall
        this.props.makeRemoteCall(this.props.selectedDesignation);
      } else {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert(`There was an error: ${err}`, "danger");
      }
    });
  }

  proposedSalary(e) {
    this.setState({ proposedSalaryStructure: e.target.value });
  }

  render() {
    const {
      salaryStructure,
      dateOfLastPromotion,
      staffdesignation,
      designations
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
              <ControlLabel>Former salary structure:</ControlLabel>
              <input
                type="text"
                disabled
                value={salaryStructure}
                className="form-control"
              />
            </FormGroup>

            {this.state.newDesignation == "not defined" ? (
              <div>
                <DroplistComponent
                  data={designations}
                  field="rank"
                  label="Designation after promotion"
                  placeholder="Search designation......"
                  setValue={this.setSelectedDesignation}
                />

                <FormGroup>
                  <ControlLabel>Salary structure after promotion:</ControlLabel>
                  <input
                    type="text"
                    value={this.state.proposedSalaryStructure}
                    className="form-control"
                    onChange={this.proposedSalary}
                  />
                </FormGroup>
              </div>
            ) : null}

            {this.state.newDesignation !== "not defined" ? (
              <div>
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
                  <ControlLabel>Salary structure after promotion:</ControlLabel>
                  <input
                    type="text"
                    disabled
                    value={this.state.proposedSalaryStructure}
                    className="form-control"
                  />
                </FormGroup>
              </div>
            ) : null}

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
                <Button bsSize="small" onClick={this.props.onHide}>
                  Close
                </Button>
              ) : null}

              <Button
                bsSize="small"
                bsStyle="info"
                onClick={() =>
                  this.setState({
                    newDesignation: "not defined",
                    editing: true
                  })
                }
              >
                Manual
              </Button>

              {this.state.newDesignation !== "not defined" ? (
                <Button
                  bsSize="small"
                  className="btn btn-danger "
                  disabled={this.state.submitted}
                  onClick={this.saveChanges}
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
}

export default StaffPromotionComponent;
