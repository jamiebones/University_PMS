  import { Accounts } from 'meteor/accounts-base';
  import { Roles } from 'meteor/alanning:roles';

  //check the user property if it contains any role.
  Accounts.onCreateUser((options, user) => {
    const userToCreate = user;
    if (options.profile) userToCreate.profile = options.profile;
    return userToCreate;
});
