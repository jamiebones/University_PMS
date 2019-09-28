import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import rateLimit from "../../modules/rate-limit";
import { Notifications } from "./NotificationClass";

Meteor.methods({
  "notification.insert": function Notificationmethod(newNotification) {
    check(newNotification, Object);
    return Notifications.insert(newNotification);
  },
  "notification.markOneMessageRead": function Notificationmethod(messageId) {
    check(messageId, String);
    return Notifications.update({ _id: messageId }, { $set: { read: true } });
  },
  "notification.markAllMessageRead": function Notificationmethod(messageUser) {
    check(messageUser, String);
    return Notifications.update(
      { for: messageUser, read: false },
      { $set: { read: true } },
      { multi: true }
    );
  },

  "notification.deleteMessage": function Notificationmethod(messageId) {
    check(messageId, String);
    return Notifications.remove({ _id: messageId });
  }
});

rateLimit({
  methods: [
    "notification.insert",
    "notification.markOneMessageRead",
    "notification.markAllMessageRead",
    "notification.deleteMessage"
  ],
  limit: 5,
  timeRange: 1000
});
