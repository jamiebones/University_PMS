/*eslint-disable*/
import { Meteor } from "meteor/meteor";

export const SharingFormular = amount => {
  let accountName = Meteor.settings.private.EruditeBankAccount.accountName;
  let accountNumber = Meteor.settings.private.EruditeBankAccount.accountNumber;
  let bankCode = Meteor.settings.private.EruditeBankAccount.bankCode;
  const books_waresAmount = parseFloat(amount).toString();

  const paymentBeneficiary = {
    lineItemsId: "itemid1",
    beneficiaryName: `${accountName}`,
    beneficiaryAccount: `${accountNumber}`,
    bankCode: `${bankCode}`,
    beneficiaryAmount: `${books_waresAmount}`,
    deductFeeFrom: "0"
  };
  return [paymentBeneficiary];
};
