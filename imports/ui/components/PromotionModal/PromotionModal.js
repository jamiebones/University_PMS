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
import moment from "moment";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
import { FormatSalaryStructure } from "../../../modules/utilities";

const PromotionModalStyle = styled.div`
  .paperNumber {
    width: 100px;
  }
`;

class PromotionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDesignation: "",
      selectedSalaryStructure: "",
      promotionYear: "",
      submitted: false
    };
    autoBind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onPromotinYearChange(value) {
    this.setState({ promotionYear: value });
  }

  onSalaryStrutureChange(value) {
    this.setState({ selectedSalaryStructure: value });
  }

  saveChanges() {
    const {
      selectedDesignation,
      selectedSalaryStructure,
      submitted,
      promotionYear
    } = this.state;
    const {
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      staffdesignation,
      onHide
    } = this.props;

    if (
      selectedDesignation == "" ||
      selectedSalaryStructure == "" ||
      promotionYear == ""
    ) {
      Bert.alert(
        "Please enter the new salary structure and designation",
        "danger"
      );
      return;
    }

    //build the object sending to the
    //server

    const getSalaryType = salaryStructure.split(" ").splice(0, 1);

    const object = {
      staffId,
      staffName: `${biodata.firstName} ${biodata.middleName} ${
        biodata.surname
      }`,
      oldDesignation: staffdesignation,
      newDesignation: selectedDesignation,
      oldSalaryStructure: salaryStructure,
      newSalaryStructure: `${getSalaryType} ${FormatSalaryStructure(
        selectedSalaryStructure
      )}`,
      oldPromotionDate: dateOfLastPromotion,
      promotionYear: promotionYear
    };

    const confirmSubmit = confirm(
      `You are about updating the promotion year for ${
        object.staffName
      } from ${staffdesignation} to ${selectedDesignation} and from a salary scale of ${salaryStructure} to ${
        object.newSalaryStructure
      }. Promotion year: ${promotionYear} `
    );

    if (!confirmSubmit) return;

    Meteor.call(
      "staffMembers.editPromotionDate",
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
      biodata,
      staffId,
      salaryStructure,
      dateOfLastPromotion,
      designation,
      staffdesignation,
      show,
      onHide
    } = this.props;

    const TEMPLATE = "xx/xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);

    const TEMPLATE2 = "xxxx";
    const parse2 = templateParser(TEMPLATE2, parseDigit);
    const format2 = templateFormatter(TEMPLATE2);

    return (
      <PromotionModalStyle>
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>
              Editing Promotion Date For : {biodata && biodata.firstName}{" "}
              {biodata && biodata.surname}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <ControlLabel>Former designation:</ControlLabel>
                  <input
                    type="text"
                    disabled
                    value={staffdesignation}
                    className="form-control"
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Current designation:</ControlLabel>
                  <select
                    className="form-control"
                    value={this.state.selectedDesignation}
                    name="selectedDesignation"
                    onChange={this.onChange}
                  >
                    <option value="0">select designation</option>
                    {designation &&
                      designation.length > 0 &&
                      designation.map(({ rank }) => {
                        return (
                          <option key={rank} value={rank}>
                            {rank}
                          </option>
                        );
                      })}
                  </select>
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Former salary structure:</ControlLabel>
                  <input
                    type="text"
                    disabled
                    value={salaryStructure}
                    className="form-control"
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Current salary structure:</ControlLabel>
                  <ReactInput
                    value={this.state.selectedSalaryStructure}
                    onChange={value => this.onSalaryStrutureChange(value)}
                    className="form-control"
                    parse={parse}
                    format={format}
                    placeholder="00/00"
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Date of Last Promotion:</ControlLabel>
                  <input
                    type="text"
                    disabled
                    value={dateOfLastPromotion}
                    className="form-control"
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Promotion year:</ControlLabel>
                  <ReactInput
                    value={this.state.promotionYear}
                    onChange={value => this.onPromotinYearChange(value)}
                    className="form-control"
                    parse={parse2}
                    format={format2}
                    placeholder="0000"
                  />
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
                Save Promotion
              </button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </PromotionModalStyle>
    );
  }
}

export default PromotionModal;
