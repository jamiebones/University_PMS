/* eslint-disable */
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import editProfile from "./edit-profile";
import rateLimit from "../../../modules/rate-limit";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";
import { _ } from "meteor/underscore";

const isInRole = (user, userRoles, group) => {
  if (Roles.userIsInRole(user, [userRoles], group)) {
    return true;
  }
  {
    return false;
  }
};

Meteor.methods({
  "users.editProfile": function usersFunction(profile) {
    check(profile, {
      password: Match.Optional(Object),
      profile: {
        name: {
          first: String,
          last: String
        }
      }
    });

    return editProfile({ userId: this.userId, profile })
      .then(response => response)
      .catch(exception => {
        throw new Meteor.Error("500", exception);
      });
  },
  "users.getGroupCount": function usersFunction() {
    const pipeline = [
      { $unwind: { path: "$roles.Personnel" } },
      {
        $group: {
          _id: "$roles.Personnel",
          count: { $sum: 1 }
        }
      }
    ];
    const result = Meteor.users.aggregate(pipeline);
    return result;
  },
  "user.createUserAccount": function usersFunction(user) {
    check(user, Object);
    try {
      //check the previous created account and prevent
      //the creation of account
      const Registrar = Meteor.users.find({ "roles.Personnel.0": "Director" });
      const Director = Meteor.users.find({ "roles.Personnel.0": "Registrar" });
      if (!_.isEmpty(Registrar) && user.roles === "Registrar") {
        throw new Meteor.Error(
          "Account Exist",
          `There is already an account of type Registrar`
        );
      }
      if (!_.isEmpty(Director) && user.roles === "Director") {
        throw new Meteor.Error(
          "Account Exist",
          `There is already an account of type Director `
        );
      }
      const userId = Accounts.createUser(user);
      Roles.setUserRoles(userId, user.roles, "Personnel");
      return;
    } catch (exception) {
      throw new Meteor.Error("500", `${exception}`);
    }
  },
  "user.updateProfile": function usersFunction(userId, profile) {
    check(userId, String);
    check(profile, Object);
    return Meteor.users.update(userId, { $set: profile });
  },
  "user.deleteUser": function usersFunction(userId) {
    check(userId, String);
    const user = Meteor.user();
    if (user) {
      if (isInRole(user._id, "super-admin", Roles.GLOBAL_GROUP)) {
        return Meteor.users.remove(userId);
      } else {
        return new Meteor.Error(
          500,
          "You must be an admin to be able to delete user account"
        );
      }
    }
  }
});

rateLimit({
  methods: [],
  limit: 5,
  timeRange: 1000
});
