import React from "react";
import { Col, Row, FormGroup, ControlLabel } from "react-bootstrap";
import styled from "styled-components";
import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";
import autoBind from "react-autobind";

const AddCadreComponentsyles = styled.div``;

class AddCadreComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: "",
      level: "",
      editing: false
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.level && props.rank && state.editing == false) {
      return {
        rank: props.rank,
        level: props.level
      };
    } else {
      return null;
    }
  }

  onLevelChange(value) {
    this.setState({ level: value, editing: true }, () => {
      //set the props here
      this.props.setLevelAndRank({
        level: this.state.level,
        rank: this.state.rank,
        index: this.props.index
      });
    });
  }

  onRankChange(e) {
    const value = e.target.value;
    this.setState({ rank: value.toUpperCase(), editing: true }, () => {
      this.props.setLevelAndRank({
        level: this.state.level,
        rank: this.state.rank,
        index: this.props.index
      });
    });
  }

  render() {
    const TEMPLATE = "xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    return (
      <AddCadreComponentsyles>
        <Row>
          <Col md={4}>
            <FormGroup>
              <ControlLabel>Level:</ControlLabel>
              <ReactInput
                value={this.state.level}
                onChange={value => this.onLevelChange(value)}
                className="form-control"
                parse={parse}
                format={format}
                placeholder="00"
              />
            </FormGroup>
          </Col>

          <Col md={8}>
            <FormGroup>
              <ControlLabel>Rank:</ControlLabel>
              <input
                type="text"
                className="form-control"
                value={this.state.rank}
                onChange={this.onRankChange}
              />
            </FormGroup>
          </Col>
        </Row>
      </AddCadreComponentsyles>
    );
  }
}

export default AddCadreComponent;
