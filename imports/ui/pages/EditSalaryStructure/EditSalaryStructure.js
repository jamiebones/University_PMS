import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import {
  Alert,
  Col,
  Row,
  Modal,
  ButtonToolbar,
  Button,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { SalaryScales } from "../../../api/SalaryScale/SalaryScaleClass";
import { RemoveStupidNairaSign } from "../../../modules/utilities";
import { _ } from "meteor/underscore";
import CurrencyInput from "react-currency-input";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
import autoBind from "react-autobind";
import SalaryStepComponent from "../../components/SalaryStepComponent/SalaryStepComponent";

const EditSalaryStructureStyle = styled.div`
  .scaleStyle {
    background-color: #fff;
    padding: 5px;
    margin: 5px;
  }
  .divStep {
    background-color: #08231d;
    padding: 5px;
    color: #fff;
    margin: 5px;
  }
  .sp {
    color: #4df3c7;
  }
  .val {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

class EditSalaryStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      show: false,
      stepEdited: {},
      step: "",
      amount: "",
      salaryType: "",
      stepNumber: "",
      scale: "",
      addStep: "",
      addAmount: "",
      addScale: ""
    };
    autoBind(this);
  }

  saveChanges() {
    const { amount, step, salaryType, stepEdited } = this.state;
    const editedStep = {
      step,
      salaryType,
      amount,
      stepEdited
    };
    Meteor.call("salaryscale.editstep", editedStep, err => {
      if (!err) {
        this.onHide();
        this.setState({
          salaryType: "",
          amount: "",
          step: ""
        });
        Bert.alert("New step added", "success");
      } else {
        Bert.alert(`Error: ${err}`, "danger");
      }
    });
  }

  addStepAndAmountToState({ step, amount, index }) {
    //index here represent the salary scale you presently updating
    this.setState({ addStep: step, addAmount: amount, addScale: index });
  }

  handleChange(event, maskedvalue, floatvalue) {
    this.setState({ amount: maskedvalue });
  }

  onStepChange(value) {
    this.setState({ step: value });
  }

  onHide() {
    this.setState({ show: !this.state.show });
  }

  showModal({ amount, step, salaryType }) {
    this.setState({
      show: !this.state.show,
      stepEdited: { amount, step, salaryType },
      amount,
      step,
      salaryType
    });
  }

  saveNewStep() {
    const { addStep, addAmount, addScale } = this.state;
    if (addStep == " " && addAmount == " " && addScale == " ") return;
    const newStep = {
      salaryType: addScale,
      step: addStep,
      amount: addAmount
    };
    Meteor.call("salaryscale.addnewstep", newStep, err => {
      if (!err) {
        this.setState({
          addStep: "",
          addAmount: "",
          addScale: "",
          amount: "",
          step: ""
        });
        Bert.alert("New step added", "success");
      } else {
        Bert.alert(`Error: ${err}`, "danger");
      }
    });
  }

  render() {
    const { salaryscale, loading } = this.props;
    const { show, stepEdited } = this.state;
    const TEMPLATE = "xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    return (
      <EditSalaryStructureStyle>
        <Row>
          <Col md={12}>
            {!loading ? (
              <div>
                {salaryscale.map(({ scale, salaryType }, index) => {
                  return (
                    <Col md={4} key={salaryType} className="scaleStyle">
                      <p>{salaryType}</p>
                      {scale.map(({ amount, step }, index) => {
                        return (
                          <div key={index} className="divStep">
                            <p>
                              <span className="sp">step:</span>{" "}
                              <span className="val">{step} </span>
                              <span className="sp">amount:</span>
                              <span className="val">
                                &#8358;
                                {RemoveStupidNairaSign(amount)}
                              </span>
                              <span className="pull-right">
                                <Button
                                  bsSize="xsmall"
                                  onClick={() =>
                                    this.showModal({ amount, step, salaryType })
                                  }
                                >
                                  Edit
                                </Button>
                              </span>
                            </p>
                          </div>
                        );
                      })}
                      <SalaryStepComponent
                        key={index}
                        index={salaryType}
                        setStepAndAmount={this.addStepAndAmountToState}
                      />
                      <Button bsSize="small" onClick={this.saveNewStep}>
                        Save new step
                      </Button>
                    </Col>
                  );
                })}
              </div>
            ) : (
              <Loading />
            )}
            <Modal show={show} onHide={this.onHide} bsSize="small">
              <Modal.Header closeButton>
                <Modal.Title />
              </Modal.Header>
              <Modal.Body>
                {!_.isEmpty(stepEdited) && (
                  <div>
                    <Row>
                      <Col md={12}>
                        <p>{this.state.salaryType}</p>
                        <hr />
                      </Col>

                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>Step:</ControlLabel>
                          <ReactInput
                            value={this.state.step}
                            onChange={value => this.onStepChange(value)}
                            className="form-control"
                            parse={parse}
                            format={format}
                            placeholder="00"
                          />
                        </FormGroup>
                      </Col>

                      <Col md={12}>
                        <FormGroup>
                          <ControlLabel>Amount:</ControlLabel>
                          <CurrencyInput
                            value={this.state.amount}
                            onChangeEvent={this.handleChange}
                            precision="2"
                            prefix="#"
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <ButtonToolbar>
                  <Button onClick={this.onHide}>Close</Button>
                  <button
                    className="btn btn-danger "
                    disabled={this.state.submitted}
                    onClick={this.saveChanges}
                  >
                    Save changes
                  </button>
                </ButtonToolbar>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </EditSalaryStructureStyle>
    );
  }
}

export default (EditSalaryStructureContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("salaryscale.getSalaryInDb");
  }

  return {
    loading: subscription && !subscription.ready(),
    salaryscale: SalaryScales.find({}).fetch()
  };
})(EditSalaryStructure));
