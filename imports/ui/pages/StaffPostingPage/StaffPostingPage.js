import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import TextField from "../../components/Common/TextFieldGroup";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import StaffPosting from "../../components/StaffPosting/StaffPosting";
import moment from "moment";

const StaffPostingStyle = styled.div`
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
    }
  }
  .staffPostingDiv {
    margin-top: 30px;
  }
`;

class StaffPostingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: "",
      submitted: false,
      designation: "0"
    };
    autoBind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.props.staffIdReactive.set(e.target.value);
    this.props.designationReactive.set("");
  }

  onSubmit(e) {
    if (this.state.staffId !== "" && e.keyCode == 13) {
      this.props.staffIdReactive.set(e.target.value);
      this.props.designationReactive.set("");
    }
  }

  onSelectChange(e) {
    this.setState({ designation: e.target.value });
    this.props.designationReactive.set(e.target.value);
    this.props.staffIdReactive.set("");
  }

  render() {
    const { designations, staff } = this.props;
    return (
      <StaffPostingStyle>
        <Row>
          <Col md={6}>
            <TextField
              name="staffId"
              placeholder="search by staffId"
              value={this.state.staffId}
              onChange={this.onChange}
              onKeyDown={this.onSubmit}
            />

            <select
              className="form-control"
              value={this.state.designation}
              onChange={this.onSelectChange}
            >
              <option value="0">select designation</option>
              {designations &&
                designations.map(({ rank }) => {
                  return (
                    <option value={rank} key={rank}>
                      {rank}
                    </option>
                  );
                })}
            </select>
          </Col>
        </Row>

        {staff && staff.length ? (
          <Row className="staffPostingDiv">
            <Col md={12}>
              {staff.map((staffMember, index) => {
                return [
                  <Col md={4} key={index}>
                    <StaffPosting
                      staffMember={staffMember}
                      department={designations}
                    />
                  </Col>
                ];
              })}
            </Col>
          </Row>
        ) : (
          <Row>
            {this.props.staffIdReactive.get() !== "" ||
            this.props.designationReactive.get() ? (
              <Col md={6}>
                <br />
                <Alert bsStyle="info">No staff data</Alert>
              </Col>
            ) : null}
          </Row>
        )}
      </StaffPostingStyle>
    );
  }
}

let staffIdReactive = new ReactiveVar("");
let designationReactive = new ReactiveVar("");

let query = {
  staffId: "",
  designation: "",
  postingProposed: { $exists: true, $eq: false }
};

export default (StaffPostingPageContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffbyDesignationAndStaffId",
      designationReactive.get(),
      staffIdReactive.get()
    );
  }

  if (staffIdReactive.get() !== "") {
    query.staffId = new RegExp("^" + staffIdReactive.get() + "$", "i");
    query.staffType = "Non Academic Staff";
    delete query.designation;
  }

  if (designationReactive.get() !== "") {
    query.designation = new RegExp("^" + designationReactive.get() + "$", "i");
    query.staffType = "Non Academic Staff";
    delete query.staffId;
  }

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    staff: StaffMembers.find(query).fetch(),
    staffIdReactive,
    designationReactive,
    designations: Designations.find().fetch() || []
  };
})(StaffPostingPage));
