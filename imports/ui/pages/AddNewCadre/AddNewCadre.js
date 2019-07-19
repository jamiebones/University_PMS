import React from "react";
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
  HelpBlock
} from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import { Cadres } from "../../../api/Cadre/CadreClass";
import autoBind from "react-autobind";
import AddCadreComponent from "../../components/AddCadreComponent/AddCadreComponent";
import { SortArrayOfObjects } from "../../../modules/utilities";

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
`;

class AddNewCadre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cadreName: "",
      cadreComponent: [],
      startEdit: false,
      cadre: "",
      cadreId: "",
      staffType: "0",
      cadreType: ""
    };
    autoBind(this);
  }

  saveCadreInformation() {
    const {
      cadreName,
      cadreComponent,
      startEdit,
      cadreId,
      staffType
    } = this.state;
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
    const cadreType = staffType;
    const sortedArray = SortArrayOfObjects(cadreRankArray, "level");
    console.log(sortedArray);
    this.setState({ submitted: !this.state.submitted });
    Meteor.call(
      "cadre.savenewCadre",
      sortedArray,
      cadre,
      startEdit,
      cadreId,
      cadreType,
      err => {
        if (err) {
          this.setState({
            submitted: !this.state.submitted,
            cadreName: "",
            staffType: "",
            cadreComponent: [],
            cadre: ""
          });
          Bert.alert(`${err}`, "danger");
        } else {
          this.setState({
            submitted: !this.state.submitted
          });
          Bert.alert(`Successful.`, "success");
        }
      }
    );
  }

  saveCadreName(e) {
    const cadreObject = {
      rank: "",
      level: ""
    };
    const { cadreComponent, cadre } = this.state;

    if (cadre !== "" && cadreComponent[0].rank !== "") {
      return;
    }

    this.setState({
      cadre: this.state.cadreName,
      cadreType: this.state.staffType,
      cadreComponent: [cadreObject]
    });
  }

  onChange(e) {
    this.setState({ cadreName: e.target.value.toUpperCase() });
  }

  onStaffTypeChange(e) {
    e.preventDefault();
    if (e.target.value === "0") return;
    this.setState({ staffType: e.target.value });
  }

  addRankComponent() {
    const cadreObject = {
      rank: "",
      level: ""
    };
    this.setState({
      cadreComponent: [...this.state.cadreComponent, cadreObject]
    });
  }

  removeRankComponent(e, componentIndex) {
    const remaininingComponent = this.state.cadreComponent.filter(
      (component, index) => {
        return index != componentIndex;
      }
    );
    this.setState({ cadreComponent: remaininingComponent });
  }

  addLevelAndRankToState({ level, rank, index }) {
    const cadreObject = {
      rank,
      level,
      index
    };
    let stateCadreRank = this.state.cadreComponent;
    stateCadreRank[index] = cadreObject;
    this.setState({ cadreComponent: stateCadreRank });
  }

  cadreSelected(e, { cadre, cadreRank, _id, cadreType }) {
    //lets clear the state first
    this.setState({
      cadreName: "",
      cadreComponent: [],
      startEdit: false,
      cadre: "",
      cadreId: "",
      staffType: "0"
    });
    let arrayObject = [];
    cadreRank.map((e, index) => {
      const obj = {
        rank: e.rank,
        level: e.level,
        index
      };
      arrayObject.push(obj);
    });
    this.setState({
      cadreName: cadre,
      cadre: cadre,
      cadreComponent: arrayObject,
      startEdit: true,
      cadreId: _id,
      staffType: cadreType || "0"
    });
  }

  startNewEntry() {
    this.setState({
      cadreName: "",
      cadreComponent: [],
      staffType: "0",
      startEdit: false,
      cadre: "",
      cadreId: ""
    });
  }

  render() {
    const { cadreComponent, submitted } = this.state;
    const { loading, cadres } = this.props;
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
                value={this.state.cadreName}
                name="cadreName"
                onChange={this.onChange}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>
                <span className="text-danger">*</span>Staff Type:
              </ControlLabel>

              <select
                value={this.state.staffType}
                onChange={this.onStaffTypeChange}
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
                  Enter the cadre name and select the staff type click on the
                  save button
                </b>
              </h5>
            </HelpBlock>

            <FormGroup>
              <Button bsStyle="info" onClick={this.saveCadreName}>
                Save Cadre
              </Button>
            </FormGroup>

            {this.state.cadre && this.state.staffType !== "0" ? (
              <div>
                <div className="text-center">
                  <p>Cadre : {this.state.cadre}</p>

                  <p>Staff Type : {this.state.staffType.toUpperCase()}</p>
                </div>

                {cadreComponent.length &&
                  cadreComponent.map(({ rank, level }, index) => {
                    return (
                      <AddCadreComponent
                        key={index}
                        index={index}
                        rank={rank}
                        level={level}
                        setLevelAndRank={this.addLevelAndRankToState}
                      />
                    );
                  })}

                <div className="pull-right">
                  <ButtonToolbar>
                    <ButtonGroup>
                      <Button onClick={this.addRankComponent} bsSize="small">
                        Add more rank
                      </Button>

                      {cadreComponent.length > 0 && (
                        <Button
                          onClick={e =>
                            this.removeRankComponent(
                              e,
                              cadreComponent.length - 1
                            )
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
                        onClick={this.saveCadreInformation}
                        disabled={submitted}
                        bsStyle="info"
                      >
                        {submitted ? "Please wait......" : "Save Changes"}
                      </Button>

                      <Button onClick={this.startNewEntry} bsStyle="danger">
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
                          this.cadreSelected(e, {
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
      </AddNewCadreStyles>
    );
  }
}

export default (AddCadreContainer = withTracker(({}) => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("cadre.getAllCadres");
  }
  return {
    loading: subscription && !subscription.ready(),
    cadres: Cadres.find({}, { sort: { cadre: 1 } }).fetch()
  };
})(AddNewCadre));
