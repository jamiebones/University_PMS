/*eslint-disable */
import React from "react";
import { Row, Col, FormGroup, ControlLabel, Button } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import { withTracker } from "meteor/react-meteor-data";
import { UniversityUnits } from "../../../api/UniversityUnit/UniversityUnitClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import autoBind from "react-autobind";
import { _ } from "meteor/underscore";
import { EmploymentStatus } from "../../../modules/utilities";
import DroplistComponent from "../../components/DroplistComponent/DroplistComponent";
import styled from "styled-components";

const ChangeDestStyles = styled.div`
  .selectedDiv {
    p {
      font-size: 14px;
    }
    span {
      font-size: 14px;
      color: green;
      font-weight: bold;
    }
  }
`;

class ChangeDestAndStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seldesignation: "",
      seldepartment: "",
      dept: "",
      newStatus: ""
    };
    autoBind(this);
  }

  onChangeStatus(e) {
    e.preventDefault();
    if (e.target.value === "0") return;
    this.setState({ newStatus: e.target.value });
  }

  saveChanges() {
    const { seldepartment, seldesignation, newStatus } = this.state;
    let query = {};
    const {
      staffId,
      biodata: { firstName, middleName, surname },
      currentPosting,
      designation,
      officialRemark
    } = this.props.staff;

    let message = `${firstName}  ${middleName} ${surname}`;
    if (seldepartment) {
      query.currentPosting = seldepartment;
      message += ` you are changing ${currentPosting} to ${seldepartment}`;
    }

    if (seldesignation) {
      query.designation = seldesignation;
      message += ` you are changing ${designation} to ${seldesignation}`;
    }

    if (newStatus) {
      query.officialRemark = newStatus;
      message += ` changing ${officialRemark} to ${newStatus}`;
    }

    const confirmStatus = confirm(
      `Are you sure: you are about changing the following : ${message}`
    );

    if (!confirmStatus) return;
    

    const logAction = confirm(
      `This action will be logged against your username. Do you wish to continue`
    );

    if (!logAction) return;

    Meteor.call(
      "staffMembers.saveNewDesignatioorStatus",
      query,
      staffId,
      err => {
        if (!err) {
          Bert.alert("state changed successful", "success");
        } else {
          Bert.alert(`There was an error: ${error}`, "danger");
        }
      }
    );
  }

  onChange(e) {}

  setDepartment(department) {
    this.setState({ seldepartment: department });
  }

  setDesignation(designation) {
    this.setState({ seldesignation: designation });
  }

  render() {
    const {
      biodata,
      currentPosting,
      designation,
      officialRemark
    } = this.props.staff;
    const { departments, designations } = this.props;
    const { seldepartment, seldesignation, newStatus } = this.state;
    return (
      <ChangeDestStyles>
        <Row>
          <Col md={12}>
            <p>
              Name: {biodata.firstName} {biodata.middleName} {biodata.surname}
            </p>

            <p>Department: {currentPosting}</p>

            <p>Designation: {designation}</p>

            <hr />

            <div className="selectedDiv">
              {seldepartment && (
                <p>
                  New department selected : <span>{seldepartment}</span>
                </p>
              )}

              {seldesignation && (
                <p>
                  New designation selected : <span>{seldesignation}</span>
                </p>
              )}

              {newStatus && (
                <p>
                  Status : <span>{newStatus}</span>
                </p>
              )}
            </div>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <DroplistComponent
                    data={designations}
                    field="rank"
                    label="Change designation"
                    placeholder="Search designations......"
                    setValue={this.setDesignation}
                  />
                </FormGroup>

                <FormGroup>
                  <DroplistComponent
                    data={departments}
                    field="name"
                    label="Change department"
                    placeholder="Search departments......"
                    setValue={this.setDepartment}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Change employment status</ControlLabel>
                  <select
                    className="form-control"
                    name="newStatus"
                    value={this.state.newStatus}
                    onChange={this.onChangeStatus}
                  >
                    <option value="0">select status</option>
                    {Object.values(EmploymentStatus()).map((val, index) => {
                      return <option key={index}>{val}</option>;
                    })}
                  </select>
                </FormGroup>

                <div className="text-center">
                  <Button
                    bsStyle="success"
                    bsSize="small"
                    onClick={this.saveChanges}
                  >
                    Save Designation
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </ChangeDestStyles>
    );
  }
}

export default ChangeDestAndStatus = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getAllUniversityDepartmentsAndDesignations"
    );
  }

  return {
    loading: subscription && !subscription.ready(),
    departments: UniversityUnits.find({}, { sort: { name: 1 } }).fetch(),
    designations: Designations.find().fetch()
  };
})(ChangeDestAndStatus);
