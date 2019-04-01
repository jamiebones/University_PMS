import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Alert, Button, Col, Row, FormGroup } from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { UniversityUnits } from "../../../api/UniversityUnit/UniversityUnitClass";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import Downshift from "downshift";
import autoBind from "react-autobind";
import {
  FindMax,
  FindTimeDifference,
  FindPostingSuccessful,
  FindDeptPostingProposedTo
} from "../../../modules/utilities";
import DatePicker from "react-datepicker";
if (Meteor.isClient) import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const StaffProposePostingStyle = styled.div`
  .staffcard {
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
    p {
      line-height: 30px;
    }
  }
  .staffdetails {
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
    p {
      line-height: 30px;
    }
  }
  .downshift-dropdown {
    margin-left: 0.5px;
    width: 50%;
    border: 1px solid whitesmoke;
    border-bottom: none;
  }
  .dropdown-item {
    padding: 0.9rem;
    cursor: pointer;
    border-bottom: 1px solid whitesmoke;
    font-size: 1.3rem;
    text-align: left;
  }
  .dropdown-button {
    padding: 0.6rem;
    border-radius: 3px;
    background: white;
    cursor: pointer;
  }
  span {
    padding: 5px;
    margin: 5px;
    font-style: italic;
    color: darkolivegreen;
  }
  .formerDept {
    padding: 5px;
  }
  button {
    margin-top: 20px;
  }
  #deptInput {
    width: 60%;
  }
`;

class StaffProposePostingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      department: [],
      selectedDept: "",
      startDate: moment()
    };
    autoBind(this);
  }

  onChange(name) {
    this.setState({ selectedDept: name });
    this.props.selectedDeptReactiveVar.set(name);
  }

  proposePosting() {
    const {
      biodata,
      postings,
      designation,
      staffId,
      currentPosting
    } = this.props.location.state;
    const newDept = this.state.selectedDept;
    let currentDept = currentPosting;
    const staffName = `${biodata.firstName} ${biodata.middleName} ${
      biodata.surname
    }`;
    const previousPostings = postings || [];
    //if currentDept === "" or null
    if (newDept === "") {
      Bert.alert(
        `Select the department you are posting ${staffName} to`,
        "danger"
      );
      return;
    }
    if (currentDept == "") {
      //we have a first posting
      currentDept = "first posting";
    }

    const startingDate = moment(this.state.startDate).toISOString();
    const posting = {
      staffId,
      staffName,
      designation,
      unitFrom: currentDept,
      newUnit: newDept,
      startingDate,
      previousPostings
    };

    if (currentDept === newDept) {
      Bert.alert(
        `${staffName} cannot be posted to the same department he is 
                  currently in`,
        "danger"
      );
      return;
    }

    const confirmPostingDetails = confirm(`Please confirm the posting details:
                                            Name : ${staffName}
                                            Proposed Department: ${newDept}
                                            Resumption Date: ${moment(
                                              startingDate
                                            ).format("MMMM DD YYYY")}
                                        `);

    if (confirmPostingDetails) {
      //we go to save
      this.setState({ submitted: !this.state.submitted });
      Meteor.call(
        "staffposting.proposeNewPosting",
        posting,
        (error, response) => {
          if (!error) {
            this.setState({ submitted: !this.state.submitted });
            Bert.alert(
              "Proposed posting successful. Awaiting the Director's approval",
              "success"
            );
            //redirect to search page
            this.props.history.push("/auth/staff_posting");
          } else {
            this.setState({ submitted: !this.state.submitted });
            Bert.alert(`There was an error ${error}`, "danger");
          }
        }
      );
    }
  }

  handleChange(date) {
    this.setState({ startDate: date });
  }

  render() {
    const { department, staffInUnit } = this.props;
    const { selectedDept } = this.state;
    const {
      biodata,
      postings,
      designation,
      salaryStructure,
      staffId,
      currentPosting
    } = this.props.location.state;

    return (
      <StaffProposePostingStyle>
        <Row>
          <Col md={6}>
            <div className="staffdetails">
              <p>
                Name: {biodata.firstName} {biodata.middleName} {biodata.surname}
              </p>

              <p>Designation : {designation}</p>

              <p>Salary Step: {salaryStructure}</p>

              <p>Staff ID : {staffId}</p>

              <p>Current Department: {currentPosting}</p>

              <p>
                Time spent in current Unit :
                {postings &&
                  postings.length &&
                  FindTimeDifference(
                    FindPostingSuccessful(
                      postings[FindMax(postings, "serial") - 1].postingDate
                    ),
                    moment().format("MMMM DD YYYY")
                  )}
              </p>

              <FormGroup>
                <Downshift
                  onChange={this.onChange}
                  itemToString={department =>
                    department ? `${department}` : ""
                  }
                >
                  {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem,
                    getLabelProps
                  }) => (
                    <div>
                      <label
                        style={{ marginTop: "1rem", display: "block" }}
                        {...getLabelProps()}
                      >
                        Select a Department/Unit
                      </label>

                      <input
                        {...getInputProps({
                          placeholder: "Search department..."
                        })}
                        className="form-control"
                        id="deptInput"
                      />

                      {isOpen ? (
                        <div className="downshift-dropdown">
                          {// filter the books and return items that match the inputValue
                          department &&
                            department
                              .filter(
                                item =>
                                  !inputValue ||
                                  item.name
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                              )
                              // map the return value and return a div
                              .map(({ name }, index) => (
                                <div
                                  className="dropdown-item"
                                  {...getItemProps({
                                    key: index + name,
                                    index,
                                    item: name
                                  })}
                                  style={{
                                    backgroundColor:
                                      highlightedIndex === index
                                        ? "lightgray"
                                        : "white",
                                    fontWeight:
                                      selectedItem === name ? "bold" : "normal"
                                  }}
                                >
                                  {name}
                                </div>
                              ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </Downshift>
              </FormGroup>

              <FormGroup>
                <p>Resumption Date:</p>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleChange}
                  minDate={new Date()}
                  className="form-control"
                  placeholderText="Select a date for resumption"
                />
              </FormGroup>

              <Button
                bsSize="small"
                disabled={this.state.submitted}
                bsStyle="success"
                onClick={this.proposePosting}
              >
                {this.state.submitted ? "please wait" : "propose posting"}
              </Button>
            </div>
          </Col>

          <Col md={6}>
            <div className="staffcard">
              <p>{selectedDept ? `SELECTED UNIT: ${selectedDept}` : null}</p>

              <p>TOTAL : {staffInUnit && staffInUnit.length}</p>
            </div>

            {staffInUnit && staffInUnit.length
              ? staffInUnit.map(
                  (
                    {
                      biodata,
                      postings,
                      designation,
                      salaryStructure,
                      certificate,
                      currentPosting,
                      postingProposed
                    },
                    index
                  ) => {
                    return (
                      <div className="staffcard" key={index}>
                        <p>
                          Name: {biodata.firstName} {biodata.middleName}{" "}
                          {biodata.surname}
                        </p>
                        <p>Designation : {designation}</p>
                        <p>Salary Step : {salaryStructure}</p>

                        <p>
                          Time spent in current Unit :
                          {postings &&
                            postings.length &&
                            FindTimeDifference(
                              FindPostingSuccessful(
                                postings[FindMax(postings, "serial") - 1]
                              ).postingDate,
                              moment().format("MMMM DD YYYY")
                            )}
                        </p>

                        <p>
                          {postingProposed
                            ? `Proposed Department: ${FindDeptPostingProposedTo(
                                postings
                              )}`
                            : null}
                        </p>
                      </div>
                    );
                  }
                )
              : null}
          </Col>
        </Row>
      </StaffProposePostingStyle>
    );
  }
}

let selectedDeptReactiveVar = new ReactiveVar("");

export default (StaffProposePostingPageContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffInDepartment",
      selectedDeptReactiveVar.get()
    );
  }

  let query = {
    currentPosting: selectedDeptReactiveVar.get(),
    staffType: "2"
  };

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    staffInUnit: StaffMembers.find(query).fetch(),
    department: UniversityUnits.find().fetch(),
    selectedDeptReactiveVar
  };
})(StaffProposePostingPage));
