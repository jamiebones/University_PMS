import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Notifications } from "../NotificationClass";

Meteor.publish(
  "notification.getUserNotification",
  function NotificationPublication() {
    return Notifications.find({ for: this.userId });
  }
);

Meteor.publish(
  "notification.getUnreadNotification",
  function NotificationPublication() {
    return Notifications.find({ for: this.userId, read: false });
  }
);
