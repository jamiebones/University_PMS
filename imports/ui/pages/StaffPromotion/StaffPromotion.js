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
import { ReactiveVar } from "meteor/reactive-var";
import { Meteor } from "meteor/meteor";

const StaffPromotionStyles = styled.div``;

class StaffPromotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      biodata: "",
      staffId: "",
      salaryStructure: "",
      certificate: "",
      dateOfLastPromotion: "",
      firstRender: true,
      designation: "",
      showModal: false,
      selectedDesignation: ""
    };
    autoBind(this);
  }

  updatePromotion({
    biodata,
    staffId,
    salaryStructure,
    dateOfLastPromotion,
    designation,
    certificate
  }) {
    this.setState({
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation,
      certificate,
      showModal: true
    });
  }

  onChange(e) {
    if (e.target.value == "0") return;
    this.setState({ selectedDesignation: e.target.value });
    this.props.selectedDesignation.set(e.target.value);
  }

  render() {
    const { loading, staff, designation } = this.props;
    const { selectedDesignation } = this.state;

    return (
      <StaffPromotionStyles>
        <Row>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <select
                  className="form-control"
                  value={this.state.selectedDesignation}
                  onChange={this.onChange}
                >
                  <option value="0">select a designation</option>
                  <option value="all">All Eligible For Promotion</option>
                  {designation &&
                    designation.map(({ rank }) => {
                      return (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      );
                    })}
                </select>
              </Col>
            </Row>

            <br />
            <br />
            {selectedDesignation ? (
              <p className="lead text-center">
                Viewing {selectedDesignation} cadre list
              </p>
            ) : (
              <p className="lead text-center">
                Viewing initial list for promotion
              </p>
            )}

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
                          dateOfLastPromotion,
                          certificate
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
                                    designation,
                                    certificate
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
              staffdesignation={this.state.designation}
              biodata={this.state.biodata}
              staffId={this.state.staffId}
              salaryStructure={this.state.salaryStructure}
              dateOfLastPromotion={this.state.dateOfLastPromotion}
              user={this.props.name}
            />
          </Col>
        </Row>
      </StaffPromotionStyles>
    );
  }
}

let selectedDesignation = new ReactiveVar("");

export default (StaffPromotionContainer = withTracker(() => {
  let subscription;
  let promotionArray = [];
  let loading = true;
  let designation = [];
  let query = {};
  let rankQuery = {};
  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    query.staffClass = "Senior Staff";
    query.staffType = "2";
    rankQuery.type = "Senior Staff";
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    query.staffClass = "Junior Staff";
    query.staffType = "2";
    rankQuery.type = "Junior Staff";
  }

  if (GetDetailsBasedOnRole("ASE", "Personnel")) {
    query.staffType = "1";
  }

  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffDueForPromotion",
      query,
      rankQuery,
      selectedDesignation.get()
    );
  }

  if (subscription && subscription.ready()) {
    let allStaff = StaffMembers.find(query, {
      sort: { designation: 1 }
    }).fetch();
    console.time();
    designation = Designations.find(rankQuery, { sort: { rank: 1 } }).fetch();
    console.log(console.timeEnd());
    promotionArray = FindStaffDueForPromotion(allStaff);
    loading = false;
  }

  return {
    loading: loading,
    staff: promotionArray || [],
    designation: designation || [],
    selectedDesignation
  };
})(StaffPromotion));
