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
import StaffPostingApproval from "../../components/StaffPostingApproval/StaffPostingApproval";
import moment from "moment";

const ViewStaffPostingStyles = styled.div`
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

class ViewStaffPosting extends React.Component {
  render() {
    const { postings, loading } = this.props;

    return (
      <ViewStaffPostingStyles>
        <Row>
          <Col md={12}>
            <StaffPostingApproval
              loading={loading}
              postings={postings}
              approve="2"
              cancel="3"
            />
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
    postings: StaffPostings.find({ status: "1" }).fetch()
  };
})(ViewStaffPosting));
