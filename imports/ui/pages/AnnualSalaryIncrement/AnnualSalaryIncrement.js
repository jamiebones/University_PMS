/*eslint-disable */
import React from "react";
import { Row, Col, FormGroup, ControlLabel, Button } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import autoBind from "react-autobind";

class AnnualSalaryIncrement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      year: ""
    };
    autoBind(this);
  }

  onChange(e) {
    if (e.target.value == "0") return;
    this.setState({ year: e.target.value });
  }

  applyAnnualIncrement() {
    const { year } = this.state;
    this.setState({ submitted: !this.state.submitted });
    if (year == "") {
      Bert.alert(
        "Please select the year you are applying the increment to",
        "danger"
      );
      return;
    }
    Meteor.call("salaryYear.applyAnnualIncrement", year, err => {
      if (!err) {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert("Annual increment applied to staff members", "success");
      } else {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert(`${err}`, "danger");
      }
    });
  }

  render() {
    return (
      <Row>
        <Col md={6} mdOffset={3}>
          <FormGroup>
            <ControlLabel>Increment Year</ControlLabel>
            <select className="form-control" onChange={this.onChange}>
              <option value="0">select year</option>
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>
            </select>
          </FormGroup>

          <Button
            type="submit"
            bsStyle="success"
            disabled={this.state.submitted ? true : false}
            onClick={this.applyAnnualIncrement}
          >
            {this.state.submitted
              ? "Please wait....."
              : "Apply annual increment"}
          </Button>
        </Col>
      </Row>
    );
  }
}

export default AnnualSalaryIncrement;
