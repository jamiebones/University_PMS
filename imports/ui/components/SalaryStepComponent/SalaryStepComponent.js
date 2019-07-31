import React from "react";
import CurrencyInput from "react-currency-input";
import { Col, Row, FormGroup, ControlLabel } from "react-bootstrap";
import styled from "styled-components";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
import autoBind from "react-autobind";

const SalaryStepComponentStyles = styled.div``;

class SalaryStepComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: "",
      amount: ""
    };
    autoBind(this);
  }

  handleChange(event, maskedvalue, floatvalue) {
    this.setState({ amount: maskedvalue }, () => {
      //set the props here
      this.props.setStepAndAmount({
        step: this.state.step,
        amount: this.state.amount,
        index: this.props.index
      });
    });
  }

  onStepChange(value) {
    this.setState({ step: value }, () => {
      //set the props here
      this.props.setStepAndAmount({
        step: this.state.step,
        amount: this.state.amount,
        index: this.props.index
      });
    });
  }

  render() {
    const TEMPLATE = "xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    return (
      <SalaryStepComponentStyles>
        <Row>
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

          <Col md={8}>
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
      </SalaryStepComponentStyles>
    );
  }
}

export default SalaryStepComponent;
