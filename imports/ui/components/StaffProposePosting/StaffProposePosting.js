import React from "react";
import styled from "styled-components";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import moment from "moment";
import {
  FindMax,
  FindTimeDifference,
  SortPostingDuration,
  GetRealTimeStatus,
  CheckForNegativeDate
} from "../../../modules/utilities";

const StaffProposePostingStyles = styled.div`
  .postingdiv: {
  }
`;

class StaffProposePosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  render() {
    const { staffMember } = this.props;
    return (
      <StaffProposePostingStyles>
        <Row>
          <Col md={12}>
            <Table responsive striped condensed bordered>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>NAME</th>
                  <th>DESIGNATION</th>
                  <th>SALARY LEVEL</th>
                  <th>PF NUMBER</th>
                  <th>CURRENT DEPT</th>
                  <th>PREVIOUS DEPT</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {staffMember &&
                  staffMember.map(
                    (
                      {
                        biodata,
                        designation,
                        salaryStructure,
                        staffId,
                        currentPosting,
                        postings,
                        postingProposed,
                        reliefDuty
                      },
                      index
                    ) => {
                      return (
                        <tr key={index}>
                          <td>
                            <p>{index + 1}</p>
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
                            <p>{salaryStructure}</p>
                          </td>

                          <td>
                            <p>{staffId}</p>
                          </td>

                          <td>
                            <div>
                              {postings &&
                              postings.length > 0 &&
                              CheckForNegativeDate(
                                FindTimeDifference(
                                  postings[FindMax(postings, "serial") - 1]
                                    .postingDate,
                                  moment().format("MMMM DD YYYY")
                                )
                              ) === true ? null : (
                                <p>{currentPosting}</p>
                              )}
                            </div>

                            <p className="text-info">
                              <b>
                                {postings &&
                                  postings.length &&
                                  GetRealTimeStatus(
                                    FindTimeDifference(
                                      postings[FindMax(postings, "serial") - 1]
                                        .postingDate,
                                      moment().format("MMMM DD YYYY")
                                    ),
                                    postings
                                  )}
                              </b>
                            </p>
                          </td>

                          <td>
                            <div>
                              Former Departments:
                              <div className="formerDept">
                                {postings && postings.length ? (
                                  SortPostingDuration(postings).map(
                                    ({ unit, duration }, index) => {
                                      return (
                                        <p key={index}>
                                          {unit} :{" "}
                                          {CheckForNegativeDate(duration)
                                            ? "Posting was reversed"
                                            : { duration }}
                                          <br />
                                        </p>
                                      );
                                    }
                                  )
                                ) : (
                                  <p>No former department</p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            <p>
                              {!postingProposed && !reliefDuty ? (
                                <Link
                                  to={{
                                    pathname: "/auth/propose_posting",
                                    state: {
                                      staffId: staffId,
                                      biodata: biodata,
                                      postings: postings,
                                      designation: designation,
                                      salaryStructure: salaryStructure,
                                      currentPosting: currentPosting
                                    }
                                  }}
                                >
                                  Propose Posting
                                </Link>
                              ) : null}
                            </p>
                            {reliefDuty && (
                              <p>
                                On Relief Duty
                                <span>
                                  Dept on Relief at: {reliefDepartment}
                                </span>
                                <br />
                                <span>
                                  Start Date:{" "}
                                  {moment(reliefStart).format("DD MMMM YYYY")}
                                </span>
                                <br />
                                <span>
                                  End Date:{" "}
                                  {moment(reliefEnd).format("DD MMMM YYYY")}
                                </span>
                                <br />
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </StaffProposePostingStyles>
    );
  }
}

export default StaffProposePosting;
