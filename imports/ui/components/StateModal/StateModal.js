import React from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  Modal,
  FormControl,
  Label,
  Button,
  HelpBlock
} from "react-bootstrap";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { Meteor } from "meteor/meteor";
import autoBind from "react-autobind";

const StateModalStyle = styled.div`
  .paperNumber {
    width: 100px;
  }
`;

class StateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedState: "",
      selectedLga: "",
      firstRender: true,
      lga: []
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(props) {
    if (props.firstRender) {
      const findState = props.states.find(state => {
        return state.state === props.staffState;
      });
      props.toggleFirstRender();
      return {
        selectedState: props.staffState,
        selectedLga: props.staffLga,
        lga: findState && findState.lga
      };
    }
    return {};
  }

  onStateChange(e) {
    //get the local government area of the state
    if (e.target.value == "0") return;
    const { states } = this.props;
    //filter the local govt area
    const findState = states.find(st => {
      return st.state === e.target.value;
    });
    const lga = findState.lga;
    this.setState({ lga: lga, selectedState: e.target.value });
  }

  onLgaChange(e) {
    if (e.target.value == "0") return;
    this.setState({ selectedLga: e.target.value });
  }

  saveChanges() {
    const { selectedLga, selectedState } = this.state;
    const { staffId } = this.props;
    Meteor.call(
      "staffMembers.editStaffState",
      selectedLga,
      selectedState,
      staffId,
      err => {
        if (!err) {
          Bert.alert("state changed successful", "success");
          this.props.onHide();
        } else {
          Bert.alert(`There was an error: ${error}`, "danger");
        }
      }
    );
  }

  render() {
    const {
      onHide,
      show,
      states,
      staff: { biodata }
    } = this.props;
    const { lga } = this.state;

    return (
      <StateModalStyle>
        <Modal show={show} onHide={onHide} bsSize="small">
          <Modal.Header closeButton>
            <Modal.Title>
              Editing State/LGA for {biodata.firstName} {biodata.surname}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <ControlLabel>State:</ControlLabel>
                  <select
                    className="form-control"
                    value={this.state.selectedState}
                    onChange={this.onStateChange}
                  >
                    <option value="0">select state</option>
                    {states &&
                      states.map(({ _id, state }) => {
                        return (
                          <option key={_id} value={state}>
                            {state}
                          </option>
                        );
                      })}
                  </select>
                </FormGroup>

                <FormGroup>
                  <ControlLabel>LGA:</ControlLabel>
                  <select
                    className="form-control"
                    value={this.state.selectedLga}
                    onChange={this.onLgaChange}
                  >
                    <option value="0">select lga</option>
                    {lga &&
                      lga.map(lga => {
                        return (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        );
                      })}
                  </select>
                </FormGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button onClick={this.props.onHide}>Close</Button>
              <button
                className="btn btn-danger "
                disabled={this.state.submitted}
                onClick={this.saveChanges}
              >
                Save changes
              </button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </StateModalStyle>
    );
  }
}

export default StateModal;
