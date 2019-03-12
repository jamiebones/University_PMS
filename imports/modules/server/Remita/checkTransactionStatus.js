"use strict";
import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import moment from "moment";
import { _ } from "meteor/underscore";
import Transactions from "../../../api/Transactions/Transactions";
import ManualPaperUpload from "../../../api/ManualPaperUpload/ManualPaperUpload";
import Journal from "../../../api/Journal/Journal";
import {
  GetEmailFromUserId,
  GetNameFromUserId,
  remitaStatusMessage,
  paymentType
} from "../serverUtilityFile.js";
import sendAdminErrorEmail from "../sendAdminErrorEmail";
import sendEmailWithDownLoadLinks from "../sendDownLoadBookLinkToBuyer";

const __sendReceiptMail = (Transaction, status) => {
  if (!_.isEmpty(Transaction)) {
    const journalId = Transaction.journalId;
    let mailObject = {
      to: GetEmailFromUserId(Transaction.payerId),
      payerName: GetNameFromUserId(Transaction.payerId),
      date:
        moment(Transaction.date).format("MMMM Do, YYYY") ||
        moment(new Date().toISOString()).format("MMMM Do, YYYY"),
      paymentTo: Transaction.paymentTo,
      paymentFor: paymentType(Transaction.paymentType),
      transactionId: Transaction.transactionId,
      amount: Transaction.amount,
      total: Transaction.amount,
      rrr: Transaction.RRR,
      status: remitaStatusMessage(status)
    };
    if (journalId) {
      //payment was for either pub or review;
      //get the journal to find the journal name
      const journal = Journal.findOne(journalId);
      const journalName = journal.journalName || "";
      mailObject.journalName = journalName;
    } else {
      mailObject.journalName = "Erudite Scholars";
    }
    try {
      sendEmailNotification("sendPaymentReceipt", mailObject);
    } catch (error) {
      logger.log("error", `Error sending receipt to user || ${error}`);
      const options = {
        messageId: "sendReceiptMail on Transaction Methods",
        exception: error
      };
      sendAdminErrorEmail(options);
      throw new Meteor.Error(error);
    }
  }
};

export const UpdateTransaction = (transaction, response) => {
  //we have an empty transaction object here
  const { orderId, status } = response.data;
  if (_.isEmpty(transaction)) {
    return null;
  }
  //check if transactions has been recorded as successfully before
  if (transaction.successful === true) {
    return response;
  }
  //we have a successful transaction at remita end
  //we need to send a receipt to the user
  if ((transaction.successful === false && status == "00") || status == "01") {
    //send the email here with details
    __sendReceiptMail(transaction, status);
    logger.log("info", "payment receipt was sent");
  }

  if (status == "00" || status == "01") {
    //payment was successful here
    const paymentType = transaction.paymentType;
    let paperId;
    let obj;
    switch (paymentType) {
      //payment for a new journal hosting.
      case "03":
        //update the journal active properties
        const journalId = transaction.journalId;
        Journal.update(journalId, { $set: { active: true, approved: true } });
        break;
      case "01":
        //this is a payment for journal review
        paperId = transaction.paperId;
        //check if the payment was for review or Publication 01 is
        obj = { transId: orderId, paymentFor: "01" };
        //update the paper set the status to payment made
        Papers.update(paperId, {
          $set: { reviewFeePaid: true },
          $addToSet: { transactions: obj }
        });

        break;
      case "02":
        paperId = transaction.paperId;
        obj = { transId: orderId, paymentFor: "02" };
        //this is a payment for publication
        Papers.update(paperId, {
          $set: { publishFeePaid: true },
          $addToSet: { transactions: obj }
        });
        break;
      case "04":
        sendEmailWithDownLoadLinks(orderId);
        break;
      case "05":
        //manual upload of papers and payment by journal owner
        //we are using paperId as the Id of the manual upload
        //so we can use it to update the manualUpload document
        paperId = transaction.paperId;
        const manualUploadId = paperId;
        ManualPaperUpload.update(
          { _id: manualUploadId, "transaction.transactionId": orderId },
          { $set: { "transaction.$.paid": true } }
        );

        break;
    }
    Transactions.update(
      { transactionId: orderId },
      { $set: { successful: true, transactionStatus: status } }
    );
    return response;
  } else {
    //payment failed here for what ever reason
    //we return the response so that the client can deal with it
    return response;
  }
};
