import React, { memo, useMemo } from "react";
import styled from "styled-components";
import { Button, Col, Row, Table } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import {
  FindTimeDifference,
  CalculateDueForRetirement
} from "../../../modules/utilitiesComputation";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import moment from "moment";

const PensionDashBoardStyles = styled.div`
  .pensionTable tr th {
    color: deepskyblue;
    background-color: #c0c0c0;
  }
`;

class PensionDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      staffData: []
    };
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("staffmembers.getstaff", (err, res) => {
      if (!err) {
        const result = CalculateDueForRetirement(res);
        console.dir(result);
        this.setState({ staffData: result, loading: false });
      }
    });
  }

  render() {
    const { staffData, loading } = this.state;
    return (
      <PensionDashBoardStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              <div>
                <p className="lead text-center">
                  List Of Staff That Has Served For 35 Years And Above
                </p>
                <Table className="pensionTable" responsive striped>
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Service Years</th>
                      <th>Birthday: Age</th>
                      <th>Year(s) to retirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffData &&
                      staffData.length > 0 &&
                      staffData.map(
                        (
                          {
                            biodata,
                            periodSpent,
                            dob,
                            age,
                            designation,
                            yearsToretirement
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
                                <p>{periodSpent}</p>
                              </td>

                              <td>
                                <p>
                                  {moment(dob).format("MMMM, DD, YYYY")}: {age}
                                </p>
                              </td>

                              <td>
                                <p>
                                  {yearsToretirement <= 0
                                    ? "Retired"
                                    : yearsToretirement}
                                </p>
                              </td>
                            </tr>
                          );
                        }
                      )}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </PensionDashBoardStyles>
    );
  }
}

export default PensionDashBoard;
