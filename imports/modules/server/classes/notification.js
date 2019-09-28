/*eslint-disable*/
import { Meteor } from "meteor/meteor";
import { Notification } from "../../../api/Notification/NotificationClass";

class Notifiy {
  getAccountUserIdArray(accountType) {
    if (accountType === "") {
      throw new Meteor.Error("Please enter the account type");
    }
    const users = Meteor.users.find({}).fetch();
    //get allusers which should not be more than 100
    const usersRoleArray = [];
    users.map(({ _id, roles }) => {
      //you belong to only one role
      const groupArray = Object.keys(roles);
      const groupName = groupArray[0];
      const role = roles[groupName][0];
      if (role.toLowerCase() === accountType.toLowerCase()) {
        usersRoleArray.push(_id);
      }
    });

    return usersRoleArray;
  }
  sendNotification({ accountType, from, message }) {
    debugger;
    //send notification by account type
    //get the account that is used for sending notification
    const userIdArray = this.getAccountUserIdArray(accountType);
    userIdArray.map(userId => {
      //lets send notification to this id
      const newNotification = new Notification({
        message,
        for: userId,
        from,
        read: false,
        date: new Date().toISOString()
      });
      return newNotification.save();
    });
  }
}

export default Notifiy;
