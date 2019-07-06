import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  Button,
  Alert,
  ButtonToolbar,
  ButtonGroup,
  InputGroup
} from "react-bootstrap";
import Tabs from "react-responsive-tabs";
import StaffBiodata from "../../components/BiodataComponent/BiodataComponent";
import StaffOfficialComponent from "../../components/StaffOfficialComponent/StaffOfficialComponent";
if (Meteor.isClient) {
  import "react-responsive-tabs/styles.css";
}
import autoBind from "react-autobind";
import { _ } from "meteor/underscore";
const store = require("store");

class AddNewStaffData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: {
        biodata: {},
        official: {}
      },
      selectedTab: "biodata"
    };
    autoBind(this);
  }

  componentDidMount() {
    //find out if we have it stored in the store
    const staff = store.get("staff");
    if (!_.isEmpty(staff)) {
      this.setState({ staff });
    }
  }

  updateStaffData({ staffDataKey, staffKey, staffValue }, selectedTab) {
    const { staff } = this.state;
    const editedStaff = Object.assign({}, staff);
    editedStaff[staffDataKey][staffKey] = staffValue;
    this.setState({ staff: editedStaff, selectedTab }, () => {
      store.set("staff", editedStaff);
    });
    console.log(this.state);
  }
  render() {
    const StaffData = [
      {
        title: "Staff Biodata",
        key: "biodata",
        getContent: () => (
          <StaffBiodata
            staffData={this.updateStaffData}
            staff={this.state.staff}
          />
        )
      },
      {
        title: "Official Section",
        key: "official",
        getContent: () => (
          <StaffOfficialComponent
            staffData={this.updateStaffData}
            staff={this.state.staff}
          />
        )
      }
    ];
    return (
      <Row>
        <Col md={12}>
          <Tabs
            items={StaffData}
            showInkBar={true}
            selectedTabKey={this.state.selectedTab}
          />
        </Col>
      </Row>
    );
  }
}

export default AddNewStaffData;
