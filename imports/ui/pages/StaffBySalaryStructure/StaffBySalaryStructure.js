import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Label } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import { capAllFirstLetter, SplitFacultDept } from "../../../modules/utilities";

import moment from "moment";

const StaffBySalaryStructureStyles = styled.div`
  .sel {
    margin-top: 20px;
  }
`;

class StaffBySalaryStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingScale: true,
      loading: null,
      staff: [],
      salaryScale: [],
      selectedContiss: ""
    };
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("staffmembers.groupStaffBySalaryScale", (err, scale) => {
      if (!err) {
        this.setState({ loadingScale: false, salaryScale: scale });
      }
    });
  }

  onChange(e) {
    e.preventDefault();
    if (e.target.value == "0") return;
    this.setState({ selectedContiss: e.target.value });
    const scale = e.target.value;
    this.setState({ loading: true });
    Meteor.call("staffmembers.getStaffBySalaryScale", scale, (err, staff) => {
      if (!err) {
        this.setState({ loading: false, staff: staff });
      } else {
        Bert.alert(`Error: ${err}`, "danger");
      }
    });
  }

  render() {
    const {
      staff,
      loadingScale,
      salaryScale,
      loading,
      selectedContiss
    } = this.state;

    return (
      <StaffBySalaryStructureStyles>
        <Row>
          <Col md={12}>
            <Row>
              <Col md={6} mdOffset={3}>
                <select className="form-control" onChange={this.onChange}>
                  {loadingScale ? (
                    <option>loading scale please wait.......</option>
                  ) : (
                    <React.Fragment>
                      <option value="0">select a salary scale</option>
                      {salaryScale &&
                        salaryScale.map(scale => {
                          return (
                            <option key={scale} value={scale}>
                              {scale}
                            </option>
                          );
                        })}
                    </React.Fragment>
                  )}
                </select>
              </Col>
            </Row>
            {!loading ? (
              <div>
                {selectedContiss && (
                  <p className="lead text-center sel">
                    Staff on {capAllFirstLetter(selectedContiss)}
                  </p>
                )}

                {staff.length ? (
                  <Table responsive striped bordered condensed>
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Salary Structure</th>
                        <th>Qualification</th>
                        <th>Last Promotion</th>
                      </tr>
                    </thead>

                    <tbody>
                      {staff.map(
                        (
                          {
                            staffId,
                            currentPosting,
                            designation,
                            biodata,
                            salaryStructure,
                            dateOfLastPromotion,
                            certificate
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
                                    {currentPosting &&
                                      capAllFirstLetter(
                                        SplitFacultDept(currentPosting).faculty
                                      )}
                                  </span>
                                  <br />
                                  <span>
                                    {currentPosting &&
                                      capAllFirstLetter(
                                        SplitFacultDept(currentPosting).dept
                                      )}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <p>{salaryStructure}</p>
                              </td>

                              <td>
                                {certificate.map(({ cert, date }, index) => {
                                  return (
                                    <p key={index}>
                                      <span>
                                        {cert} {date}
                                      </span>
                                    </p>
                                  );
                                })}
                              </td>

                              <td>
                                <p>{dateOfLastPromotion}</p>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                ) : null}
              </div>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </StaffBySalaryStructureStyles>
    );
  }
}

export default StaffBySalaryStructure;
