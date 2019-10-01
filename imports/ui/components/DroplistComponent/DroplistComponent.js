/* eslint-disable */
import React from "react";
import { Row, Col, FormGroup } from "react-bootstrap";
import styled from "styled-components";
import Downshift from "downshift";
import autoBind from "react-autobind";

const DroplistComponentStyles = styled.div`
  .Collapsible__trigger {
    background: #79b959;
    font-size: 15px;
    color: #222323;
  }

  .Collapsible {
    background-color: #fff;
  }

  //The content within the collaspable area
  .Collapsible__contentInner {
    padding: 10px;
    border: 1px solid #9e9c89;
    border-top: 0;

    p {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  //The link which when clicked opens the collapsable area
  .Collapsible__trigger {
    display: block;
    font-weight: 400;
    text-decoration: none;
    position: relative;
    border: 1px solid white;
    padding: 10px;
    background: #3d509c;
    color: #e2f0f5;
    font-size: 16px;
    cursor: pointer;

    &:after {
      font-family: "FontAwesome";
      content: "\f107";
      position: absolute;
      right: 10px;
      top: 10px;
      display: block;
      transition: transform 300ms;
    }

    &.is-open {
      &:after {
        transform: rotateZ(180deg);
      }
    }

    &.is-disabled {
      opacity: 0.5;
      background-color: grey;
    }
  }

  .CustomTriggerCSS {
    background-color: lightcoral;
    transition: background-color 200ms ease;
  }

  .CustomTriggerCSS--open {
    background-color: darkslateblue;
  }

  .Collapsible__custom-sibling {
    padding: 5px;
    font-size: 12px;
    background-color: #cbb700;
    color: black;
  }
  .spantotal {
    text-align: right;
  }
  .staffDetails p:last-child {
    margin-bottom: 40px;
  }
  .staffDetails {
    p {
      padding: 5px;
    }

    hr {
      border: 10px;
    }

    span {
      background: #44a3cc;
      padding: 4px;
      color: #fff;
    }
  }

  .staffName {
    cursor: pointer;
  }

  .total {
    font-size: 18;
    font-style: oblique;
  }
  .dropdown-item {
    padding: 5px;
  }
`;

export default class DroplistComponent extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onChange(name) {
    this.props.setValue(name);
  }

  //onInputValueChange(value) {
  //   //setInputValue is a prop that saves the downshit value typed into it.
  //   this.props.setInputValue(value);
  // }

  render() {
    const { data, field, label, placeholder } = this.props;
    return (
      <DroplistComponentStyles>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Downshift
                onChange={this.onChange}
                /*onInputValueChange={this.onInputValueChange}*/
                itemToString={data => (data ? `${data}` : "")}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  highlightedIndex,
                  selectedItem,
                  getLabelProps
                }) => (
                  <div>
                    <label
                      style={{ marginTop: "1rem", display: "block" }}
                      {...getLabelProps()}
                    >
                      {label}
                    </label>

                    <input
                      {...getInputProps({
                        placeholder: placeholder
                      })}
                      className="form-control"
                      id="deptInput"
                    />

                    {isOpen ? (
                      <div className="downshift-dropdown">
                        {// filter the list and return items that match the inputValue
                        data &&
                          data
                            .filter(
                              item =>
                                !inputValue ||
                                item[field]
                                  .toLowerCase()
                                  .includes(inputValue.toLowerCase())
                            )
                            // map the return value and return a div
                            .map((element, index) => (
                              <div
                                className="dropdown-item"
                                {...getItemProps({
                                  key: index + element[field],
                                  index,
                                  item: element[field]
                                })}
                                style={{
                                  backgroundColor:
                                    highlightedIndex === index
                                      ? "lightgray"
                                      : "white",
                                  fontWeight:
                                    selectedItem === element[field]
                                      ? "bold"
                                      : "normal"
                                }}
                              >
                                {element[field]}
                              </div>
                            ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </Downshift>
            </FormGroup>
          </Col>
        </Row>
      </DroplistComponentStyles>
    );
  }
}
