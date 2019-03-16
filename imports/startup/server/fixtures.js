import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Accounts } from "meteor/accounts-base";

//production app creates a user which is me of course.
if (Meteor.isProduction) {
  const adminUser = {
    email: Meteor.settings.private.AdminEmail,
    password: Meteor.settings.private.AdminPassword,
    profile: {
      name: { first: "James", last: "Oshomah" },
      title: "Mr"
    }
    //roles : ['admin'],
  };
  const userExists = Meteor.users.findOne({
    "emails.address": adminUser.email
  });
  if (!userExists) {
    const { email, password, profile } = adminUser;
    const userId = Accounts.createUser({ email, password, profile });
    Roles.addUsersToRoles(userId, "super-admin", Roles.GLOBAL_GROUP);
    //Roles.addUsersToRoles(userId, roles);
  }
}

if (!Meteor.isProduction) {
  const users = [
    {
      email: "records@admin.com",
      password: "password",
      profile: {
        name: { first: "Carl", last: "Winslow" },
        title: "Dr"
      },
      roles: ["canAddRecords", "canUpdateRecords", "canViewRecords"],
      group: "Records"
    },

    {
      email: "sats@admin.com",
      password: "password",
      profile: {
        name: { first: "Jamie", last: "Foster" },
        title: "Dr"
      },
      roles: ["canPost", "canViewRecords"],
      group: "SATS"
    }
  ];

  users.forEach(({ email, password, profile, roles, group }) => {
    const userExists = Meteor.users.findOne({ "emails.address": email });

    if (!userExists) {
      const userId = Accounts.createUser({ email, password, profile });
      Roles.addUsersToRoles(userId, roles, group);
    }
  });
}
