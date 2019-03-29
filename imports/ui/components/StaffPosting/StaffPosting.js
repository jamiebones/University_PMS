import React from "react";
import styled from "styled-components";
import { Button, Col, Row, FormGroup, Label, Image } from "react-bootstrap";
import autoBind from "react-autobind";
import Downshift from "downshift";
import DatePicker from "react-datepicker";
if (Meteor.isClient) import "react-datepicker/dist/react-datepicker.css";
import { Bert } from "meteor/themeteorchef:bert";
import moment from "moment";
import {
  FindMax,
  FindTimeDifference,
  SortPostingDuration
} from "../../../modules/utilities";

const Departments = [
  "SATS Personnel",
  "Senate Business Committee",
  "Staff Records Unit",
  "Faculty of Science",
  "Faculty of Law",
  "Chemistry Deparment",
  "Physics Department",
  "Faculty of Science"
];

const StaffPostingStyles = styled.div`
  .postingdiv: {
    margin: 2px solid red;
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

class StaffPosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUnit: "",
      unitFrom: "",
      department: Departments,
      selectedDept: "",
      currentDept: "",
      startDate: moment()
    };
    autoBind(this);
  }

  onChange(department) {
    this.setState({ selectedDept: department });
  }

  proposePosting(staffId) {
    const {
      biodata,
      postings,
      currentPosting,
      designation
    } = this.props.staffMember;
    const newDept = this.state.selectedDept;
    let currentDept = currentPosting || "";
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
      Bert.alert(`${staffName} cannot be posted to the same department he is 
                  currently in`);
      return;
    }

    const confirmPostingDetails = confirm(`Please confirm the posting details:
                                            Name : ${staffName}
                                            Proposed Department: ${newDept}
                                            Resumption Date: ${startingDate}
                                        `);

    if (confirmPostingDetails) {
      //we go to save
      Meteor.call(
        "staffposting.proposeNewPosting",
        posting,
        (error, response) => {
          if (!error) {
            Bert.alert("Proposed posting successful", "success");
          } else {
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
    const {
      biodata,
      designation,
      salaryStructure,
      staffId,
      currentPosting,
      postings
    } = this.props.staffMember;
    const { department } = this.state;
    return (
      <StaffPostingStyles>
        <Row>
          <Col md={8}>
            <div className="postingdiv">
              <p>
                Name:
                <span>
                  {biodata && biodata.firstName} {biodata && biodata.middleName}{" "}
                  {biodata && biodata.surname}
                </span>
              </p>

              <p>
                Designation:<span>{designation}</span>
              </p>

              <p>
                Salary Level:
                <span>{salaryStructure}</span>
              </p>

              <p>
                Current Department:{" "}
                {currentPosting ? (
                  <Label bsStyle="success" bsSize="small">
                    {" "}
                    <span>{currentPosting}</span>
                  </Label>
                ) : null}
              </p>

              <p>
                Time spent in current Unit :{" "}
                <span>
                  {postings &&
                    postings.length &&
                    FindTimeDifference(
                      postings[FindMax(postings, "serial") - 1].postingDate,
                      moment().format("MMMM DD YYYY")
                    )}
                </span>
              </p>

              <div>
                Former Departments:
                <div className="formerDept">
                  {postings && postings.length ? (
                    SortPostingDuration(postings).map(
                      ({ unit, duration }, index) => {
                        return (
                          <p key={index}>
                            {unit} : {duration}
                            <br />
                          </p>
                        );
                      }
                    )
                  ) : (
                    <p>No former department</p>
                  )}
                </div>
              </div>

              {this.state.selectedDept ? (
                <p>
                  Proposed department : <span>{this.state.selectedDept}</span>
                </p>
              ) : null}

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
                                  item
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                              )
                              // map the return value and return a div
                              .map((item, index) => (
                                <div
                                  className="dropdown-item"
                                  {...getItemProps({
                                    key: item,
                                    index,
                                    item
                                  })}
                                  style={{
                                    backgroundColor:
                                      highlightedIndex === index
                                        ? "lightgray"
                                        : "white",
                                    fontWeight:
                                      selectedItem === item ? "bold" : "normal"
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </Downshift>
              </FormGroup>

              <FormGroup>
                <Button
                  bsStyle="danger"
                  bsSize="small"
                  onClick={() => this.proposePosting(staffId)}
                >
                  {this.state.submitted
                    ? "proposing please wait ...."
                    : `Proposed Posting`}
                </Button>
              </FormGroup>
            </div>
          </Col>

          <Col md={4}>
            <Image
              responsive
              src={
                biodata && biodata.profilePicture
                  ? biodata.profilePicture
                  : "/image/noImage.png"
              }
            />
          </Col>
        </Row>
      </StaffPostingStyles>
    );
  }
}

export default StaffPosting;
