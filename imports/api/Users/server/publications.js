import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";

Meteor.publish("users.editProfile", function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1
    }
  });
});

Meteor.publish("users.allUsers", function usersProfile() {
  return Meteor.users.find(
    {},
    {
      fields: {
        emails: 1,
        profile: 1,
        services: 1,
        roles: 1,
        createdAt: 1,
        status: 1
      }
    }
  );
});

Meteor.publish("users.findOneUser", function usersProfile(userId) {
  check(userId, String);
  return Meteor.users.find(userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
      roles: 1,
      createdAt: 1,
      status: 1
    }
  });
});

Meteor.publish(null, function() {
  return Meteor.roles.find({});
});
