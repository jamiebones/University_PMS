import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Alert, Label, Col, Row, Table } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import TextField from "../../components/Common/TextFieldGroup";
import { Link } from "react-router-dom";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import { RemoveSlash } from "../../../modules/utilities";

const SearchStaffRecordsStyle = styled.div`
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
    }
  }
  .SearchStaffRecordsDiv {
    margin-top: 30px;
  }
  .divSearchArea {
    border: 2px solid;
    background: #337547;
    padding: 30px;
  }
  .lead {
    color: #af2222;
  }
`;

class SearchStaffRecordsPage extends React.Component {
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
      <SearchStaffRecordsStyle>
        <Row>
          <Col md={6} mdOffset={2}>
            <div className="divSearchArea">
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
            </div>
          </Col>
        </Row>

        {staff && staff.length ? (
          <Row className="SearchStaffRecordsDiv">
            <Col md={12}>
              <Table responsive striped>
                <caption>
                  <p className="lead">
                    Viewing Records for{" "}
                    {this.props.designationReactive.get()
                      ? this.props.designationReactive.get()
                      : this.props.staffIdReactive.get()}{" "}
                  </p>
                </caption>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(({ biodata, designation, staffId }, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <p>{index + 1}</p>
                        </td>
                        <td>
                          <p>
                            {biodata.firstName} {biodata.middleName}{" "}
                            {biodata.surname}
                          </p>
                        </td>
                        <td>
                          <p>{designation}</p>
                        </td>
                        <td>
                          <p>
                            <Link
                              className="btn btn-info xsmall"
                              to={`/auth/record/${staffId &&
                                RemoveSlash(staffId)}`}
                            >
                              View Record
                            </Link>
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
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
      </SearchStaffRecordsStyle>
    );
  }
}

let staffIdReactive = new ReactiveVar("");
let designationReactive = new ReactiveVar("");

let query = {
  staffId: "",
  designation: ""
};

export default (SearchStaffRecordsPageContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getAllStaffbyDesignationAndStaffId",
      designationReactive.get(),
      staffIdReactive.get()
    );
  }

  if (staffIdReactive.get() !== "") {
    query.staffId = staffIdReactive
      .get()
      .trim()
      .toUpperCase();
    delete query.designation;
  }

  if (designationReactive.get() !== "") {
    query.designation = designationReactive.get();

    delete query.staffId;
  }

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    staff: StaffMembers.find(query).fetch(),
    staffIdReactive,
    designationReactive,
    designations: Designations.find({}, { sort: { ranK: 1 } }).fetch() || []
  };
})(SearchStaffRecordsPage));
