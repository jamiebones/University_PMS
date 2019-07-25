import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { ActivityLogs } from "../ActivityLogClass";

Meteor.methods({
  "activitylog.getType": function ActivityLogPublication() {
    const pipeline = [
      {
        $group: {
          _id: "$type"
        }
      }
    ];

    return ActivityLogs.aggregate(pipeline);
  },
  "activitylog.getActivityByLog": function ActivityLogPublication(
    type,
    limitDoc,
    skipDoc
  ) {
    check(type, Match.OneOf(String, null, undefined));
    check(limitDoc, Number);
    check(skipDoc, Number);
    return [
      ActivityLogs.find(
        { type: type },
        { sort: { activityTime: -1 }, skip: skipDoc, limit: limitDoc }
      ).fetch(),
      ActivityLogs.find({ type: type }).count()
    ];
  }
});
