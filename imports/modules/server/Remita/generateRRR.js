/* eslint-disable */
import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { Random } from "meteor/random";

const GenerateRRR = data => {
  return new Promise((resolve, reject) => {
    const gateway = Meteor.settings.private.Remita.Gateway;
    if (Meteor.isProduction) {
      HTTP.post(
        gateway,
        {
          data: data,
          headers: {
            "Content-Type": "application/json"
          }
        },
        function(error, response) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    } else {
      //we dey development i just need to return an RRR and an orderID
      //lets stringify this shit
      const response = {};
      response.content = {
        orderID: data.orderId,
        RRR: Random.id(6),
        statuscode: "025"
      };
      const result = JSON.stringify(response.content);
      response.content = result;
      resolve(response);
    }
  });
};

export default GenerateRRR;
