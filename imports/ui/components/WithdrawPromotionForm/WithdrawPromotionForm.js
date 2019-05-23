import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  Alert,
  Button
} from "react-bootstrap";
import { ReactiveVar } from "meteor/reactive-var";
import { withTracker } from "meteor/react-meteor-data";
import { PromotedStaffs } from "../../../api/PromotedStaff/PromotedStaffClass";
import { WithdrawPromotions } from "../../../api/WithdrawPromotion/WithdrawPromotionClass";
import TextField from "../../components/Common/TextFieldGroup";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import moment from "moment";

import { GetDetailsBasedOnRole } from "../../../modules/utilities";

const WithdrawPromotionStyle = styled.div`
  .alertDiv {
    margin-top: 20px;
    p {
      font-style: italic;
      color: #000;
    }
  }
  .WithdrawPromotionDiv {
    margin-top: 30px;
  }
  .divSearchArea {
    border: 2px solid;
    background: #337547;
    padding: 30px;
  }
  .lead {
    color: #af2222;
  }
  .divReturn {
    background: white;
    padding: 10px;
    font-weight: bold;
    max-height: 200px;
    overflow: overlay;
  }
  p {
    margin: 0 0 15px;
  }
  span {
    font-weight: normal;
    padding: 4px;
  }
  hr {
    height: 2px;
    background: #618da0;
  }
  .previous {
    padding: 6px;
  }
`;

class WithdrawPromotionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: "",
      submitted: false,
      reason: ""
    };
    autoBind(this);
  }

  onSubmit(e) {
    if (e.keyCode == 13) {
      this.props.staffIdReactive.set(e.target.value);
    }
  }

  onChange(e) {
    if (e.target.value !== "") {
      this.setState({ staffId: e.target.value.toUpperCase() });
    }
  }

  reasonChange(e) {
    this.setState({ reason: e.target.value });
  }

  withdrawPromotion() {
    const { staff } = this.props;
    const withdrawRequest = {
      staffId: staff.staffId,
      staffName: staff.staffName,
      staffType: staff.staffType,
      staffClass: staff.staffClass,
      returnToDesignation: staff.oldDesignation,
      returnToSalaryStructure: staff.oldSalaryStructure,
      presentDesignation: staff.newDesignation,
      presentSalaryStructure: staff.newSalaryStructure,
      returnPromotionDate: staff.oldPromotionDate,
      reasonForWithdrawal: this.state.reason,
      user: Meteor.userId(),
      requestStatus: "pending",
      requestDate: new Date().toISOString()
    };
    this.setState({ submitted: !this.state.submitted });
    Meteor.call(
      "withdrawpromotion.makewithrawalrequest",
      withdrawRequest,
      err => {
        if (!err) {
          this.setState({ submitted: !this.state.submitted });
          Bert.alert("Promotion request saved", "success");
        } else {
          this.setState({ submitted: !this.state.submitted });
          Bert.alert(`Error : ${err}`);
        }
      }
    );
  }

  deleteRequest(e, id) {
    this.setState({ submitted: !this.state.submitted });
    Meteor.call("withdrawpromotion.deletewithrawalrequest", id, err => {
      if (!err) {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert("Withdrawal request deleted", "success");
      } else {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert(`Error : ${err}`);
      }
    });
  }

  render() {
    const { staff, loading, previousRequest } = this.props;
    const { reason } = this.state;

    return (
      <WithdrawPromotionStyle>
        <Row>
          <Col md={8} mdOffset={2}>
            <p className="lead text-center">Promotion Withdrawal Form</p>
            <div className="divSearchArea">
              <TextField
                name="staffId"
                placeholder="search by staff Id"
                value={this.state.staffId}
                onKeyDown={this.onSubmit}
                onChange={this.onChange}
              />
            </div>
          </Col>
        </Row>

        {!loading ? (
          staff ? (
            <Row className="WithdrawPromotionDiv">
              <Col md={8} mdOffset={2}>
                {previousRequest && (
                  <div>
                    <p>Previous Request Status</p>

                    <p>
                      Status:{" "}
                      <span className="previous">
                        {previousRequest && previousRequest.requestStatus}
                      </span>
                    </p>

                    <p>
                      Date :{" "}
                      <span className="previous">
                        {moment(
                          previousRequest && previousRequest.requestDate
                        ).format("DD MMMM YYYY")}
                      </span>
                    </p>

                    <p>
                      Withdrawal Reason :{" "}
                      <span className="previous">
                        {previousRequest && previousRequest.reasonForWithdrawal}
                      </span>
                    </p>

                    <p>
                      <Button
                        bsStyle="danger"
                        bsSize="xsmall"
                        disabled={this.state.submitted}
                        onClick={e =>
                          this.deleteRequest(e, previousRequest._id)
                        }
                      >
                        {this.state.submitted
                          ? "Please wait"
                          : "Delete Request"}
                      </Button>
                    </p>

                    <hr />
                  </div>
                )}
                <Row>
                  <Col md={6}>
                    <p>
                      Staff ID : <span>{staff && staff.staffId}</span>
                    </p>

                    <p>
                      Name: <span>{staff && staff.staffName}</span>
                    </p>

                    <p>
                      Current Designation :{" "}
                      <span>{staff && staff.newDesignation}</span>
                    </p>

                    <p>
                      Current Salary Structure :{" "}
                      <span>{staff && staff.newSalaryStructure}</span>
                    </p>

                    <p>
                      Promotion Year:
                      <span>{staff && staff.promotionYear}</span>
                    </p>
                  </Col>

                  <Col md={6}>
                    <div className="divReturn">
                      <p className="text-center">Return Details</p>
                      <p>
                        Return Designation :
                        <span>{staff && staff.oldDesignation}</span>
                      </p>

                      <p>
                        Return Salary Structure:
                        <span>{staff && staff.oldSalaryScale}</span>
                      </p>

                      <p>
                        Return Date:
                        <span>{staff && staff.oldPromotionDate}</span>
                      </p>

                      <p>
                        Reason:
                        <span>{reason}</span>
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <ControlLabel>Reasons for withdrawal</ControlLabel>
                      <textarea
                        className="form-control"
                        cols="50"
                        onChange={this.reasonChange}
                        rows="8"
                      />
                    </FormGroup>

                    {!previousRequest ? (
                      <FormGroup>
                        <Button
                          bsStyle="success"
                          disabled={this.state.submitted}
                          onClick={this.withdrawPromotion}
                        >
                          {this.state.submitted
                            ? "Please wait-----"
                            : "Withdraw Promotion Request"}
                        </Button>
                      </FormGroup>
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            <Row className="WithdrawPromotionDiv">
              <Col md={8} mdOffset={2}>
                <Alert bsStyle="info">
                  <p>No data for inputed staff id</p>
                </Alert>
              </Col>
            </Row>
          )
        ) : (
          <Loading />
        )}
      </WithdrawPromotionStyle>
    );
  }
}

let staffIdReactive = new ReactiveVar("");

let query = {
  staffId: ""
};

export default (WithdrawPromotionPageContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "promotedStaff.getStaffByIdStaffIdAndDesignation",
      staffIdReactive.get()
    );
  }

  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    query.staffClass = "Senior Staff";
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    query.staffClass = "Junior Staff";
  }

  if (GetDetailsBasedOnRole("ASE", "Personnel")) {
    query.staffType = "1";
  }

  if (staffIdReactive.get() !== "") {
    query.staffId = staffIdReactive
      .get()
      .trim()
      .toUpperCase();
  }

  return {
    loading: subscription && !subscription.ready(),
    staff: PromotedStaffs.findOne(query),
    staffIdReactive,
    previousRequest: WithdrawPromotions.findOne({
      staffId: staffIdReactive
        .get()
        .trim()
        .toUpperCase(),
      requestStatus: "pending",
      user: Meteor.userId()
    })
  };
})(WithdrawPromotionPage));
