import React from "react";
import styled from "styled-components";
import {
  Col,
  Row,
  Table,
  Label,
  FormGroup,
  ControlLabel,
  Button
} from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import { capAllFirstLetter } from "../../../modules/utilities";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
if (Meteor.isClient) {
  import "react-virtualized/styles.css";
}
import moment from "moment";

const splitFac = faculty => {
  if (faculty) {
    const split = faculty.split("/");
    return {
      faculty: split[0],
      dept: split[1]
    };
  }
};

const NewPensionDashboardStyles = styled.div`
  .pensionTable tr th {
    color: deepskyblue;
    background-color: #c0c0c0;
  }

  .Table {
    width: 100%;
    margin-top: 15px;
  }
`;

class NewPensionDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      staff: [],
      years: ""
    };
    autoBind(this);
  }

  onYearsChange(value) {
    this.setState({ years: value });
  }
  getStaffRetiring() {
    const { years } = this.state;
    this.setState({ loading: true });
    if (!years) return;
    const selectedYear = parseInt(years);
    Meteor.call("staffmembers.getstaffRetirement", selectedYear, (err, res) => {
      if (!err) {
        this.setState({ staff: res, loading: false, years: "" });
      } else {
        this.setState({ loading: false });
        Bert.alert(`Error: ${err}`, "danger");
      }
    });
  }

  render() {
    const TEMPLATE = "xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    const { staff, loading, submitted, years } = this.state;

    return (
      <NewPensionDashboardStyles>
        <Row>
          <Col md={12}>
            <Row>
              <Col md={2}>
                <FormGroup>
                  <ControlLabel>Year(s) to retirement:</ControlLabel>
                  <ReactInput
                    value={this.state.years}
                    onChange={value => this.onYearsChange(value)}
                    className="form-control"
                    parse={parse}
                    format={format}
                    placeholder="00"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                {years && (
                  <Button
                    bsStyle="success"
                    disabled={submitted ? true : false}
                    onClick={this.getStaffRetiring}
                  >
                    {submitted
                      ? "Please wait......."
                      : `Get staff due to Retire in ${years} years time`}
                  </Button>
                )}
              </Col>
            </Row>

            {!loading ? (
              <div>
                {staff.length ? (
                  <div>
                    <p className="lead text-center">
                      List of staff retiring in {years} year(s) time
                    </p>

                    <Table responsive striped bordered condensed>
                      <thead>
                        <tr>
                          <th>S/N</th>
                          <th>Staff ID</th>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>DOB</th>
                          <th> Period Left</th>
                        </tr>
                      </thead>

                      <tbody>
                        {staff.map(
                          (
                            {
                              staffId,
                              currentPosting,
                              designation,
                              dob,
                              biodata,
                              timeLeft
                            },
                            index
                          ) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <p>{staffId}</p>
                                </td>
                                <td>
                                  <p>
                                    {biodata.firstName} {biodata.middleName}{" "}
                                    {biodata.surname}
                                  </p>
                                </td>

                                <td>
                                  <p>{designation}</p>
                                </td>

                                <td>
                                  <p>
                                    {" "}
                                    <span>
                                      {capAllFirstLetter(
                                        splitFac(currentPosting).faculty
                                      )}
                                    </span>
                                    <br />
                                    <span>
                                      {capAllFirstLetter(
                                        splitFac(currentPosting).dept
                                      )}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p>{dob}</p>
                                </td>

                                <td>
                                  {timeLeft.includes("Retired") ? (
                                    <p>
                                      <Label bsStyle="success">
                                        {timeLeft}
                                      </Label>
                                    </p>
                                  ) : (
                                    <p>
                                      <Label bsStyle="info">{timeLeft}</Label>
                                    </p>
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p>No data for selected period</p>
                )}
              </div>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </NewPensionDashboardStyles>
    );
  }
}

export default NewPensionDashboard;
