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
import { SortPostingDuration } from "../../../modules/utilities";
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
      postings: []
    };
    autoBind(this);
  }

  componentDidMount() {
    if (this.state.postings.length == 0) {
      Meteor.call("staffposting.getApprovedPosting", (err, res) => {
        if (!err) {
          console.log(res);
          this.setState({ postings: res });
        }
        console.log(err);
      });
    }
  }

  render() {
    const { loading } = this.props;
    const { postings } = this.state;

    return (
      <StaffPostingApprovalStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Name</th>
                    <th>PF</th>
                    <th>Designation</th>
                    <th>Current Department</th>
                    <th> Posted To</th>
                    <th>Resumption Date</th>
                  </tr>
                </thead>
                <tbody>
                  {postings &&
                    postings &&
                    postings.map((post, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <p>{post.data.staffName}</p>
                          </td>
                          <td>
                            <p>{post._id}</p>
                          </td>
                          <td>
                            <p>{post.data.designation}</p>
                          </td>

                          <td>
                            <p>{post.data.unitFrom}</p>
                          </td>
                          <td>
                            <p>{post.data.newUnit}</p>
                          </td>

                          <td>
                            {moment(post.data.startingDate).format(
                              "MMMM DD YYYY"
                            )}
                          </td>
                        </tr>
                      );
                    })}
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

export default (ViewStaffPostingContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("staffposting.getApprovedPosting");
  }

  return {
    loading: subscription && !subscription.ready(),
    postings: StaffPostings.find(
      { status: "4" },
      { sort: { designation: 1 } }
    ).fetch()
  };
})(StaffPostingApproval));
