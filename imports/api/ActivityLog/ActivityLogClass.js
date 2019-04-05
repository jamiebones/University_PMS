import { Mongo } from "meteor/mongo";
import { Class } from "meteor/jagi:astronomy";

const ActivityLogs = new Mongo.Collection("activitylogs");

ActivityLogs.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

ActivityLogs.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const ActivityLog = Class.create({
  name: "ActivityLogs",
  collection: ActivityLogs,
  fields: {
    username: String,
    name: String,
    activityTime: String,
    actionTaken: String,
    type: String
  }
});

export { ActivityLogs, ActivityLog };
