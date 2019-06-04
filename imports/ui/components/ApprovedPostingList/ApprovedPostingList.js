import React from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  Row,
  FormGroup,
  Table,
  ButtonToolbar,
  ButtonGroup
} from "react-bootstrap";
import autoBind from "react-autobind";
import { StaffPostings } from "../../../api/StaffPosting/StaffPostingClass";
import { Bert } from "meteor/themeteorchef:bert";
import Loading from "../../components/Loading/Loading";
import { withTracker } from "meteor/react-meteor-data";
import { ReactiveVar } from "meteor/reactive-var";
import {
  SortPostingDuration,
  GetDetailsBasedOnRole
} from "../../../modules/utilities";
import moment from "moment";

const StaffPostingApprovalStyles = styled.div`
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

class StaffPostingApproval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resumedDate: ""
    };
    autoBind(this);
  }

  onChange(e) {
    if (e.target.value === "0") return;
    this.setState({ resumedDate: e.target.value });
    this.props.postingDateReactive.set(e.target.value);
  }

  render() {
    const { postings, loading } = this.props;

    return (
      <StaffPostingApprovalStyles>
        <Row>
          <Col md={12}>
            <p className="lead hidden-print">
              <b>Posting List</b>
            </p>
            <Row>
              <Col md={6}>
                <select
                  className="form-control hidden-print"
                  value={this.state.resumedDate}
                  onChange={this.onChange}
                >
                  <option value="0" disabled>
                    select
                  </option>
                  <option value="1">yet to resume</option>
                  <option value="2">resume a week ago</option>
                  <option value="3">resumed with in 3 months ago</option>
                </select>
              </Col>
            </Row>
            <br />
            <br />
            {!loading ? (
              <Table responsive striped bordered condensed>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Former Department</th>
                    <th> Posted To</th>
                    <th>Resumption Date</th>
                  </tr>
                </thead>
                <tbody>
                  {postings &&
                    postings.map(
                      (
                        {
                          staffId,
                          staffName,
                          unitFrom,
                          newUnit,
                          _id,
                          previousPostings,
                          startingDate,
                          designation
                        },
                        index
                      ) => {
                        return unitFrom != "first" ? (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <p>{staffName}</p>
                            </td>
                            <td>
                              <p>{designation}</p>
                            </td>

                            <td>
                              <p>{unitFrom}</p>
                            </td>
                            <td>
                              <p>{newUnit}</p>
                            </td>

                            <td>
                              {moment(startingDate).format("MMMM DD YYYY")}
                            </td>
                          </tr>
                        ) : null;
                      }
                    )}
                </tbody>
              </Table>
            ) : (
              <Loading />
            )}
            {postings && postings.length ? (
              <div className="pull-right">
                <Button
                  className="hidden-print"
                  bsSize="xsmall"
                  onClick={() => window.print()}
                  bsStyle="success"
                >
                  Print List
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </StaffPostingApprovalStyles>
    );
  }
}

const postingDateReactive = new ReactiveVar("");

export default (StaffPostingApprovalContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffposting.getApprovedPostingByDate",
      postingDateReactive.get()
    );
  }

  let date = moment(new Date()).toISOString();

  let query = {
    status: "4",
    startingDate: {
      $gt: date
    }
  };

  if (GetDetailsBasedOnRole("SATS", "Personnel")) {
    query.staffClass = "Senior Staff";
  }

  if (GetDetailsBasedOnRole("JSE", "Personnel")) {
    query.staffClass = "Junior Staff";
  }

  switch (postingDateReactive.get()) {
    case "1":
      query.status = "4";
      query["startingDate"] = { $gt: date };
      break;
    case "2":
      const start = moment(new Date()).subtract(7, "days");

      query.status = "4";
      query["startingDate"] = {
        $lt: date,
        $gt: start.toISOString()
      };
      break;
    case "3":
      query.status = "4";
      query["startingDate"] = {
        $lte: date
      };
  }

  return {
    loading: subscription && !subscription.ready(),
    postings: StaffPostings.find(query, { sort: { designation: 1 } }).fetch(),
    postingDateReactive
  };
})(StaffPostingApproval));
