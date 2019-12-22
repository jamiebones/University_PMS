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
  GetDetailsBasedOnRole,
  RemoveSlash
} from "../../../modules/utilities";
import Tabs from "react-responsive-tabs";
import StaffBio from "../../components/StaffBio/StaffBio";
import StaffPromotionComponent from "../../components/StaffPromotionComponent/StaffPromotionComponent";
import StaffQualification from "../../components/StaffQualification/StaffQualification";
import ChangeDesignationAndStatus from "../../components/ChangeDestAndStatus/ChangeDestAndStatus";
import PostingDate from "../../components/PostingDate/PostingDate";
if (Meteor.isClient) {
  import "react-responsive-tabs/styles.css";
}

const StaffDetailPageRecord = styled.div``;

class StaffDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: ""
    };
    autoBind(this);
  }

  render() {
    const { staff, loading } = this.props;
    const StaffData = [
      {
        title: "Staff Bio",
        key: "bio",
        getContent: () => <StaffBio staff={staff} />
      },
      GetDetailsBasedOnRole("Records", "Personnel") && {
        title: "Promotion",
        key: "promotion",
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
      staff &&
        staff.staffType == "2" && {
          title: "Posting Date",
          key: "posting",
          getContent: () => <PostingDate staff={staff && staff} />
        },
      GetDetailsBasedOnRole("Records", "Personnel") && {
        title: "Change Designation/Status",
        key: "designation",
        getContent: () => <ChangeDesignationAndStatus staff={staff && staff} />
      },
      {
        title: "Qualification",
        key: "qualification",
        getContent: () => (
          <StaffQualification
            certificate={staff && staff.certificate}
            staffId={staff && staff.staffId}
            user={this.props.name}
          />
        )
      },
      {
        title: "Staff Files",
        key: "files",
        getContent: () =>
          this.props.history.push(
            `/auth/files/${staff && RemoveSlash(staff.staffId)}`
          )
      }
    ];

    return (
      <StaffDetailPageRecord>
        {!loading ? (
          <Row>
            <Col md={12}>
              {!_.isEmpty(staff) ? (
                <Tabs items={StaffData} showInkBar={true} />
              ) : (
                <p className="text-danger lead">No available details</p>
              )}
            </Col>
          </Row>
        ) : (
          <Loading />
        )}
      </StaffDetailPageRecord>
    );
  }
}

export default StaffDetailPageContainer = withTracker(({ match }) => {
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
})(StaffDetailPage);
