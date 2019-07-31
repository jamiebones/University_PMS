import React from "react";
import { Meteor } from "meteor/meteor";
import {
  Button,
  Col,
  Row,
  FormGroup,
  ButtonToolbar,
  ButtonGroup,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";
import { templateParser, templateFormatter, parseDigit } from "input-format";
import { ReactInput } from "input-format";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import SalaryStepComponent from "../../components/SalaryStepComponent/SalaryStepComponent";

const StyledAddSalaryStep = styled.div`
  .salaryStepDiv {
    background: #fff;
    padding: 5px;
    padding-left: 10px;
    margin-bottom: 10px;
    p {
      font-size: 15px;
    }

    .span2 {
      font-size: 15px;
      margin-left: 10px;
      color: black;
    }

    span {
      font-style: italics;
      font-size: 15px;
      color: green;
      margin-left: 10px;
    }
    .btnDiv {
      margin-top: 20px;
    }
    .lead {
      font-size: 16px;
    }
  }
`;

class AddSalaryStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: "",
      stepComponentNumber: [null],
      scale: "",
      submitted: false
    };
    autoBind(this);
  }

  filterNull(arr) {
    const newArr = arr.filter(component => {
      return component != null;
    });
    return newArr;
  }

  handleStepNumberChange(value) {
    this.setState({ stepNumber: value });
  }

  salaryScaleChange(e) {
    if (e.target.value === "0") return;
    this.setState({ scale: e.target.value });
  }

  addStepAndAmountToState({ step, amount, index }) {
    const salaryObject = {
      step,
      amount
    };
    let stateSalaryStep = this.state.stepComponentNumber;
    stateSalaryStep[index] = salaryObject;
    this.setState({ stepComponentNumber: stateSalaryStep });
  }

  addSalaryStepComponent() {
    this.setState({
      stepComponentNumber: [...this.state.stepComponentNumber, null]
    });
  }

  removeSalaryStepComponent(e, componentIndex) {
    const remaininingStepComponent = this.state.stepComponentNumber.filter(
      (component, index) => {
        return index != componentIndex;
      }
    );
    this.setState({ stepComponentNumber: remaininingStepComponent });
  }

  saveSalaryStruture() {
    const { stepComponentNumber, stepNumber, scale } = this.state;
    const salaryArray = this.filterNull(stepComponentNumber);
    const confirmSubmit = confirm(`
        Please confirm your entry. You are entering data for ${scale} ${stepNumber}. Kindly double check the entered figures.
      `);
    if (!confirmSubmit) return;
    const salaryObject = {
      scale,
      stepNumber,
      salaryArray
    };
    this.setState({ submitted: !this.state.submitted });
    Meteor.call("salaryScale.saveSalaryStructure", salaryObject, (err, res) => {
      if (err) {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert(`Error: ${err}`, "danger");
      } else {
        this.setState({
          submitted: !this.state.submitted,
          stepNumber: "",
          stepComponentNumber: [null],
          scale: ""
        });
        Bert.alert("Salary structure added successfully", "success");
      }
    });
  }

  render() {
    const TEMPLATE = "xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    const { submitted } = this.state;
    return (
      <StyledAddSalaryStep>
        <Row>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Salary Scale </ControlLabel>
                  <select
                    className="form-control"
                    onChange={this.salaryScaleChange}
                  >
                    <option value="0">select salary scale</option>
                    <option value="CONTISS">CONTISS</option>
                    <option value="CONMESS">CONMESS</option>
                    <option value="CONUAS">CONUAS</option>
                  </select>
                </FormGroup>
                <HelpBlock>
                  <p>
                    <b>Enter salary scale number below</b>
                  </p>
                </HelpBlock>
                <FormGroup>
                  <ControlLabel>Scale Number</ControlLabel>

                  <ReactInput
                    value={this.state.stepNumber}
                    onChange={value => this.handleStepNumberChange(value)}
                    className="form-control"
                    parse={parse}
                    format={format}
                    placeholder="00"
                  />
                </FormGroup>

                {this.state.stepNumber && this.state.scale && (
                  <p className="lead text-info">
                    Entering salary amount for {this.state.scale}{" "}
                    {this.state.stepNumber}
                  </p>
                )}

                {this.state.stepNumber && this.state.scale && (
                  <div>
                    {this.state.stepComponentNumber.map((com, index) => {
                      return (
                        <SalaryStepComponent
                          key={index}
                          index={index}
                          setStepAndAmount={this.addStepAndAmountToState}
                        />
                      );
                    })}

                    <ButtonToolbar>
                      <ButtonGroup>
                        <Button
                          onClick={this.addSalaryStepComponent}
                          bsSize="small"
                          bsStyle="info"
                        >
                          Add more salary step
                        </Button>

                        {this.state.stepComponentNumber.length > 0 && (
                          <Button
                            onClick={e =>
                              this.removeSalaryStepComponent(
                                e,
                                this.state.stepComponentNumber.length - 1
                              )
                            }
                            bsSize="small"
                            bsStyle="danger"
                          >
                            Remove salary step
                          </Button>
                        )}
                      </ButtonGroup>
                    </ButtonToolbar>
                  </div>
                )}
              </Col>

              <Col md={4} mdOffset={1}>
                {this.filterNull(this.state.stepComponentNumber).map(
                  ({ step, amount }, i) => {
                    return (
                      <div key={i} className="salaryStepDiv">
                        <p>
                          Step : <span>{step}</span>{" "}
                          <span className="span2">Salary :</span>
                          <span>{amount}</span>
                        </p>
                      </div>
                    );
                  }
                )}

                {this.filterNull(this.state.stepComponentNumber).length > 0 && (
                  <div className="btnDiv">
                    <Button
                      disabled={submitted}
                      onClick={this.saveSalaryStruture}
                    >
                      {submitted ? "please wait......." : "Save salary details"}
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </StyledAddSalaryStep>
    );
  }
}

export default AddSalaryStep;
