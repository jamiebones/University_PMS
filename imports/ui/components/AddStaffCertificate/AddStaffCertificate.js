import React from "react";
import { Col, Row, FormGroup, ControlLabel, Button } from "react-bootstrap";
import styled from "styled-components";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
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
    const { cert, certYear } = this.state;
    const { certificates } = this.props.staff.qualifications;
    if (!cert && !certYear) return;
    const newCert = {
      cert,
      date: certYear
    };

    this.props.staffData(
      {
        staffDataKey: "qualifications",
        staffKey: "certificates",
        staffValue: certificates ? [...certificates, newCert] : [newCert]
      },
      "qualifications"
    );
    this.setState({ cert: "", certYear: "" });
  }

  removeCertificate(e, index) {
    const { certificates } = this.props.staff.qualifications;
    const certificatesArray = certificates || [];
    const remainCertificates = certificatesArray.filter(e => {
      return e !== certificatesArray[index];
    });

    this.props.staffData(
      {
        staffDataKey: "qualifications",
        staffKey: "certificates",
        staffValue: [...remainCertificates]
      },
      "qualifications"
    );
  }

  render() {
    const {
      staff: {
        qualifications: { certificates }
      }
    } = this.props;
    const TEMPLATE = "xxxx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    return (
      <StaffQualificationStyles>
        <Row>
          <Col md={4}>
            <div className="certForm">
              {certificates &&
                certificates.map(({ cert, date }, index) => {
                  return (
                    <p
                      key={index}
                      onClick={e => this.removeCertificate(e, index)}
                    >
                      {cert} : <span>{date}</span>
                    </p>
                  );
                })}
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
                <ControlLabel>Year obtained:</ControlLabel>
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
                {this.state.submitted ? "please wait" : "Save Certificate"}
              </Button>
            </div>
          </Col>
        </Row>
      </StaffQualificationStyles>
    );
  }
}

export default StaffQualification;
