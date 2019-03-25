import Tabs from "react-responsive-tabs";
import StaffBio from "../../components/StaffBio/StaffBio";
import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Col, Row } from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import { ReplaceSlash } from "../../../modules/utilities";
if (Meteor.isClient) {
  import "react-responsive-tabs/styles.css";
}

const StaffDetailPageRecord = styled.div``;

class StaffDetailPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { staff, loading } = this.props;
    const StaffData = [
      { title: "Staff Bio", getContent: () => <StaffBio staff={staff} /> },
      { name: "Theodore Roosevelt", component: "..." }
    ];

    return (
      <StaffDetailPageRecord>
        {!loading ? (
          <Row>
            <Col md={12}>
              <Tabs items={StaffData} showInkBar={true} />
            </Col>
          </Row>
        ) : (
          <Loading />
        )}
      </StaffDetailPageRecord>
    );
  }
}

export default (StaffDetailPageContainer = withTracker(({ match }) => {
  let subscription;
  const { staffId } = match.params;
  const staffIdQuery = staffId && ReplaceSlash(staffId);
  console.log(staffIdQuery);
  if (Meteor.isClient) {
    subscription = Meteor.subscribe(
      "staffmembers.getStaffbyStaffId",
      staffIdQuery
    );
  }

  return {
    loading: subscription && !subscription.ready(),
    staff: StaffMembers.findOne({ staffId: staffIdQuery })
  };
})(StaffDetailPage));
