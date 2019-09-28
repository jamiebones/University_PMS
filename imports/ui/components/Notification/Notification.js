/*eslint-disable*/
import React from "react";
import { Button, Alert, Label, Row, Col } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Bert } from "meteor/themeteorchef:bert";
import { _ } from "meteor/underscore";
import renderHTML from "react-render-html";
import moment from "moment";
import Loading from "../Loading/Loading";
import autoBind from "react-autobind";
import { Notifications } from "../../../api/Notification/NotificationClass";

class NotificationsComponent extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  markAsRead(event, messageId) {
    event.preventDefault();
    Meteor.call("notification.markOneMessageRead", messageId, error => {
      if (error) {
        Bert.alert(`${error.reason}`, "danger");
      }
    });
  }

  deleteMessage(event, messageId) {
    event.preventDefault();
    Meteor.call("notification.deleteMessage", messageId, error => {
      if (error) {
        Bert.alert(`${error.reason}`, "danger");
      }
    });
  }

  markAllMessageRead(event) {
    event.preventDefault();
    const userId = Meteor.userId();
    Meteor.call("notification.markAllMessageRead", userId, error => {
      if (error) {
        Bert.alert(`${error.reason}`, "danger");
      }
    });
  }

  render() {
    const { loading, notification } = this.props;
    return !loading ? (
      notification && notification.length ? (
        <Row>
          <Col md={6} mdOffset={3}>
            <span className="pull-right">
              <Button
                bsSize="xsmall"
                bsStyle="success"
                onClick={event => this.markAllMessageRead(event)}
              >
                Mark All Message As Read
              </Button>
            </span>
            <br />
            <br />
            <hr />
            {notification.map(({ message, from, date, read, _id }, index) => {
              return (
                <div key={index}>
                  <p> Sender : {from} </p>

                  <div> Message :{renderHTML(message)} </div>

                  <p>
                    {" "}
                    Date : {moment(date).format("MMMM Do, YYYY [at] hh:mm a")}
                  </p>

                  <p>
                    {" "}
                    {read !== true ? (
                      <Button
                        bsSize="xsmall"
                        bsStyle="success"
                        onClick={event => this.markAsRead(event, _id)}
                      >
                        Mark As Read
                      </Button>
                    ) : (
                      <Label bsStyle="success">Read</Label>
                    )}
                    <span className="pull-right">
                      <Button
                        bsSize="xsmall"
                        bsStyle="danger"
                        onClick={event => this.deleteMessage(event, _id)}
                      >
                        Delete Message
                      </Button>
                    </span>
                  </p>
                </div>
              );
            })}
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={6} mdOffset={3}>
            <Alert bsStyle="warning">No new notifications</Alert>
          </Col>
        </Row>
      )
    ) : (
      <Row>
        <Col md={6} mdOffset={3}>
          <Loading />
        </Col>
      </Row>
    );
  }
}

export default NotificationContainer = withTracker(() => {
  const subscription = Meteor.subscribe("notification.getUserNotification");
  return {
    loading: !subscription.ready(),
    notification: Notifications.find(
      { for: Meteor.userId() },
      { sort: { date: -1 } }
    ).fetch()
  };
})(NotificationsComponent);
