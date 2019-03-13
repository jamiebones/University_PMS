import React from "react";
import styled from "styled-components";
import { Button, Col, Row, FormGroup } from "react-bootstrap";
import autoBind from "react-autobind";
import Downshift from "downshift";

const Departments = [
  "SATS Personnel",
  "SBC",
  "Gossiping Dancing",
  "Gossiping mischieve",
  "Gossiping Blame game",
  "Faculty of Science",
  "Geography",
  "Panel stuffs",
  "Flashing",
  "Gossiping Postering",
  "Works",
  "White house",
  "Hell"
];

const StaffPostingStyles = styled.div`
  .downshift-dropdown {
    margin-left: 0.5px;
    width: 60%;
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
    font-style: italic;
    color: darkolivegreen;
  }
`;

class StaffPosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUnit: "",
      unitFrom: "",
      department: Departments,
      selectedDept: ""
    };
    autoBind(this);
  }

  onChange(department) {
    this.setState({ selectedDept: department });
  }

  proposePosting(staffId) {
    alert(staffId);
  }

  render() {
    const { biodata, designation, salaryStructure } = this.props.staffMember;
    const { department } = this.state;
    return (
      <StaffPostingStyles>
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
          Current Department:
          <span>{}</span>
        </p>

        <p>Former Departments</p>

        {this.state.selectedDept ? (
          <p>
            Proposed department : <span>{this.state.selectedDept}</span>
          </p>
        ) : null}

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
      </StaffPostingStyles>
    );
  }
}

export default StaffPosting;
