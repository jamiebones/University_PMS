import React from "react";
import { Row, Col, Modal, Button, Table } from "react-bootstrap";
import styled from "styled-components";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";
import moment from "moment";

const StaffInDeptModalStyle = styled.div``;

class StaffInDeptModal extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  savePostingRelief() {
    this.props.onHide();
  }

  render() {
    const {
      department,
      show,
      onHide,
      person,
      staffInDept: staff,
      loading
    } = this.props;

    return (
      <StaffInDeptModalStyle>
        <Row>
          <Col md={12} lg={12}>
            <Modal show={show} onHide={onHide} bsSize="large">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p className="text-center">
                    {person && person.staffClass} Staff List For {department}{" "}
                  </p>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {!loading ? (
                  staff && staff.length ? (
                    <div>
                      <Table responsive striped condensed bordered>
                        <thead>
                          <tr>
                            <th>SN</th>
                            <th>NAME</th>
                            <th>P/F</th>
                            <th>DESIGNATION</th>
                            <th>SALARY LEVEL</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staff.length &&
                            staff.map(
                              (
                                {
                                  biodata,
                                  staffId,
                                  reliefDuty,
                                  designation,
                                  salaryStructure,
                                  currentPosting
                                },
                                index
                              ) => {
                                return (
                                  <tr key={index + 78787878}>
                                    <td>
                                      <p>{index + 1}</p>
                                    </td>
                                    <td>
                                      <p>
                                        {biodata && biodata.firstName}{" "}
                                        {biodata && biodata.middleName}{" "}
                                        {biodata && biodata.surname}
                                      </p>
                                    </td>

                                    <td>
                                      <p>{staffId}</p>
                                    </td>
                                    <td>
                                      <p> {designation}</p>
                                    </td>

                                    <td>
                                      <p>{salaryStructure}</p>
                                    </td>

                                    <td>
                                      {reliefDuty ? (
                                        <p>
                                          On Relief Duty
                                          <span>
                                            Dept on Relief at:{" "}
                                            {reliefDepartment}
                                          </span>
                                          <br />
                                          <span>
                                            Start Date:{" "}
                                            {moment(reliefStart).format(
                                              "DD MMMM YYYY"
                                            )}
                                          </span>
                                          <br />
                                          <span>
                                            End Date:{" "}
                                            {moment(reliefEnd).format(
                                              "DD MMMM YYYY"
                                            )}
                                          </span>
                                          <br />
                                        </p>
                                      ) : (
                                        <Button
                                          bsStyle="success"
                                          bsSize="xsmall"
                                          onClick={() =>
                                            this.savePostingRelief({
                                              biodata,
                                              staffId,
                                              designation,
                                              salaryStructure,
                                              currentPosting,
                                              person: person
                                            })
                                          }
                                        >
                                          Propose relief
                                        </Button>
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
                    <div>
                      <p>No data</p>
                    </div>
                  )
                ) : (
                  <Loading />
                )}
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </StaffInDeptModalStyle>
    );
  }
}

export default StaffInDeptModal;
