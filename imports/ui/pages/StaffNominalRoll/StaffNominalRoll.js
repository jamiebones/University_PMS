/* eslint-disable */
import React from "react";
import { Row, Col, FormGroup, ControlLabel } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import Loading from "../../components/Loading/Loading";
import Downshift from "downshift";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { UniversityUnits } from "../../../api/UniversityUnit/UniversityUnitClass";
import autoBind from "react-autobind";
import { RemoveSlash } from "../../../modules/utilities";

const NominalRowStyles = styled.div`
  .Collapsible__trigger {
    background: #79b959;
    font-size: 15px;
    color: #222323;
  }

  .Collapsible {
    background-color: #fff;
  }

  //The content within the collaspable area
  .Collapsible__contentInner {
    padding: 10px;
    border: 1px solid #9e9c89;
    border-top: 0;

    p {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  //The link which when clicked opens the collapsable area
  .Collapsible__trigger {
    display: block;
    font-weight: 400;
    text-decoration: none;
    position: relative;
    border: 1px solid white;
    padding: 10px;
    background: #3d509c;
    color: #e2f0f5;
    font-size: 16px;
    cursor: pointer;

    &:after {
      font-family: "FontAwesome";
      content: "\f107";
      position: absolute;
      right: 10px;
      top: 10px;
      display: block;
      transition: transform 300ms;
    }

    &.is-open {
      &:after {
        transform: rotateZ(180deg);
      }
    }

    &.is-disabled {
      opacity: 0.5;
      background-color: grey;
    }
  }

  .CustomTriggerCSS {
    background-color: lightcoral;
    transition: background-color 200ms ease;
  }

  .CustomTriggerCSS--open {
    background-color: darkslateblue;
  }

  .Collapsible__custom-sibling {
    padding: 5px;
    font-size: 12px;
    background-color: #cbb700;
    color: black;
  }
  .spantotal {
    text-align: right;
  }
  .staffDetails p:last-child {
    margin-bottom: 40px;
  }
  .staffDetails {
    p {
      padding: 5px;
    }

    hr {
      border: 10px;
    }

    span {
      background: #44a3cc;
      padding: 4px;
      color: #fff;
    }
  }

  .staffName {
    cursor: pointer;
  }

  .total {
    font-size: 18;
    font-style: oblique;
  }
`;

class StaffNominalRoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedDept: "" };
    autoBind(this);
  }

  onChange(name) {
    this.setState({ selectedDept: name });
    console.log(name);
    this.props.selectedDeptReactiveVar.set(name);
  }

  render() {
    const { department, loading, staff } = this.props;
    let total = 0;
    return (
      <NominalRowStyles>
        <Row>
          <Col md={12}>
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

            {staff.length != 0 ? (
              <p className="text-right total">
                <b>Total : {staff && staff.length}</b>
              </p>
            ) : null}

            {!loading ? (
              staff &&
              staff.map(
                ({ designation, biodata, staffId, salaryStructure }, index) => {
                  return (
                    <Col md={4} key={index}>
                      <div className="staffDetails">
                        <p
                          className="staffName"
                          onClick={() =>
                            this.props.history.push(
                              `/auth/record/${staffId && RemoveSlash(staffId)}`
                            )
                          }
                        >
                          Name :{" "}
                          <span>
                            {biodata.firstName} {biodata.middleName}{" "}
                            {biodata.surname}
                          </span>
                        </p>

                        <p>Designation :{designation}</p>

                        <p>Salary Scale: {salaryStructure}</p>

                        <p>Personal Number: {staffId}</p>
                      </div>
                    </Col>
                  );
                }
              )
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </NominalRowStyles>
    );
  }
}

let selectedDeptReactiveVar = new ReactiveVar("");

export default (StaffNominalRoll = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getNominalRollForDepartment",
      selectedDeptReactiveVar.get()
    );
  }

  let query = {
    currentPosting: selectedDeptReactiveVar.get()
  };

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    staff: StaffMembers.find(query).fetch(),
    m: console.log(StaffMembers.find(query).fetch()),
    department: UniversityUnits.find().fetch(),
    selectedDeptReactiveVar
  };
})(StaffNominalRoll));
