import React from "react";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import { StaffPostings } from "../../../api/StaffPosting/StaffPostingClass";
import { withTracker } from "meteor/react-meteor-data";
import StaffPostingApproval from "../../components/StaffPostingApproval/StaffPostingApproval";

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
