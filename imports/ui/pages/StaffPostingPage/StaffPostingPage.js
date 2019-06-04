import React from "react";
import { Meteor } from "meteor/meteor";
import { Alert, Col, Row } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { StaffReliefPostings } from "../../../api/StaffReliefPosting/StaffReliefPostingClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import TextField from "../../components/Common/TextFieldGroup";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import StaffProposePosting from "../../components/StaffProposePosting/StaffProposePosting";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
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
              <option value="0" disabled>
                select designation
              </option>
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
              <StaffProposePosting staffMember={staff} />;
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
let loadingVar = new ReactiveVar(true);

let query = {
  staffId: "",
  designation: "",
  postingProposed: { $exists: true, $eq: false }
};

export default (StaffPostingPageContainer = withTracker(props => {
  let subscription;
  let staffArray = [];
  let staffOnRelief = [];
  let finalArray = [];
  let reliefArray = [];
  let designations = [];
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffbyDesignationAndStaffId",
      designationReactive.get(),
      staffIdReactive.get()
    );
  }

  //check if the person is in sats or jse

  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    query.staffClass = "Senior Staff";
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    query.staffClass = "Junior Staff";
  }

  if (staffIdReactive.get() !== "") {
    query.staffId = staffIdReactive.get().toUpperCase();
    query.staffType = "2";
    delete query.designation;
  }

  if (designationReactive.get() !== "") {
    query.designation = designationReactive.get();
    query.staffType = "2";
    delete query.staffId;
  }
  if (subscription && subscription.ready()) {
    staffArray = StaffMembers.find(query).fetch();
    console.log(staffArray);
    const today = moment(new Date()).toISOString();
    reliefArray = StaffReliefPostings.find({
      status: "approved",
      reliefEnd: {
        $gte: today
      }
    }).fetch();
    designations = Designations.find({}, { sort: { rank: 1 } }).fetch();
    //loop through the staff members array
    //if we have a posting object add it.
    let arrayNumToRemove = [];
    for (let i = 0; i < staffArray.length - 1; i++) {
      //individual array
      const staffObj = staffArray[i];
      //find if the staff is on relief duty
      const findRelief = reliefArray.find(e => {
        return (
          e.reliever_staffId.toUpperCase() == staffObj.staffId.toUpperCase()
        );
      });
      if (findRelief) {
        //idiot is on relief duty add the relief to staff duty
        staffObj.reliefDuty = findRelief;
        //remove the object from the array
        staffOnRelief.push(staffObj);
        arrayNumToRemove.push(i);
      } else {
        continue;
      }
    }
    //remove item from the saved array index
    arrayNumToRemove.map(num => {
      staffArray.splice(num, 1);
    });
    //concatenate the array together
    finalArray = [...staffArray, ...staffOnRelief];
    loadingVar.set(false);
  }

  return {
    loading: loadingVar.get(),
    staff: finalArray,
    staffIdReactive,
    designationReactive,
    designations: designations
  };
})(StaffPostingPage));
