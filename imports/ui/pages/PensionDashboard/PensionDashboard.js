import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Label } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { capAllFirstLetter } from "../../../modules/utilities";
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

const PensionDashBoardStyles = styled.div`
  .pensionTable tr th {
    color: deepskyblue;
    background-color: #c0c0c0;
  }

  .Table {
    width: 100%;
    margin-top: 15px;
  }
`;

class PensionDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      staff: []
    };
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("staffmembers.getstaffRetirement", (err, res) => {
      if (!err) {
        this.setState({ staff: res, loading: false });
      }
    });
  }

  render() {
    const { staff, loading } = this.state;

    return (
      <PensionDashBoardStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              <div>
                <p className="lead text-center">List Of Staff Retiring Soon</p>

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
                                  <Label bsStyle="success">{timeLeft}</Label>
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
              <Loading />
            )}
          </Col>
        </Row>
      </PensionDashBoardStyles>
    );
  }
}

export default PensionDashBoard;
