import Customers from "../../../api/Customers/Customers";
import { _ } from "meteor/underscore";

const checkIfNewCustomer = customerDetails => {
  return new Promise((resolve, reject) => {
    let { email } = customerDetails;
    email = email.trim().toLowerCase();
    //find the email if available
    try {
      const customer = Customers.findOne({ email });
      //check for customer
      if (_.isEmpty(customer)) {
        //we have a customer
        resolve({ isNew: true, oldCustomer: {} });
      } else {
        resolve({ isNew: false, oldCustomer: customer });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const createNewCustomer = customerDetails => {
  return new Promise((resolve, reject) => {
    let { email, firstname, surname } = customerDetails;
    email = email.trim().toLowerCase();
    //find the email if available
    try {
      const newCustomer = {
        email,
        name: `${firstname} ${surname}`
      };
      const customerId = Customers.insert(newCustomer);
      const savedCustomer = Customers.findOne(customerId);
      resolve(savedCustomer);
    } catch (error) {
      reject(error);
    }
  });
};

export default (CheckCustomers = async customerDetails => {
  let customer = "";
  const { isNew, oldCustomer } = await checkIfNewCustomer(customerDetails);
  if (isNew) {
    const newCustomer = await createNewCustomer(customerDetails);
    customer = newCustomer;
  } else {
    customer = oldCustomer;
  }
  //we are done here return the customer
  return customer;
});
