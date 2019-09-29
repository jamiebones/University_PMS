import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import Documents from "../Documents";
import moment from "moment";

Meteor.methods({
  "documents.getDocViaRef": function DocumentsMethod(reference) {
    check(reference, String);
    const doc = Documents.find(
      { "meta.reference": reference },
      { sort: { serial: 1 } }
    ).fetch();
    //spit out the link
    let documentArray = [];
    doc.map(aFile => {
      let link = Documents.findOne({ _id: aFile._id }).link();
      documentArray.push(link);
    });
    return documentArray;
  },
  "documents.getDocByUnitAndDocumentType": function DocumentsMethod(meta) {
    check(meta, Object);
    const { unit, documentType } = meta;
    let doc;
    if (documentType === "all") {
      //show all documents in unit
      doc = Documents.find(
        { "meta.unit": unit },
        { sort: { serial: 1 } }
      ).fetch();
    } else {
      doc = Documents.find(
        { "meta.unit": unit, "meta.documentType": documentType },
        { sort: { serial: 1 } }
      ).fetch();
    }

    //spit out the link
    let documentArray = [];
    doc.map(aFile => {
      let link = Documents.findOne({ _id: aFile._id }).link();
      documentArray.push(link);
    });
    console.log(documentArray);
    return documentArray;
  }
});
