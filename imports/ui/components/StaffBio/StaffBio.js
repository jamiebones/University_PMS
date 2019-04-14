/*eslint-disable */
import React from "react";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  Button,
  Alert,
  ButtonToolbar,
  ButtonGroup,
  InputGroup
} from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import { withTracker } from "meteor/react-meteor-data";
import DatePicker from "react-datepicker";
if (Meteor.isClient) import "react-datepicker/dist/react-datepicker.css";
import { NigeriaStates } from "../../../api/NigeriaStates/NigeriaStatesClass";
import moment from "moment";
import { GetDetailsBasedOnRole } from "../../../modules/utilities";
import autoBind from "react-autobind";
import StateModal from "../../components/StateModal/StateModal";
import { _ } from "meteor/underscore";

class StaffBio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dob: moment(),
      firstName: "",
      middleName: "",
      surname: "",
      sex: "",
      maritalStatus: "",
      staffId: "",
      profilePicture: "",
      state: "",
      stateOfOrigin: "",
      lgaOfOrigin: "",
      editStaff: false,
      showStateModal: false,
      firstRender: false,
      title: ""
    };
    autoBind(this);
  }

  static getDerivedStateFromProps(nextProps, state) {
    //if (nextProps.staff.stateOfOrigin.trim() !== state.state) {
    const { staff, states } = nextProps;
    if (staff != undefined && state.editStaff === false) {
      return {
        firstName: staff && staff.biodata && staff.biodata.firstName,
        title: (staff && staff.biodata && staff.biodata.title) || "",
        surname: staff && staff.biodata && staff.biodata.surname,
        middleName: staff && staff.biodata && staff.biodata.middleName,
        profilePicture: staff && staff.biodata && staff.biodata.profilePicture,
        sex: staff.sex,
        dob: moment(staff.dob),
        maritalStatus: staff.maritalStatus,
        staffId: staff.staffId,
        stateOfOrigin: staff.stateOfOrigin.trim(),
        lgaOfOrigin: staff.lgaOfOrigin.trim()
      };
    } else {
      return {};
    }
  }

  onChange(e) {
    if (e === "0") return;
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    const component = this;
  }

  saveChanges() {
    const staffObject = {
      sex: this.state.sex,
      maritalStatus: this.state.maritalStatus,
      title: this.state.title,
      staffId: this.state.staffId
    };
    Meteor.call("staffMembers.saveChanges", staffObject, err => {
      if (!err) {
        Bert.alert("state changed successful", "success");
      } else {
        Bert.alert(`There was an error: ${error}`, "danger");
      }
    });
  }

  render() {
    const { staff, states, history } = this.props;
    const { editStaff } = this.state;
    return (
      <div className="StaffBio">
        <Row>
          <Col xs={12} sm={8} md={8} lg={8}>
            <form ref={form => (this.form = form)}>
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <select
                  className="form-control"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  disabled={!editStaff}
                >
                  <option value="0">select title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Professor</option>
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>First Name</ControlLabel>
                <input
                  type="text"
                  name="firstName"
                  disabled
                  value={this.state.firstName}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Middle Name</ControlLabel>
                <input
                  type="text"
                  name="middleName"
                  disabled
                  value={this.state.middleName}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Surname</ControlLabel>
                <input
                  type="text"
                  name="surname"
                  disabled
                  value={this.state.surname}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Date of Birth</ControlLabel>
                <DatePicker
                  selected={this.state.dob}
                  onChange={this.onChange}
                  disabled
                  className="form-control"
                  placeholderText="date of birth"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Sex</ControlLabel>
                <select
                  className="form-control"
                  name="sex"
                  value={this.state.sex}
                  onChange={this.onChange}
                  disabled={!editStaff}
                >
                  <option value="0">select sex</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Marital Status</ControlLabel>
                <select
                  className="form-control"
                  name="maritalStatus"
                  value={this.state.maritalStatus}
                  onChange={this.onChange}
                  disabled={!editStaff}
                >
                  <option value="0">select marital status</option>
                  <option value="S">single</option>
                  <option value="M">married</option>
                  <option value="D">divorced</option>
                  <option value="W">widow</option>
                  <option value="W">widower</option>
                </select>
              </FormGroup>

              <FormGroup>
                <ControlLabel>State of Origin</ControlLabel>
                <InputGroup>
                  <input
                    type="text"
                    disabled
                    name="stateOfOrigin"
                    value={this.state.stateOfOrigin}
                    onChange={this.onChange}
                    className="form-control"
                  />

                  {GetDetailsBasedOnRole("Records", "Personnel") && (
                    <InputGroup.Button>
                      <Button
                        bsStyle="info"
                        onClick={() =>
                          this.setState({
                            showStateModal: true,
                            firstRender: true
                          })
                        }
                      >
                        Edit State
                      </Button>
                    </InputGroup.Button>
                  )}
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <ControlLabel>LGA</ControlLabel>
                <input
                  type="text"
                  disabled
                  name="stateOfOrigin"
                  value={this.state.lgaOfOrigin}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Staff ID </ControlLabel>
                <input
                  type="text"
                  name="staffId"
                  disabled
                  value={this.state.staffId}
                  onChange={this.onChange}
                  className="form-control"
                />
              </FormGroup>

              {GetDetailsBasedOnRole("Records", "Personnel") && (
                <ButtonToolbar>
                  <ButtonGroup bsSize="small">
                    <Button
                      bsStyle="info"
                      onClick={() =>
                        this.setState({
                          editStaff: !this.state.editStaff
                        })
                      }
                    >
                      Start Edit
                    </Button>
                    <Button
                      bsStyle="success"
                      disabled={!editStaff}
                      onClick={this.saveChanges}
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              )}
            </form>
          </Col>

          <Col xs={12} sm={4} md={4} lg={4}>
            {/*profilePicture ? (
              <p>
                <span className="text-center">Profile Picture</span>
                <img
                  className="img img-responsive"
                  src={profilePicture && profilePicture}
                />
              </p>
            ) : null*/}
          </Col>
        </Row>

        <StateModal
          staffState={this.state.stateOfOrigin}
          staffLga={this.state.lgaOfOrigin}
          staffId={this.state.staffId}
          show={this.state.showStateModal}
          onHide={() => this.setState({ showStateModal: false })}
          history={history}
          states={states}
          firstRender={this.state.firstRender}
          toggleFirstRender={() => this.setState({ firstRender: false })}
          staff={staff}
        />
      </div>
    );
  }
}

export default (StaffBioContainer = withTracker(() => {
  let subscription;
  if (Meteor.isClient) {
    subscription = Meteor.subscribe("nigeriastates.getallStates");
  }

  return {
    loading: subscription && !subscription.ready(),
    //staff: StaffMembers.find(staffId).fetch(),
    states: NigeriaStates.find({}).fetch()
  };
})(StaffBio));
