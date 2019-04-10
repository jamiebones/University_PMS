import React from "react";
import { Col, Row, FormGroup, ControlLabel, Button } from "react-bootstrap";
import styled from "styled-components";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import { Bert } from "meteor/themeteorchef:bert";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
import { Meteor } from "meteor/meteor";
import autoBind from "react-autobind";

const StaffQualificationStyles = styled.div`
  p {
    font-size: 15px;
    font-style: oblique;
    background: #227742;
    margin-bottom: 5px;
    color: #fff;
    padding: 5px;
  }

  span {
    padding-left: 10px;
    color: orange;
    font-weight: 400;
  }

  .certForm {
    margin-top: 15px;
  }
`;

class StaffQualification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      certYear: "",
      cert: "",
      submitted: false
    };
    autoBind(this);
  }

  onCertYearChange(value) {
    this.setState({ certYear: value });
  }

  onChange(e) {
    this.setState({ cert: e.target.value });
  }

  saveCertificate() {
    const cert = this.state.cert;
    const date = this.state.certYear;
    const staffId = this.props.staffId;
    const name = this.props.user;

    if (cert == "" && date == "") {
      Bert.alert("Certificate and date is required", "danger");
      return;
    }

    const confirmSubmit = confirm(
      `You are adding a certificate: ${cert} || year: ${date}. This action is logged `
    );

    if (!confirmSubmit) return;

    Meteor.call(
      "staffMembers.addCertificate",
      cert,
      date,
      staffId,
      name,
      err => {
        if (!err) {
          Bert.alert(`Certificate added`, "success");
          this.setState({ submitted: !this.state.submitted });
        } else {
          this.setState({ submitted: !this.state.submitted });
          Bert.alert(`There was an error: ${error}`, "danger");
        }
      }
    );
  }

  render() {
    const TEMPLATE = "xxxx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    const { certificate } = this.props;
    return (
      <StaffQualificationStyles>
        <Row>
          <Col md={4} mdOffset={1}>
            {certificate &&
              certificate.map(({ cert, date }, index) => {
                return (
                  <p key={index}>
                    {cert} : <span>{date}</span>
                  </p>
                );
              })}

            {GetDetailsBasedOnRole("Records", "Personnel") ? (
              <div className="certForm">
                <FormGroup>
                  <ControlLabel>Certificate</ControlLabel>
                  <input
                    type="text"
                    name="certificate"
                    value={this.state.cert}
                    onChange={this.onChange}
                    className="form-control"
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Promotion year:</ControlLabel>
                  <ReactInput
                    value={this.state.certYear}
                    onChange={value => this.onCertYearChange(value)}
                    className="form-control"
                    parse={parse}
                    format={format}
                    placeholder="0000"
                  />
                </FormGroup>

                <Button
                  bsSize="small"
                  bsStyle="success"
                  disabled={this.state.submitted}
                  onClick={this.saveCertificate}
                >
                  {this.state.submitted ? "please wait" : "Update Certificate"}
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </StaffQualificationStyles>
    );
  }
}

export default StaffQualification;
