import { Meteor } from "meteor/meteor";
import { SharingFormular } from "./sharingFormular";
import CryptoJS from "crypto-js";

const _generateHash = msg => {
  try {
    const messageHash = CryptoJS.SHA512(msg).toString();
    return messageHash;
  } catch (exception) {
    throw new Error(`[Hash Generator] ${exception}`);
  }
};

const ProcessRemitaData = options => {
  return new Promise((resolve, reject) => {
    try {
      let { transactionId, total, email, name } = options;
      const merchantId = Meteor.settings.private.Remita.MerchantId;
      const api_key = Meteor.settings.private.Remita.Api_Key;
      const serviceType = Meteor.settings.private.Remita.ServiceTypeId;
      const url = Meteor.settings.private.Remita.ResponseUrl;
      const returnUrl = Meteor.absoluteUrl(`${url}`);
      const hash = _generateHash(
        merchantId + serviceType + transactionId + total + returnUrl + api_key
      );

      let data = {};
      data.merchantId = merchantId;
      data.serviceTypeId = serviceType;
      data.totalAmount = total;
      data.hash = hash;
      data.orderId = transactionId;
      data.responseurl = returnUrl;
      data.payerName = name;
      data.payerEmail = email;
      //this is where we share the money.
      data.lineItems = SharingFormular(total);
      if (Meteor.isDevelopment) {
        //code that only run during development
        let total1 = 0.5 * parseFloat(total).toString();
        let total2 = 0.5 * parseFloat(total).toString();
        data.lineItems = [
          {
            lineItemsId: "itemid1",
            beneficiaryName: "Oshadami Mike",
            beneficiaryAccount: "0360883515",
            bankCode: "057",
            beneficiaryAmount: `${total1}`,
            deductFeeFrom: "1"
          },
          {
            lineItemsId: "itemid2",
            beneficiaryName: "Ogunseye Mujib",
            beneficiaryAccount: "4017904612",
            bankCode: "044",
            beneficiaryAmount: `${total2}`,
            deductFeeFrom: "0"
          }
        ];
      }
      resolve(data);
    } catch (exception) {
      reject(`[Getting Data From Options] ${exception}`);
    }
  });
};

export default ProcessRemitaData;
