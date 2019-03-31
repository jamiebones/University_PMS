/* eslint-disable */

import React from "react";
import PropTypes from "prop-types";
FindPostingSuccessful;
import { Tabs, Tab, Row, Col } from "react-bootstrap";
//import { Link } from 'react-router-dom';
import styled from "styled-components";
import StaffPostingPage from "../../pages/StaffPostingPage/StaffPostingPage";
import DirectorViewPosting from "../../pages/DirectorViewStaffPosting/DirectorViewStaffPosting";
import ApprovedPosting from "../../components/ApprovedPostings/ApprovedPostings";
import { Meteor } from "meteor/meteor";

const StaffPostingHeader = styled.h4`
  .label {
    position: relative;
    top: -2px;
    font-size: 10px;
  }
`;

const StaffPostingTabs = styled(Tabs)`
  .nav.nav-tabs {
    margin-top: 50px;
  }
`;

class StaffPostingTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: "startPosting" };
  }

  render() {
    return (
      <div className="StaffPostingTab">
        <Row>
          <Col md={12} sm={12} lg={12}>
            <StaffPostingHeader className="page-header">
              Staff Posting
            </StaffPostingHeader>
            <StaffPostingTabs
              animation={false}
              activeKey={this.state.activeTab}
              onSelect={activeTab => this.setState({ activeTab })}
              id="manual-upload-tabs"
            >
              <br />
              <br />
              <Tab eventKey="startPosting" title="Proposed Posting">
                <Row>
                  <Col md={12}>
                    <StaffPostingPage />
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="approvePosting" title="Approve/Cancel Posting">
                <Row>
                  <Col md={12}>
                    <DirectorViewPosting />
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="postingApproved" title="Approved list">
                <Row>
                  <Col md={12}>
                    <ApprovedPosting />
                  </Col>
                </Row>
              </Tab>
            </StaffPostingTabs>
          </Col>
        </Row>
      </div>
    );
  }
}

export default StaffPostingTab;
