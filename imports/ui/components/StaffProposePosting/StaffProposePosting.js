import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table, Label, Image } from "react-bootstrap";
import autoBind from "react-autobind";
import { Bert } from "meteor/themeteorchef:bert";
import moment from "moment";
import {
  FindMax,
  FindTimeDifference,
  SortPostingDuration,
  FindDeptPostingProposedTo
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
            <Table>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>NAME</th>
                  <th>DESIGNATION</th>
                  <th>SALARY LEVEL</th>
                  <th>CURRENT DEPT</th>
                  <th>PREVIOUS DEPT</th>
                  <th>POSTING PROPOSED</th>
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
                            <p>
                              {currentPosting}
                              <br />
                              Time spent in current Unit :{" "}
                              <span>
                                {postings &&
                                  postings.length &&
                                  FindTimeDifference(
                                    postings[FindMax(postings, "serial") - 1]
                                      .postingDate,
                                    moment().format("MMMM DD YYYY")
                                  )}
                              </span>
                            </p>
                          </td>

                          <td />

                          <td>
                            <div>
                              Former Departments:
                              <div className="formerDept">
                                {postings && postings.length ? (
                                  SortPostingDuration(postings).map(
                                    ({ unit, duration }, index) => {
                                      return (
                                        <p key={index}>
                                          {unit} : {duration}
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
                            <p>{postingProposed}</p>

                            {postingProposed &&
                              FindDeptPostingProposedTo(postings)}
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
