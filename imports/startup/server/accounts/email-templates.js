import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

const name = "";
const email = "";
const from = `${name} <${email}>`;
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;
emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Reset Your Password`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace("#/", "");
    if (Meteor.isDevelopment)
      console.info(`Reset Password Link: ${urlWithoutHash}`);
    return `A password reset has been requested for the account related to this
      address (${userEmail}). To reset the password, visit the following link:
      \n\n${urlWithoutHash}\n\n If you did not request this reset, please ignore
      this email. If you feel something is wrong, please contact our support team:
      ${email}.`;
  }
};

emailTemplates.verifyEmail = {
  subject() {
    return `[${name}] Verify Your Email Address`;
  },
  text(user, url) {
    const emailAddress = user.emails[0].address;
    const urlWithoutHash = url.replace("#/", "");
    if (Meteor.isDevelopment) {
      console.info(`Verify Email Link: ${urlWithoutHash}`); // eslint-disable-line
      return `Hey, ${
        user.profile.name.first
      }! Welcome to ${name}.\n\nTo verify your
            email address (${emailAddress}), click the link below:\n\n${urlWithoutHash}\n\nIf
            you feel something is wrong, please contact our support team: ${email}.`;
    }
    (supportEmail = "support@eruditescholars.net"),
      (emailBody = `To verify your email address (${emailAddress}) visit the
          following link:\n\n${urlWithoutHash}\n\n If you did not request this
          verification, please ignore this email. If you feel something is wrong,
          please contact our support team: ${supportEmail}.`);
    return emailBody;
  }
};
