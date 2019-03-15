/* eslint-disable */

import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
//import { Link } from 'react-router-dom';
import styled from "styled-components";
import StaffPostingPage from "../../pages/StaffPostingPage/StaffPostingPage";
import ViewPostingPage from "../../components/ViewStaffPosting/ViewStaffPosting";
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
                    <ViewPostingPage />
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
