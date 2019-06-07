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

class ChangeDestAndStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      designation: "",
      dept: ""
    };
    autoBind(this);
  }

  componentDidMount() {
    this.props.selectedDeptReactiveVar.set("");
  }

  saveChanges() {
    const staffObject = {
      sex: this.state.sex,
      maritalStatus: this.state.maritalStatus,
      title: this.state.title,
      staffId: this.state.staffId
    };
    Meteor.call("staffMembers.saveChanges", staffObject, err => {
      if (!err) {
        Bert.alert("state changed successful", "success");
      } else {
        Bert.alert(`There was an error: ${error}`, "danger");
      }
    });
  }

  render() {
    const { biodata } = this.props.staff;
    return (
      <Row>
        <Col md={12}>
          <p>
            Name: {biodata.firstName} {biodata.middleName} {biodata.surname}
          </p>

          <p>Department: {currentPosting}</p>

          <p>Designation: {designation}</p>

          <hr />

          <FormGroup>
            <ControlLabel>Change dept</ControlLabel>
            <select
              className="form-control"
              name="dept"
              value={this.state.dept}
              onChange={this.onChange}
            >
              <option value="0">select department</option>
            </select>
          </FormGroup>

          <FormGroup>
            <ControlLabel>Change designation</ControlLabel>
            <select
              className="form-control"
              name="designation"
              value={this.state.designation}
              onChange={this.onChange}
            >
              <option value="0">select designation</option>
            </select>
          </FormGroup>

          <div className="text-center">
            <Button bsStyle="success" bsSize="small" onClick={this.saveChanges}>
              Save Designation
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}

export default (ChangeDestAndStatus = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getNominalRollForDepartment",
      selectedDeptReactiveVar.get()
    );
  }

  return {
    loading: subscription && !subscription.ready(),
    department: UniversityUnits.find().fetch(),
    designation: Designations.find().fetch()
  };
})(ChangeDestAndStatus));
