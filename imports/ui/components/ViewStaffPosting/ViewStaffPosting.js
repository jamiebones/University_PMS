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

const ViewStaffPostingStyles = styled.div``;

class ViewStaffPosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  handlePostingStatus({ status, staffId, staffName, newUnit, _id }) {
    //confirm the approval
    const confirmedPosting = confirm(
      `Are you sure, you want to ${status} the  posting of ${staffName} to ${newUnit}`
    );

    if (!confirmedPosting) return;
    Meteor.call(
      "staffposting.approveorcancelposting",
      status,
      staffId,
      newUnit,
      _id,
      (error, response) => {
        if (!error) {
          Bert.alert(`Successful!`, "success");
        } else {
          Bert.alert(`${error}, 'danger`);
        }
      }
    );
  }

  render() {
    const { postings, loading } = this.props;

    return (
      <ViewStaffPostingStyles>
        <Row>
          <Col md={12}>
            {!loading ? (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Name</th>
                    <th>Current Department</th>
                    <th>Proposed Department</th>
                    <th>Resumption Date</th>
                  </tr>
                </thead>
                <tbody>
                  {postings &&
                    postings.map(
                      (
                        { staffId, staffName, unitFrom, newUnit, _id },
                        index
                      ) => {
                        return (
                          <tr key={index}>
                            <td>
                              <p>{staffName}</p>
                            </td>
                            <td>
                              <p>{unitFrom}</p>
                            </td>
                            <td>
                              <p>{newUnit}</p>
                            </td>

                            <td>
                              <ButtonToolbar>
                                <ButtonGroup bsSize="xsmall">
                                  <Button
                                    bsStyle="success"
                                    onClick={() =>
                                      this.handlePostingStatus({
                                        status: "2",
                                        staffId,
                                        staffName,
                                        newUnit,
                                        _id
                                      })
                                    }
                                  >
                                    Approved
                                  </Button>
                                  <Button
                                    bsStyle="info"
                                    onClick={() =>
                                      this.handlePostingStatus({
                                        status: "3",
                                        staffId,
                                        staffName,
                                        newUnit,
                                        _id
                                      })
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
              <Loading />
            )}
          </Col>
        </Row>
      </ViewStaffPostingStyles>
    );
  }
}

export default (ViewStaffPostingContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("staffposting.getProposedPosting");
  }

  return {
    loading: subscription && !subscription.ready(),
    postings: StaffPostings.find({ status: "proposed" }).fetch()
  };
})(ViewStaffPosting));
