import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table, Label } from "react-bootstrap";
import autoBind from "react-autobind";
import { Bert } from "meteor/themeteorchef:bert";
import Loading from "../../components/Loading/Loading";
import { withTracker } from "meteor/react-meteor-data";
import { OverStayedStaff } from "../../../modules/utilities";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import moment from "moment";
import { _ } from "meteor/underscore";

const HomePageRegistrarStyles = styled.div``;

class HomePageRegistrar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: []
    };
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps)) {
      const { nonTeachingStaff } = this.props;
      const staff = OverStayedStaff(nonTeachingStaff);
      this.setState({ staff });
    }
  }

  render() {
    const { loading } = this.props;
    const { staff } = this.state;
    return (
      <HomePageRegistrarStyles>
        <Row>
          <Col md={12}>
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
                            designation
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
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <p>nothing here boss your boys are clean</p>
                )
              ) : (
                <Loading />
              )}
            </Col>
          </Col>
        </Row>
      </HomePageRegistrarStyles>
    );
  }
}

export default (HomePageRegistrarContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("staffposting.getoverstayedStaff");
  }

  return {
    loading: subscription && !subscription.ready(),
    nonTeachingStaff: StaffMembers.find({ staffType: "2" }).fetch()
  };
})(HomePageRegistrar));
