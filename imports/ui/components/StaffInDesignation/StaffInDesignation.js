import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Button } from "react-bootstrap";
import autoBind from "react-autobind";
import StaffInDepartmentModal from "../../components/StaffInDepartmentModal/StaffInDepartmentModal";
import moment from "moment";

const StaffInDesignationStyles = styled.div`
  .postingdiv: {
  }
`;

class StaffInDesignation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      department: "",
      staffInDept: []
    };
    autoBind(this);
  }

  initiatePostingAction({ currentPosting }) {
    const dept = currentPosting;
    this.setState({ loading: true, showModal: true });
    Meteor.call(
      "staffmembers.getNonTeachingStaffInDept",
      dept,
      (err, response) => {
        if (!err) {
          this.setState({
            staffInDept: response,
            department: dept,
            loading: false
          });
        } else {
          alert(err.reason);
          this.setState({ showModal: false });
        }
      }
    );
  }

  render() {
    const { staffMember, staff } = this.props;
    console.log(staff);

    return (
      <StaffInDesignationStyles>
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
                        currentPosting
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
                            <p>{currentPosting}</p>
                          </td>

                          <td>
                            <Button
                              bsStyle="success"
                              bsSize="small"
                              onClick={() =>
                                this.initiatePostingAction({ currentPosting })
                              }
                            >
                              Initiate action
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </Table>

            {this.state.department != "" ? (
              <StaffInDepartmentModal
                show={this.state.showModal}
                onHide={() => this.setState({ showModal: false })}
                department={this.state.department}
                staffInDept={this.state.staffInDept}
                person={staff}
              />
            ) : null}
          </Col>
        </Row>
      </StaffInDesignationStyles>
    );
  }
}

export default StaffInDesignation;
