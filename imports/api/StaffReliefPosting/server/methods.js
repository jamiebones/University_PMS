import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaffReliefPostings } from "../StaffReliefPostingClass";
import { _ } from "meteor/underscore";
import PrintPostings from "../../../modules/server/printreliefpdf";
import moment from "moment";

Meteor.methods({
  "staffreliefposting.getApprovedPosting": function StaffPostingmethod() {
    const today = moment(new Date()).toISOString();
    const relief = StaffReliefPostings.find({
      status: "approved",
      reliefEnd: {
        $gte: today
      }
    }).fetch();
    return relief;
  },
  "staffreliefposting.printpdflist": function StaffPostingmethod(postings) {
    check(postings, Array);
    return PrintPostings(postings)
      .then(html => {
        return html;
      })
      .catch(e => {
        console.log(e);
      });
  }
});
