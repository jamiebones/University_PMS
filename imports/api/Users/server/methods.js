    /* eslint-disable */
    import { Meteor } from 'meteor/meteor';
    import { check, Match } from 'meteor/check';
    import editProfile from './edit-profile';
    import rateLimit from '../../../modules/rate-limit';
    import { Roles } from 'meteor/alanning:roles';
    import { Accounts } from 'meteor/accounts-base';
    
    
    

    Meteor.methods({
      'users.editProfile': function usersFunction(profile) {
        check(profile, {
          password: Match.Optional(Object),
          profile: {
            name: {
              first: String,
              last: String,
            },
            title : String,
          },
        });

        return editProfile({ userId: this.userId, profile })
        .then(response => response)
        .catch((exception) => {
          throw new Meteor.Error('500', exception);
        });
      },
      'users.sendVerificationEmail': function usersResendVerification() {
        return Accounts.sendVerificationEmail(this.userId);
      },
      'sendVerificationLink' : function usersFunction ( createdUserId ) {
        if ( createdUserId ){
          check( createdUserId , String );
          return Accounts.sendVerificationEmail( createdUserId );
        }
        else{
          let userId = Meteor.userId();
          if ( userId ) {
            return Accounts.sendVerificationEmail( userId );
          }
        }
      },
      'user.createUserAccount' : function usersFunction (user){
        
      
      },
      'user.updateProfile' : function usersFunction ( userId , profile ){
          check (userId , String)
          check (profile , Object)
          return Meteor.users.update(userId , {$set  : profile });
      },
      'user.deleteUser' : function usersFunction ( userId ){
          check (userId , String);
          const user = Meteor.user();
          if ( user ){
            
            if ( isInRole(user._id , 'super-admin' , Roles.GLOBAL_GROUP )){
              return Meteor.users.remove( userId );
            }
            else{
              return new Meteor.Error(500, "You must be an admin to be able to delete user account");
            }
          }
      },
    });



    rateLimit({
      methods: [
       
      ],
      limit: 5,
      timeRange: 1000,
    });
