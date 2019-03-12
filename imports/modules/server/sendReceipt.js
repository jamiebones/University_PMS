import moment from "moment";
import { _ } from "meteor/underscore";

//sendReceipt

//send receipt function
//send courseware after being merged

const __sendCustomerReceipt = options => {
  return new Promise((resolve, reject) => {
    try {
      const { name, email, regNum, amount, rrr, transactionId } = options;
      //send the email to the customer here
      //sendReceipt(options)
    } catch (error) {}
  });
};
