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
  SortPostingDuration,
  FindDeptPostingProposedTo
} from "../../../modules/utilities";
import moment from "moment";

const StaffProposePostingStyle = styled.div`
  .staffcard: {
    margin: 2px solid red;
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
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
      selectedDept: ""
    };
    autoBind(this);
  }

  onChange(name) {
    this.setState({ selectedDept: name });
    this.props.selectedDeptReactiveVar.set(name);
  }

  render() {
    const { department, staffInUnit } = this.props;
    const { selectedDept } = this.state;
    console.log(this.props.location.state);
    return (
      <StaffProposePostingStyle>
        <Row>
          <Col md={6} />

          <Col md={6}>
            <FormGroup>
              <Downshift
                onChange={this.onChange}
                itemToString={department => (department ? `${department}` : "")}
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

            <p>{selectedDept ? `Selected Unit: ${selectedDept}` : null}</p>

            {staffInUnit &&
              staffInUnit.length &&
              staffInUnit.map(
                (
                  {
                    biodata,
                    postings,
                    designation,
                    salaryStructure,
                    certificate,
                    currentPosting
                  },
                  index
                ) => {
                  return (
                    <div className="staffcard" key={index}>
                      <p>
                        Name: {biodata.firstName} {biodata.MiddleName}
                        {biodata.surname}
                      </p>
                      <p>Designation : {designation}</p>
                      <p>Rank : {salaryStructure}</p>

                      <p>
                        {currentPosting}
                        <br />
                        Time spent in current Unit :{" "}
                        <span>
                          {postings &&
                            postings.length &&
                            FindTimeDifference(
                              postings[FindMax(postings, "serial") - 1]
                                .postingDate,
                              moment().format("MMMM DD YYYY")
                            )}
                        </span>
                      </p>
                    </div>
                  );
                }
              )}
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
    currentPosting: new RegExp("^" + selectedDeptReactiveVar.get() + "$", "i"),
    staffType: "2"
  };

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    staffInUnit: StaffMembers.find(query).fetch(),
    m: console.log(StaffMembers.find(query).fetch()),
    department: UniversityUnits.find().fetch(),
    selectedDeptReactiveVar
  };
})(StaffProposePostingPage));
