import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table, Label, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import { Bert } from "meteor/themeteorchef:bert";
import Loading from "../../components/Loading/Loading";
import { withTracker } from "meteor/react-meteor-data";
import {
  OverStayedStaff,
  GetDetailsBasedOnRole
} from "../../../modules/utilities";
import { FindTimeDifference } from "../../../modules/utilitiesComputation";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import moment from "moment";
import { _ } from "meteor/underscore";
import { ReactiveVar } from "meteor/reactive-var";
import { Meteor } from "meteor/meteor";

const DashBoardStyles = styled.div``;

class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: [],
      staffData: []
    };
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("staffmembers.getstaff", (err, res) => {
      if (!err) {
        console.dir(FindTimeDifference(res));
        const result = FindTimeDifference(res);
        this.setState({ staffData: result });
      }
    });
  }

  render() {
    const { loading, staff } = this.props;
    const { staffData } = this.state;
    // const { staff } = this.state;
    return (
      <DashBoardStyles>
        <Row>
          <Col md={12}>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Service Years</th>
                  <th>Age</th>
                  <th>Year(s) to retirement</th>
                </tr>
              </thead>
              <tbody>
                {staffData &&
                  staffData.map(
                    (
                      {
                        biodata,
                        periodSpent,
                        age,
                        designation,
                        yearsToretirement
                      },
                      index
                    ) => {
                      return (
                        <tr key={index}>
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
                            <p>{age}</p>
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
            <Col md={6} />
            <Col md={6}>
              <p className="lead">
                List of Non-Teaching Staff that has stayed more than 5 years
              </p>
              {!loading ? (
                staff && staff.length ? (
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
                      {staff.map(
                        (
                          {
                            biodata,
                            years,
                            months,
                            days,
                            unit,
                            staffId,
                            designation,
                            salaryStructure,
                            postings
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <p>
                                  {biodata.firstName} {biodata.MiddleName}{" "}
                                  {biodata.surname}
                                </p>
                              </td>
                              <td>
                                <p>{staffId}</p>
                              </td>
                              <td>
                                <p>{designation}</p>
                              </td>

                              <td>
                                <p>{unit}</p>
                              </td>
                              <td>
                                <Label bsStyle="danger" bsSize="small">
                                  {years} years {months} months {days} days
                                </Label>
                              </td>

                              <td>
                                <p>
                                  <Link
                                    to={{
                                      pathname: "/auth/propose_posting",
                                      state: {
                                        staffId: staffId,
                                        biodata: biodata,
                                        postings: postings,
                                        designation: designation,
                                        salaryStructure: salaryStructure,
                                        currentPosting: unit
                                      }
                                    }}
                                  >
                                    Propose Posting
                                  </Link>
                                </p>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <Alert bsStyle="info">No data</Alert>
                )
              ) : (
                <Loading />
              )}
            </Col>
          </Col>
        </Row>
      </DashBoardStyles>
    );
  }
}

let overStayedStaffRec = new ReactiveVar();
let loadingReactive = new ReactiveVar(true);

export default (DashBoardContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("staffposting.getoverstayedStaff");
  }

  let query = {
    staffType: "2"
  };

  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    query.staffClass = "Senior Staff";
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    query.staffClass = "Junior Staff";
  }

  if (subscription && subscription.ready()) {
    const teachingStaff = StaffMembers.find(query).fetch();

    OverStayedStaff(teachingStaff).then(staff => {
      overStayedStaffRec.set(staff);
      loadingReactive.set(false);
    });
  }

  return {
    loading: loadingReactive.get(),
    staff: overStayedStaffRec.get()
  };
})(DashBoard));
