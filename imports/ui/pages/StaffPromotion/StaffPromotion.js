import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Table, Label, Alert } from "react-bootstrap";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { withTracker } from "meteor/react-meteor-data";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import { FindStaffDueForPromotion } from "../../../modules/utilitiesComputation";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { Designations } from "../../../api/Designation/DesignationClass";
import PromotionModal from "../../components/PromotionModal/PromotionModal";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";

const StaffPromotionStyles = styled.div``;

class StaffPromotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      biodata: "",
      staffId: "",
      salaryStructure: "",
      dateOfLastPromotion: "",
      firstRender: true,
      designation: "",
      showModal: false
    };
    autoBind(this);
  }

  updatePromotion({
    biodata,
    staffId,
    salaryStructure,
    dateOfLastPromotion,
    designation
  }) {
    this.setState({
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation,
      showModal: true
    });
  }

  render() {
    const { loading, staff } = this.props;
    const {
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation
    } = this.state;
    return (
      <StaffPromotionStyles>
        <Row>
          <Col md={12}>
            <p className="lead text-center">List of Staff Due For Promotion</p>
            {!loading ? (
              staff && staff.length ? (
                <Table responsive striped bordered condensed>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Name</th>
                      <th>Staff ID</th>
                      <th>Designation</th>
                      <th>Salary Structure</th>
                      <th>Date of Last Promotion</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(
                      (
                        {
                          biodata,
                          staffId,
                          designation,
                          salaryStructure,
                          dateOfLastPromotion
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
                              <p>{staffId}</p>
                            </td>
                            <td>
                              <p>{designation}</p>
                            </td>

                            <td>
                              <p>{salaryStructure}</p>
                            </td>

                            <td>
                              <p>{dateOfLastPromotion}</p>
                            </td>

                            <td>
                              <Button
                                bsClass="success"
                                bsSize="xsmall"
                                onClick={() =>
                                  this.updatePromotion({
                                    biodata,
                                    staffId,
                                    salaryStructure,
                                    dateOfLastPromotion,
                                    designation
                                  })
                                }
                              >
                                Update Promotion Date
                              </Button>
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

            <PromotionModal
              show={this.state.showModal}
              onHide={() => this.setState({ showModal: false })}
              history={history}
              firstRender={this.state.firstRender}
              toggleFirstRender={() => this.setState({ firstRender: false })}
              designation={this.props.designation}
              staffdesignation={this.state.designation}
              biodata={this.state.biodata}
              staffId={this.state.staffId}
              salaryStructure={this.state.salaryStructure}
              dateOfLastPromotion={this.state.dateOfLastPromotion}
            />
          </Col>
        </Row>
      </StaffPromotionStyles>
    );
  }
}

export default (StaffPromotionContainer = withTracker(() => {
  let subscription;
  let promotionArray = [];
  let loading = true;
  let designation = [];
  let query = {};
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("staffposting.getStaffDueForPromotion");
  }

  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    query.staffClass = "Senior Staff";
    query.staffType = "2";
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    query.staffClass = "Junior Staff";
    query.staffType = "2";
  }

  if (GetDetailsBasedOnRole("ASE", "Personnel")) {
    query.staffType = "1";
  }

  if (subscription && subscription.ready()) {
    const allStaff = StaffMembers.find(query, {
      sort: { designation: 1 }
    }).fetch();
    designation = Designations.find({}, { sort: { rank: 1 } }).fetch();
    loading = false;
    promotionArray = FindStaffDueForPromotion(allStaff);
  }

  return {
    loading: loading,
    staff: promotionArray || [],
    designation: designation || []
  };
})(StaffPromotion));
