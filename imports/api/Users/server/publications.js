   import { Meteor } from 'meteor/meteor';

    Meteor.publish('users.editProfile', function usersProfile() {
      return Meteor.users.find(this.userId, {
        fields: {
          emails: 1,
          profile: 1,
          services: 1,
        },
      });
    });

    Meteor.publish('users.allUsers', function usersProfile() {
      return Meteor.users.find({}, {
        fields: {
          emails: 1,
          profile: 1,
          services: 1,
          roles: 1,
          createdAt : 1,
          status : 1,
        },
      });
    });

    Meteor.publish(null, function (){
      return Meteor.roles.find({})
   });
