import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import {
  Alert,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Col,
  Row,
  FormGroup,
  ControlLabel,
  HelpBlock,
  InputGroup
} from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import { Designations } from "../../../api/Designation/DesignationClass";
import { Cadres } from "../../../api/Cadre/CadreClass";
import AddCadreComponent from "../../components/AddCadreComponent/AddCadreComponent";
import { SortArrayOfObjects } from "../../../modules/utilities";
import DroplistComponent from "../../components/DroplistComponent/DroplistComponent";
import { Modal } from "react-bootstrap";

import {
  templateParser,
  templateFormatter,
  parseDigit,
  ReactInput
} from "input-format";

const AddNewCadreStyles = styled.div`
  .cadre {
    background: #fff;
    padding: 10px;
    margin-bottom: 5px;
    cursor: pointer;
  }
  .toolbar {
    margin-top: 30px;
  }
  .selected {
    background: green;
  }
  .input-group {
    margin-top: 24.5px;
  }
  .btn-xs,
  .btn-group-xs > .btn {
    font-size: 10px;
    border-radius: 78px;
  }

  .cadreEditBlock {
    margin-top: 40px;
    background: #7b6a6a;
    padding: 20px;
    color: white;
  }
  
.help-block {
  color: #000a8e;
`;

function AddNewCadre(props) {
  const [cadreComponent, setcadreComponent] = useState([]);
  const [cadreName, setcadreName] = useState("");
  const [cadre, setCadre] = useState("");
  const [cadreId, setcadreId] = useState("");
  const [staffType, setstaffType] = useState("0");
  const [cadreType, setcadreType] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [startEdit, setStartEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");

  const { loading, cadreDesignation, cadres } = props;
  const TEMPLATE = "xx";
  const parse = templateParser(TEMPLATE, parseDigit);
  const format = templateFormatter(TEMPLATE);

  const saveCadreInformation = () => {
    let cadreRankArray = [];
    cadreComponent.map(comp => {
      const obj = {};
      obj.rank = comp.rank;
      obj.level = comp.level;
      if (comp.rank !== "" || comp.level !== "") {
        cadreRankArray.push(obj);
      }
    });

    //
    if (cadreRankArray.length == "0") {
      Bert.alert("Please add a rank in the selected cadre", "danger");
      return;
    }

    if (staffType == "0") {
      Bert.alert("Please select staff type", "danger");
      return;
    }

    if (cadreName == "") {
      Bert.alert("Please enter cadre name", "danger");
      return;
    }

    const cadre = cadreName;
    const sortedArray = SortArrayOfObjects(cadreRankArray, "level");
    console.log(sortedArray);
    setSubmitted(submitted => !submitted);
    Meteor.call(
      "cadre.savenewCadre",
      sortedArray,
      cadre,
      startEdit,
      cadreId,
      staffType,
      err => {
        if (err) {
          setSubmitted(submitted => !submitted);
          setcadreName("");
          setstaffType("0");
          setcadreComponent([]);
          setCadre("");
          Bert.alert(`${err}`, "danger");
        } else {
          setSubmitted(submitted => !submitted);
          Bert.alert(`Successful.`, "success");
        }
      }
    );
  };

  const saveCadreName = e => {
    const cadreObject = {
      rank: "",
      level: "",
      index: ""
    };

    if (cadre !== "" && cadreComponent[0].rank !== "") {
      return;
    }
    setCadre(cadreName);
    setcadreType(staffType);
    setcadreComponent([cadreObject]);
  };

  const onChange = e => {
    debugger;
    const value = e.target.value.toUpperCase();
    setcadreName(value);
  };

  const onStaffTypeChange = e => {
    e.preventDefault();
    if (e.target.value === "0") return;
    setstaffType(e.target.value);
  };

  const addRankComponent = () => {
    const cadreObject = {
      rank: "",
      level: "",
      index: ""
    };
    setcadreComponent([...cadreComponent, cadreObject]);
  };

  const removeRankComponent = (e, componentIndex) => {
    const remaininingComponent = cadreComponent.filter((component, index) => {
      return index != componentIndex;
    });
    setcadreComponent(remaininingComponent);
  };

  const changeLevel = (value, index) => {
    //change the level of the cadrecomponent
    const component = cadreComponent[index];
    component.level = value;
    cadreComponent[index] = component;
    setcadreComponent([...cadreComponent]);
  };

  const cadreSelected = (e, { cadre, cadreRank, _id, cadreType }) => {
    //lets clear the state first
    setcadreName("");
    setstaffType("0");
    setcadreComponent([]);
    setCadre("");
    setcadreId("");
    setStartEdit(false);
    let arrayObject = [];
    let designationArray = [];
    cadreRank.map((e, index) => {
      const obj = {
        rank: e.rank,
        level: e.level,
        index
      };
      //add designation to the designation state
      designationArray.push(e.rank);
      arrayObject.push(obj);
    });
    //set the respective states here
    setDesignations(designationArray);
    setcadreName(cadre);
    setstaffType(cadreType || "0");
    setcadreComponent([...arrayObject]);
    setCadre(cadre);
    setcadreId(_id);
    setStartEdit(true);
  };

  const startNewEntry = () => {
    setcadreName("");
    setstaffType("0");
    setcadreComponent([]);
    setCadre("");
    setcadreId("");
    setStartEdit(false);
  };

  const setSelectedDesignation = designation => {
    //get the selected index here
    const newArray = [...designations];
    newArray[selectedIndex] = designation;
    //change the level of the cadrecomponent
    const component = cadreComponent[selectedIndex];
    component.rank = designation;
    component.index = selectedIndex;
    cadreComponent[selectedIndex] = component;
    setcadreComponent([...cadreComponent]);
    setDesignations(newArray);
    setShow(show => !show);
  };

  const showModal = index => {
    setShow(show => !show);
    setSelectedIndex(index);
  };

  const onHide = () => {
    setShow(false);
  };

  return (
    <AddNewCadreStyles>
      <Row>
        <Col md={6} mdOffset={1}>
          <FormGroup>
            <ControlLabel>
              <span className="text-danger">*</span>Cadre Name:
            </ControlLabel>

            <input
              className="form-control"
              value={cadreName}
              name="cadreName"
              onChange={onChange}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>
              <span className="text-danger">*</span>Staff Type:
            </ControlLabel>

            <select
              value={staffType}
              onChange={onStaffTypeChange}
              className="form-control"
            >
              <option value="0">select staff type</option>
              <option value="Senior Staff">Senior Staff</option>
              <option value="Junior Staff">Junior Staff</option>
            </select>
          </FormGroup>

          <HelpBlock>
            <h5>
              <b>
                Enter the cadre name and select the staff type click on the save
                button
              </b>
            </h5>
          </HelpBlock>

          <FormGroup>
            <Button bsStyle="info" onClick={saveCadreName}>
              Save Cadre
            </Button>
          </FormGroup>

          {cadre && staffType !== "0" ? (
            <div className="cadreEditBlock">
              <div className="text-center">
                <p>Cadre : {cadre}</p>

                <p>Staff Type : {staffType.toUpperCase()}</p>
              </div>

              {cadreComponent.length &&
                cadreComponent.map(({ rank, level }, index) => {
                  return (
                    <Row key={index}>
                      <Col md={4}>
                        <FormGroup>
                          <ControlLabel>Level:</ControlLabel>
                          <ReactInput
                            value={level}
                            onChange={value => changeLevel(value, index)}
                            className="form-control"
                            parse={parse}
                            format={format}
                            placeholder="00"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={8}>
                        <FormGroup>
                          <InputGroup>
                            <input
                              type="text"
                              value={designations[index] || ""}
                              disabled
                              className="form-control"
                            />
                            <InputGroup.Addon>
                              <Button
                                bsSize="xsmall"
                                onClick={() => showModal(index)}
                              >
                                Add
                              </Button>
                            </InputGroup.Addon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                  );
                })}

              <div className="pull-right">
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button onClick={addRankComponent} bsSize="small">
                      Add more rank
                    </Button>

                    {cadreComponent.length > 0 && (
                      <Button
                        onClick={e =>
                          removeRankComponent(e, cadreComponent.length - 1)
                        }
                        bsSize="small"
                      >
                        Remove rank
                      </Button>
                    )}
                  </ButtonGroup>
                </ButtonToolbar>
              </div>

              <br />
              <br />

              <div className="toolbar">
                <HelpBlock>
                  <h5>
                    <b>
                      Save the changes made by clicking the button below or
                      start afresh by clicking start new
                    </b>
                  </h5>
                </HelpBlock>

                <ButtonToolbar>
                  <ButtonGroup>
                    <Button
                      onClick={saveCadreInformation}
                      disabled={submitted}
                      bsStyle="info"
                    >
                      {submitted ? "Please wait......" : "Save Changes"}
                    </Button>

                    <Button onClick={startNewEntry} bsStyle="danger">
                      Start New
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </div>
            </div>
          ) : null}
        </Col>

        <Col md={3} mdOffset={1}>
          {!loading ? (
            <div>
              {cadres.length ? (
                cadres.map(({ cadre, cadreRank, _id, cadreType }, index) => {
                  return (
                    <div
                      key={index}
                      className="cadre"
                      onClick={e =>
                        cadreSelected(e, {
                          cadre,
                          cadreRank,
                          _id,
                          cadreType
                        })
                      }
                    >
                      {cadre}{" "}
                      <span className="rank pull-right text-danger">
                        <b>{cadreRank.length}</b>
                      </span>
                    </div>
                  );
                })
              ) : (
                <p>No cadre saved yet</p>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </Col>
      </Row>

      <Row>
        <Col md={6} mdOffset={3}>
          <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
              <Modal.Title>
                <p>Select Designation</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DroplistComponent
                data={cadreDesignation}
                field="rank"
                label="Designation"
                placeholder="Select Designation"
                setValue={setSelectedDesignation}
                /*setInputValue={setInputValueChange}*/
              />
            </Modal.Body>
            <Modal.Footer />
          </Modal>
        </Col>
      </Row>
    </AddNewCadreStyles>
  );
}

export default AddCadreContainer = withTracker(({}) => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("designation.getAllDesignations");
  }
  return {
    loading: subscription && !subscription.ready(),
    cadreDesignation: Designations.find({}, { sort: { rank: 1 } }).fetch(),
    cadres: Cadres.find({}, { sort: { cadre: 1 } }).fetch()
  };
})(AddNewCadre);
