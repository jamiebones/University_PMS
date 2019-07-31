import React from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  Row,
  Table,
  ButtonToolbar,
  ButtonGroup,
  Alert
} from "react-bootstrap";
import autoBind from "react-autobind";
import { Bert } from "meteor/themeteorchef:bert";
import Loading from "../../components/Loading/Loading";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import { withTracker } from "meteor/react-meteor-data";
import { StaffReliefPostings } from "../../../api/StaffReliefPosting/StaffReliefPostingClass";
import moment from "moment";

const ApproveCancelReliefPostingStyles = styled.div`
  .formerDept {
    padding: 5px;
  }
  span {
    padding: 5px;
    margin: 5px;
    font-style: italic;
    color: darkolivegreen;
  }
`;

class ApproveCancelReliefPosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  handlePostingStatus(status, reliefId) {
    //confirm the approval
    const confirmedPosting = confirm(`Are you sure`);

    if (!confirmedPosting) return;
    Meteor.call(
      "staffreliefposting.approveorcancelposting",
      status,
      reliefId,
      (error, response) => {
        if (!error) {
          Bert.alert(`Successful!`, "success");
        } else {
          Bert.alert(`${error}`, "danger");
        }
      }
    );
  }

  render() {
    const { postings, loading } = this.props;

    return (
      <ApproveCancelReliefPostingStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              postings && postings.length ? (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Name</th>
                      <th>Relieving</th>
                      <th>Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postings &&
                      postings.map(
                        (
                          {
                            reliever_staffId,
                            reliever_designation,
                            reliever_department,
                            reliever_staffName,
                            staff_relivedStaffId,
                            staff_relivedName,
                            staff_relivedDesignation,
                            staff_relivedDepartment,
                            reliefStart,
                            reliefEnd,
                            _id
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <p>
                                  <span>{reliever_staffName}</span>
                                  <br />
                                  <span>{reliever_designation}</span>
                                  <br />
                                  <span>{reliever_department}</span>
                                  <br />
                                  <span>{reliever_staffId}</span>
                                </p>
                              </td>
                              <td>
                                <p>
                                  <span>{staff_relivedName}</span>
                                  <br />
                                  <span>{staff_relivedDesignation}</span>
                                  <br />
                                  <span>{staff_relivedDepartment}</span>
                                  <br />
                                  <span>{staff_relivedStaffId}</span>
                                </p>
                              </td>
                              <td>
                                <p>
                                  <span>
                                    Relief Start :{" "}
                                    {moment(reliefStart).format("MMMM DD YYYY")}
                                  </span>
                                  <br />
                                  <span>
                                    Relief End:{" "}
                                    {moment(reliefEnd).format("MMMM DD YYYY")}
                                  </span>
                                </p>
                              </td>

                              <td>
                                <ButtonToolbar>
                                  <ButtonGroup bsSize="xsmall">
                                    {GetDetailsBasedOnRole(
                                      ["Director", "Registrar"],
                                      "Personnel"
                                    ) ? (
                                      <Button
                                        bsStyle="success"
                                        onClick={() =>
                                          this.handlePostingStatus(
                                            "approved",
                                            _id
                                          )
                                        }
                                      >
                                        Approved
                                      </Button>
                                    ) : null}
                                    <Button
                                      bsStyle="info"
                                      onClick={() =>
                                        this.handlePostingStatus(
                                          "cancelled",
                                          _id
                                        )
                                      }
                                    >
                                      Cancelled
                                    </Button>
                                  </ButtonGroup>
                                </ButtonToolbar>
                              </td>
                            </tr>
                          );
                        }
                      )}
                  </tbody>
                </Table>
              ) : (
                <div>
                  <Alert className="info">
                    <p className="lead text-center text-danger">
                      No relief posting to approve or decline
                    </p>
                  </Alert>
                </div>
              )
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </ApproveCancelReliefPostingStyles>
    );
  }
}

export default (StaffPostingPageContainer = withTracker(props => {
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("staffreliefposting.getPendingPosting");
  }

  return {
    loading: subscription && !subscription.ready(),
    postings: StaffReliefPostings.find({ status: "pending" }).fetch()
  };
})(ApproveCancelReliefPosting));
