import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table, Label, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import { Bert } from "meteor/themeteorchef:bert";
import moment from "moment";
import {
  FindMax,
  FindTimeDifference,
  SortPostingDuration,
  FindDeptPostingProposedTo,
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
                        postingProposed
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
                              postings.length &&
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

                            <p>
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
                              {!postingProposed ? (
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
