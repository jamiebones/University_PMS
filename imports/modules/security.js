import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";

export default class Security {
  static checkRole(userId, role, group) {
    if (Roles.userIsInRole(userId, [role], group)) {
      return true;
    }
    throw new Meteor.Error(403, "not authorized");
  }

  static addUserToRole(userId, role, group) {
    return Roles.addUsersToRole(userId, role, group);
  }
}
