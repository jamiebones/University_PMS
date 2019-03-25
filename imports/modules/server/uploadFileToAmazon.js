/* eslint-disable */
import { Meteor } from "meteor/meteor";
import fs from "fs";
import s3PublicUrl from "node-s3-public-url";
const AWS = require("aws-sdk");
const fse = require("fs-extra");

//Amazon configuration
let bucketName = Meteor.settings.private.AWS.BucketName;
AWS.config.accessKeyId = Meteor.settings.private.AWS.AWSAccessKeyId;
AWS.config.secretAccessKey = Meteor.settings.private.AWS.AWSSecretAccessKey;

const s3 = new AWS.S3({ params: { Bucket: bucketName } });

const uploadPdfFileToAmazon = (base64PdfFile, key) => {
  return new Promise((resolve, reject) => {
    try {
      //upload the pdf file to amazon
      //get the key from the
      const base64Data = new Buffer(
        base64PdfFile.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      let params = {
        Bucket: bucketName,
        Key: key,
        ContentEncoding: "base64",
        ContentType: `application/pdf`,
        Body: base64Data,
        ACL: "public-read"
      };
      s3.upload(params, (err, res) => {
        if (err) {
          reject(`[Uploadig Pdf] || ${err}`);
        } else {
          const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
          const sanitizedUrl = url.replace(key, `${s3PublicUrl(key)}`);
          //save the pdffile in a variable for use latter
          //pdfLinkSaver = pdfUrl
          resolve({ key, sanitizedUrl });
        }
      });
    } catch (exception) {
      console.log(exception);
      reject(`[ UploadPdfFile To Amazon ] || ${exception}`);
    }
  });
};
