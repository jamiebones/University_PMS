import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ToolbarStyles = styled.div`
  .Toolbar {
    position: fixed;
    right: 40px;
    top: 50px;
    width: 100px;
    height: 50px;
    background-color: #222;
    border: 2px solid #888;
    border-radius: 7px;
    padding: 2px;
    z-index: 10;
  }

  .Toolbar > .ZoomIn,
  .Toolbar > .ZoomOut {
    border: 1px solid #888;
    border-radius: 5px;
    background-color: #fe8;
    width: 32px;
    height: 24px;
    font-size: 12px;
    font-weight: bold;
    color: black;
    margin: 2px;
  }

  .Toolbar > .ZoomPercent {
    text-align: center;
    font-size: 16px;
    color: white;
    margin: 2px;
  }
`;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 0
    };
  }
  zoomIn(e) {
    if (this.props.onZoomIn) {
      this.props.onZoomIn(e);
    }
  }
  zoomOut(e) {
    if (this.props.onZoomOut) {
      this.props.onZoomOut(e);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.scale !== nextState.scale) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <ToolbarStyles>
        <div className="Toolbar">
          <button className="ZoomIn" onClick={e => this.zoomOut(e)}>
            -
          </button>
          <button className="ZoomOut" onClick={e => this.zoomIn(e)}>
            +
          </button>
          <div className="ZoomPercent">
            {(this.state.scale * 100).toFixed(1)}%
          </div>
        </div>
      </ToolbarStyles>
    );
  }
}

Toolbar.propTypes = {
  onZoomIn: PropTypes.func,
  onZoomOut: PropTypes.func
};

export default Toolbar;
