import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import Documents from "../Documents";
import moment from "moment";

Meteor.methods({
  "documents.getDocViaRef": function DocumentsMethod(reference) {
    check(reference, String);
    const doc = Documents.find({ "meta.reference": reference }).fetch();
    //spit out the link
    let documentArray = [];
    doc.map(aFile => {
      let link = Documents.findOne({ _id: aFile._id }).link();
      documentArray.push(link);
    });
    return documentArray;
  }
});
