import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {
  UniversityCadre,
  Ranks
} from "../../api/UniversityCadre/UniversityCadreClass";
import { _ } from "meteor/underscore";
import { FindMax } from "../../modules/utilities";
import moment from "moment";

Meteor.methods({
  "universityCadre.saveCadreName": function UniversityCadremethod(
    rank,
    cadreName
  ) {
    check(rank, String);
    check(cadreName, String);
    const newCadre = new UniversityCadre();
    newCadre.serial = parseInt(rank);
    newCadre.cadre = cadreName;

    //find all cadres
    const cadres = UniversityCadre.find().fetch();
    if (cadres.length) {
      //check if we have a rank with the one
      //coming in
      let cadreName;
      const findRank = cadres.find(cadre => {
        cadreName = cadre.cadre;
        return cadre.serial === parseInt(rank);
      });
      if (findRank) {
        throw new Meteor.Error(`${cadreName} already has a serial of ${rank}`);
      } else {
        //we can save here
        return newCadre.save();
      }
    } else {
      return newCadre.save();
    }
  },
  "universityCadre.saveDesignation": function UniversityCadremethod(
    serial,
    designation,
    designationRank
  ) {
    check(serial, Number);
    check(designation, String);
    check(designationRank, String);
    const newRank = new Ranks();
    newRank.rankName = designation;
    const findCadre = UniversityCadre.findOne({ serial });
    const findSerial = findCadre.ranks.find(des => {
      return des.serial === designationRank;
    });
    if (findSerial) {
      throw new Meteor.Error(`Designation already has a rank of ${serial}`);
    }
    newRank.serial = parseInt(designationRank);
    findCadre.ranks.push(newRank);
    findCadre.save();
    //find all cadres
  }
});
