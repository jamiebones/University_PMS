import React from "react";
import { Meteor } from "meteor/meteor";
import Loading from "../../components/Loading/Loading";
import {
  Alert,
  Button,
  Col,
  Row,
  FormGroup,
  InputGroup,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import { templateParser, templateFormatter, parseDigit } from "input-format";
import { ReactInput } from "input-format";
import { Bert } from "meteor/themeteorchef:bert";
import styled from "styled-components";
import { _ } from "meteor/underscore";
import { SortArrayByKey } from "../../../modules/utilities";
import { UniversityCadres } from "../../../api/UniversityCadre/UniversityCadreClass";
import Collapsible from "react-collapsible";
import autoBind from "react-autobind";

const StyledAddCadres = styled.div`
  margin-top: 20px;
  p {
    font-style: italic;
    color: #000;
  }
  .rank {
    width: 100px;
  }
  .cadre {
    .Collapsible__trigger {
      background: #79b959;
      font-size: 15px;
      color: #222323;
      color: #222323;
      cursor: pointer;
      padding: 5px;
      width: 100%;
    }
    .Collapsible__contentInner {
      padding-top: 10px;
    }
  }
`;

class AddCadres extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cadreName: "",
      rank: "",
      submitted: false,
      designationRank: "",
      designation: ""
    };
    autoBind(this);
  }

  getDerivedStateFromProps(nextProps, state) {
    return {};
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleRankChange(value) {
    const rank = value;
    this.setState({ rank: rank });
  }

  handleDesignationRankChange(value) {
    this.setState({ designationRank: value });
  }

  saveCadreName() {
    const { rank, cadreName } = this.state;
    this.setState({ submitted: !this.state.submitted });
    if (rank == "") {
      alert("Rank can not be empty");
      return;
    }
    if (cadreName == "") {
      alert("Cadre name can not be empty");
      return;
    }

    Meteor.call("universityCadre.saveCadreName", rank, cadreName, err => {
      if (err) {
        this.setState({ submitted: !this.state.submitted });
        Bert.alert(`${err}`, "danger");
      } else {
        this.setState({
          submitted: !this.state.submitted,
          cadreName: "",
          rank: ""
        });
        Bert.alert(
          `${cadreName} saved. You can now add designation to it`,
          "success"
        );
      }
    });
  }

  saveDesignation(serial) {
    const { designationRank, designation } = this.state;
    this.setState({ submitted: !this.state.submitted });
    if (designationRank == "") {
      alert("Designation rank can not be empty");
      return;
    }
    if (designation == "") {
      alert("Designation can not be empty");
      return;
    }

    Meteor.call(
      "universityCadre.saveDesignation",
      serial,
      designation,
      designationRank,
      err => {
        if (err) {
          this.setState({ submitted: !this.state.submitted });
          Bert.alert(`${err}`, "danger");
        } else {
          this.setState({
            submitted: !this.state.submitted,
            designation: "",
            designationRank: ""
          });
          Bert.alert(`${designation} saved.`, "success");
        }
      }
    );
  }

  render() {
    const TEMPLATE = "xx";
    const parse = templateParser(TEMPLATE, parseDigit);
    const format = templateFormatter(TEMPLATE);
    const { cadres, loading } = this.props;
    return (
      <StyledAddCadres>
        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>
                <span className="text-danger">*</span>Rank:
              </ControlLabel>
              <ReactInput
                value={this.state.rank}
                onChange={value => this.handleRankChange(value)}
                className="form-control rank"
                id="paperNumId"
                parse={parse}
                format={format}
                placeholder="00"
              />
            </FormGroup>
            <HelpBlock>
              <h5>
                <b>
                  Rank is the order you want the cadres to appear on appraisals
                </b>
              </h5>
            </HelpBlock>
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
              <Button bsStyle="info" onClick={this.saveCadreName}>
                Save Cadre
              </Button>
            </FormGroup>
          </Col>

          <Col md={6}>
            {!loading ? (
              <div>
                {cadres.length ? (
                  cadres.map(({ serial, ranks, cadre }, index) => {
                    return (
                      <div key={index} className="cadre">
                        <Collapsible trigger={`  ${cadre} : Rank ${serial}`}>
                          {/*sort the rank array */}
                          {SortArrayByKey(ranks, ranks.serial).map(
                            ({ rankName, serial }) => {
                              return <p key={serial + 600}>{rankName}</p>;
                            }
                          )}

                          <FormGroup>
                            <ControlLabel>
                              <span className="text-danger">*</span>New
                              Designation:
                            </ControlLabel>
                            <ReactInput
                              value={this.state.designationRank}
                              onChange={value =>
                                this.handleDesignationRankChange(value)
                              }
                              className="form-control rank"
                              id="desinationRank"
                              parse={parse}
                              format={format}
                              placeholder="00"
                            />
                          </FormGroup>
                          <HelpBlock>
                            <h5>
                              <b>
                                Rank is the order you want the designation to
                                appear on appraisals
                              </b>
                            </h5>
                          </HelpBlock>
                          <FormGroup>
                            <ControlLabel>
                              <span className="text-danger">*</span>Designation:
                            </ControlLabel>

                            <input
                              className="form-control"
                              value={this.state.designation}
                              name="designation"
                              onChange={this.onChange}
                            />
                          </FormGroup>

                          <FormGroup>
                            <Button
                              bsStyle="info"
                              onClick={() => this.saveDesignation(serial)}
                            >
                              Save Designation
                            </Button>
                          </FormGroup>
                        </Collapsible>
                        <br />
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
      </StyledAddCadres>
    );
  }
}

export default (AddCadreContainer = withTracker(({}) => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("universityCadre.getAllCadres");
  }
  return {
    loading: subscription && !subscription.ready(),
    cadres: UniversityCadres.find({}, { sort: { serial: 1 } }).fetch(),
    b: console.log(UniversityCadres.find({}, { sort: { serial: 1 } }).fetch())
  };
})(AddCadres));
