import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Label, Alert, Button } from "react-bootstrap";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { GetDateInYearsMonthDay } from "../../../modules/utilitiesComputation";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";

const OverStayedStaffStyles = styled.div``;

class OverStayedStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: [],
      staffData: [],
      loading: true
    };
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("getOverStayedStaff", (err, res) => {
      if (!err) {
        console.log(res);
        this.setState({ staff: res, loading: false });
      }
    });
  }

  proposePostingLinkClick(staffId) {
    const staffIdNumber = staffId.toUpperCase();
    Meteor.call("staffmembers.getStaffById", staffIdNumber, (err, user) => {
      if (!err) {
        const userData = {
          staffId: staffIdNumber,
          biodata: user.biodata,
          postings: user.postings,
          designation: user.designation,
          salaryStructure: user.salaryStructure,
          currentPosting: user.currentPosting
        };
        this.props.history.push({
          pathname: "/auth/propose_posting",
          state: userData
        });
      } else {
        console.log(`Error: ${err}`);
      }
    });
  }

  render() {
    const { loading, staff } = this.state;
    return (
      <OverStayedStaffStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              staff && staff.length ? (
                <div>
                  <p className="lead">
                    List of Non-Teaching Staff that has stayed more than 5 years
                  </p>

                  <Table responsive striped bordered condensed>
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Staff ID</th>
                        <th>Designation</th>
                        <th>Current Department</th>
                        <th> Period Spent</th>
                        <th>Propose Posting</th>
                      </tr>
                    </thead>

                    <tbody>
                      {staff.map(({ _id, postings, data }, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <p>
                                {data.length && data[0].biodata.firstName}{" "}
                                {data[0].biodata.middleName}{" "}
                                {data[0].biodata.surname}
                              </p>
                            </td>
                            <td>
                              <p>{_id}</p>
                            </td>
                            <td>
                              <p>{data[0].designation}</p>
                            </td>

                            <td>
                              <p>{postings && postings.unitName}</p>
                            </td>
                            <td>
                              <Label bsStyle="danger" bsSize="small">
                                {GetDateInYearsMonthDay(
                                  postings && postings.postingDate
                                )}
                              </Label>
                            </td>

                            <td>
                              <p>
                                <Button
                                  bsSize="xsmall"
                                  bsStyle="default"
                                  onClick={() =>
                                    this.proposePostingLinkClick(_id)
                                  }
                                >
                                  Propose Posting
                                </Button>
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert bsStyle="info">
                  <p className="lead">No data for over stayed staff yet</p>
                </Alert>
              )
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </OverStayedStaffStyles>
    );
  }
}

export default OverStayedStaff;
