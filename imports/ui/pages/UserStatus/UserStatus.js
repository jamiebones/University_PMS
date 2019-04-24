import React from "react";
import {
  Table,
  Alert,
  Button,
  Col,
  Modal,
  Row,
  Label,
  ButtonToolbar,
  ButtonGroup
} from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";
import { Bert } from "meteor/themeteorchef:bert";
import Loading from "../../components/Loading/Loading";
import { sumMeUp, StripRolesFromGroup } from "../../../modules/utilities";
import { _ } from "meteor/underscore";
import renderHTML from "react-render-html";
import autoBind from "react-autobind";

class UserStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autoBind(this);
  }

  handleRemoveUser(event, userId) {
    event.preventDefault();
    const prompt = confirm("Are you sure you want to delete this account");
    if (!prompt) {
      return false;
    }
    Meteor.call("user.deleteUser", userId, (error, response) => {
      if (!error) {
        Bert.alert("Account deleted", "success");
      } else {
        Bert.alert(`There was an error ${error.reason}`, "danger");
      }
    });
  }

  render() {
    const { loading, users } = this.props;
    return !loading ? (
      users.length ? (
        <div>
          <Table responsive condensed>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Email</th>
                <th>Account Creation Date</th>
                <th>Status</th>
                <th>User Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(
                ({ emails, profile, roles, status, createdAt, _id }, index) => {
                  return (
                    <tr key={index}>
                      <td>{sumMeUp(index, 1)}</td>
                      <td>
                        {profile && profile.name.first}{" "}
                        {profile && profile.name.last}
                      </td>
                      <td>{emails[0].address}</td>
                      <td>
                        {moment(createdAt).format("MMMM Do, YYYY [at] hh:mm a")}
                      </td>
                      <td>
                        {status && status.online}
                        <Label
                          bsStyle={
                            status && status.online ? "success" : "warning"
                          }
                        >
                          {status && status.online ? "Online" : "Offline"}
                        </Label>
                      </td>

                      <td>{roles && renderHTML(StripRolesFromGroup(roles))}</td>

                      <td>
                        {Meteor.userId() === _id ? (
                          ""
                        ) : emails[0].address ===
                          "jamiebones2000@yahoo.co.uk" ? (
                          ""
                        ) : (
                          <ButtonToolbar>
                            <ButtonGroup bsSize="xsmall">
                              <Button
                                bsStyle="danger"
                                onClick={event =>
                                  this.handleRemoveUser(event, _id)
                                }
                              >
                                Delete Account
                              </Button>
                            </ButtonGroup>
                          </ButtonToolbar>
                        )}
                      </td>
                      <td />
                    </tr>
                  );
                }
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert bsStyle="warning">No users yet!</Alert>
      )
    ) : (
      <Loading />
    );
  }
}

export default (UserStatusContainer = withTracker(() => {
  const subscription = Meteor.subscribe("users.allUsers");
  return {
    loading: !subscription.ready(),
    users: Meteor.users.find({}).fetch()
  };
})(UserStatus));
