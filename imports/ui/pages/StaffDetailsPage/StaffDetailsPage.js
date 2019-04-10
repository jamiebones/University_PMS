import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Col, Row } from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import { StaffMembers } from "../../../api/StaffMember/StaffMemberClass";
import {
  ReplaceSlash,
  GetDetailsBasedOnRole
} from "../../../modules/utilities";
import Tabs from "react-responsive-tabs";
import StaffBio from "../../components/StaffBio/StaffBio";
import StaffPromotionComponent from "../../components/StaffPromotionComponent/StaffPromotionComponent";
import StaffQualification from "../../components/StaffQualification/StaffQualification";
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
      GetDetailsBasedOnRole("Records", "Personnel") && {
        title: "Promotion",
        getContent: () => (
          <StaffPromotionComponent
            staffdesignation={staff && staff.designation}
            biodata={staff && staff.biodata}
            staffId={staff && staff.staffId}
            salaryStructure={staff && staff.salaryStructure}
            dateOfLastPromotion={staff && staff.dateOfLastPromotion}
            user={this.props.name}
          />
        )
      },
      {
        title: "Staff Qualification",
        getContent: () => (
          <StaffQualification
            certificate={staff && staff.certificate}
            staffId={staff && staff.staffId}
            user={this.props.name}
          />
        )
      }
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
