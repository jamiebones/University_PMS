import React from "react";
import styled from "styled-components";
import {
  Col,
  Row,
  Table,
  Button,
  ButtonToolbar,
  ButtonGroup
} from "react-bootstrap";
import autoBind from "react-autobind";
import { Bert } from "meteor/themeteorchef:bert";
import Loading from "../../components/Loading/Loading";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { capAllFirstLetter } from "../../../modules/utilities";
import { WithdrawPromotions } from "../../../api/WithdrawPromotion/WithdrawPromotionClass";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

const ApproveWithdrawPromotionStyles = styled.div``;

class ApproveWithdrawPromotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      staff: []
    };
    autoBind(this);
  }

  handleApprovePromotionWithdrawal({
    status,
    id,
    returnToDesignation,
    staffId,
    returnToSalaryStructure
  }) {
    const withdrawalObject = {
      status,
      id,
      staffId,
      returnToDesignation,
      returnToSalaryStructure
    };
    Meteor.call(
      "withdrawpromotion.registrarapprovecancel",
      withdrawalObject,
      err => {
        if (!err) {
          Bert.alert("Successful", "success");
        } else {
          Bert.alert(`Error: ${err}`, "danger");
        }
      }
    );
  }

  render() {
    const { pendingWithdrawal, loading } = this.props;

    return (
      <ApproveWithdrawPromotionStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              pendingWithdrawal && pendingWithdrawal.length ? (
                <div>
                  <p className="lead text-center">
                    List of Promotion Withdrawal Request
                  </p>

                  <Table responsive striped bordered condensed>
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Wrongly Promoted to</th>
                        <th>Revert Back to</th>
                        <th>Reason for reversal</th>
                        <th>Request made by</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pendingWithdrawal.map(
                        (
                          {
                            staffId,
                            staffName,
                            presentDesignation,
                            returnToDesignation,
                            presentSalaryStructure,
                            returnToSalaryStructure,
                            reasonForWithdrawal,
                            _id,
                            user
                          },
                          index
                        ) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <p>{staffName}</p>
                                <p>{staffId}</p>
                              </td>
                              <td>
                                <p>{presentDesignation}</p>
                                <p>{presentSalaryStructure}</p>
                              </td>

                              <td>
                                <p>{returnToDesignation}</p>
                                <p>{returnToSalaryStructure}</p>
                              </td>

                              <td>
                                <p>{reasonForWithdrawal}</p>
                              </td>
                              <td>
                                <p>{user}</p>
                              </td>
                              <td>
                                <p>
                                  <ButtonToolbar>
                                    <ButtonGroup bsSize="xsmall">
                                      <Button
                                        bsStyle="success"
                                        onClick={() =>
                                          this.handleApprovePromotionWithdrawal(
                                            {
                                              status: "approved",
                                              id: _id,
                                              returnToDesignation,
                                              staffId,
                                              returnToSalaryStructure
                                            }
                                          )
                                        }
                                      >
                                        Approved
                                      </Button>

                                      <Button
                                        bsStyle="info"
                                        onClick={() =>
                                          this.handleApprovePromotionWithdrawal(
                                            {
                                              status: "declined",
                                              id: _id,
                                              returnToDesignation,
                                              staffId,
                                              returnToSalaryStructure
                                            }
                                          )
                                        }
                                      >
                                        Declined
                                      </Button>
                                    </ButtonGroup>
                                  </ButtonToolbar>
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
                <Alert>
                  <p>No pending promotion request withdrawal</p>
                </Alert>
              )
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </ApproveWithdrawPromotionStyles>
    );
  }
}

export default (ApproveWithdrawPromotionContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("withdrawpromotion.getPendingWithdrawals");
  }

  return {
    loading: subscription && !subscription.ready(),
    pendingWithdrawal: WithdrawPromotions.find({
      requestStatus: "pending"
    }).fetch()
  };
})(ApproveWithdrawPromotion));
