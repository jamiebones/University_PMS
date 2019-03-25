import s3PublicUrl from "node-s3-public-url";
import { Meteor } from "meteor/meteor";
import AWS from "aws-sdk";

AWS.config = new AWS.Config();
let bucketName = Meteor.settings.private.AWS.BucketName;

AWS.config.accessKeyId = Meteor.settings.private.AWS.AWSAccessKeyId;
AWS.config.secretAccessKey = Meteor.settings.private.AWS.AWSSecretAccessKey;

const s3 = new AWS.S3();

export default {
  deleteFile(paper, callback) {
    const sanitizedFileName = s3PublicUrl(paper.fileName);
    const sanitizedUrl = paper.url.replace(sanitizedFileName, paper.fileName);

    s3.deleteObject(
      {
        Bucket: Meteor.settings.private.AWS.BucketName,
        Key: sanitizedUrl.replace(`https://${bucketName}.s3.amazonaws.com/`, "")
      },
      Meteor.bindEnvironment(error => {
        if (error) console.warn(error);
        if (!error && callback) callback(paper.url);
      })
    );
  }
};
