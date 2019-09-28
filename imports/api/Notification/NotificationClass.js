/*eslint-disable*/

import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const Notifications = new Mongo.Collection("notification");

Notifications.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Notifications.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const Notification = Class.create({
  name: "Notifications",
  collection: Notifications,
  fields: {
    message: String,
    for: String,
    from: String,
    read: Boolean,
    date: String
  }
});

export { Notification, Notifications };
