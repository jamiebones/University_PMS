import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import autoBind from "react-autobind";
import EditSalaryComponent from "../../components/EditSalaryComponent/EditSalaryComponent";
import Tabs from "react-responsive-tabs";
if (Meteor.isClient) {
  import "react-responsive-tabs/styles.css";
}

const EditTabsStyle = styled.div`
  .tab {
    font-size: 19px;
    color: #0a3846;
  }
`;

class EditSalaryStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salaryObject: {},
      loading: false,
      selectedTab: "contiss"
    };
    autoBind(this);
  }

  updateComponentData(key) {
    this.setState({ loading: true });
    Meteor.call("salaryscale.getSalaryScaleGroup", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({
          salaryObject: result,
          loading: false,
          selectedTab: key
        });
      }
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    Meteor.call("salaryscale.getSalaryScaleGroup", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({ salaryObject: result, loading: false });
      }
    });
  }

  render() {
    const {
      salaryObject: { contiss, conuass, conmess },
      loading
    } = this.state;
    const SalaryData = [
      {
        title: "CONTISS",
        key: "contiss",
        tabClassName: "tab",
        panelClassName: "panel",
        getContent: () => (
          <EditSalaryComponent
            salaryscale={contiss}
            tabKey="contiss"
            updateComponentData={this.updateComponentData}
          />
        )
      },
      {
        title: "CONUASS",
        key: "conuass",
        tabClassName: "tab",
        panelClassName: "panel",
        getContent: () => (
          <EditSalaryComponent
            salaryscale={conuass}
            tabKey="conuass"
            updateComponentData={this.updateComponentData}
          />
        )
      },
      {
        title: "CONMESS",
        key: "conmess",
        tabClassName: "tab",
        panelClassName: "panel",
        getContent: () => (
          <EditSalaryComponent
            salaryscale={conmess}
            tabKey="conmess"
            updateComponentData={this.updateComponentData}
          />
        )
      }
    ];

    return (
      <EditTabsStyle>
        {!loading ? (
          <Row>
            <Col md={12}>
              {!_.isEmpty(this.state.salaryObject) ? (
                <Tabs
                  items={SalaryData}
                  showInkBar={true}
                  selectedTabKey={this.state.selectedTab}
                />
              ) : (
                <p className="text-danger lead">No salary scale to edit yet</p>
              )}
            </Col>
          </Row>
        ) : (
          <Loading />
        )}
      </EditTabsStyle>
    );
  }
}

export default EditSalaryStructure;
