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

const AddNewCadreStyles = styled.div`
  .cadre {
    background: #fff;
    padding: 10px;
    margin-bottom: 5px;
    cursor: pointer;
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
      cadreId: ""
    };
    autoBind(this);
  }

  saveCadreInformation() {
    const { cadreName, cadreComponent, startEdit, cadreId } = this.state;
    let cadreRankArray = [];
    cadreComponent.map(comp => {
      const obj = {};
      obj.rank = comp.rank;
      obj.level = comp.level;
      cadreRankArray.push(obj);
    });
    const cadre = cadreName;
    this.setState({ submitted: !this.state.submitted });
    Meteor.call(
      "cadre.savenewCadre",
      cadreRankArray,
      cadre,
      startEdit,
      cadreId,
      err => {
        if (err) {
          this.setState({
            submitted: !this.state.submitted,
            cadreName: "",
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
    this.setState({
      cadre: this.state.cadreName,
      cadreComponent: [cadreObject]
    });
  }

  onChange(e) {
    this.setState({ cadreName: e.target.value.trim().toUpperCase() });
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

  cadreSelected(e, { cadre, cadreRank, _id }) {
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
      cadreId: _id
    });
  }

  startNewEntry() {
    this.setState({
      cadreName: "",
      cadreComponent: [],
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
          <Col md={6}>
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

            <HelpBlock>
              <h5>
                <b>Enter the cadre name and click on the save button</b>
              </h5>
            </HelpBlock>

            <FormGroup>
              <Button bsStyle="info" onClick={this.saveCadreName}>
                Save Cadre
              </Button>
            </FormGroup>

            {this.state.cadre ? (
              <div>
                <p>{this.state.cadre}</p>
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

                <ButtonToolbar>
                  <ButtonGroup>
                    <Button
                      onClick={this.addRankComponent}
                      bsSize="small"
                      bsStyle="info"
                    >
                      Add more rank
                    </Button>

                    {cadreComponent.length > 0 && (
                      <Button
                        onClick={e =>
                          this.removeRankComponent(e, cadreComponent.length - 1)
                        }
                        bsSize="small"
                        bsStyle="danger"
                      >
                        Remove rank
                      </Button>
                    )}
                  </ButtonGroup>
                </ButtonToolbar>
                <HelpBlock>
                  <h5>
                    <b>Save the changes made by clicking the button below</b>
                  </h5>
                </HelpBlock>

                <ButtonToolbar>
                  <ButtonGroup>
                    <Button
                      onClick={this.saveCadreInformation}
                      disabled={submitted}
                    >
                      {submitted ? "Please wait......" : "Save Changes"}
                    </Button>

                    <Button onClick={this.startNewEntry} bsStyle="danger">
                      Start New
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </div>
            ) : null}
          </Col>

          <Col md={3} mdOffset={2}>
            {!loading ? (
              <div>
                {cadres.length ? (
                  cadres.map(({ cadre, cadreRank, _id }, index) => {
                    return (
                      <div
                        key={index}
                        className="cadre"
                        onClick={e =>
                          this.cadreSelected(e, { cadre, cadreRank, _id })
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
