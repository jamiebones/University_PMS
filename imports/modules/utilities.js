import { Meteor } from "meteor/meteor";
import { _ } from "meteor/underscore";
import moment from "moment";
import * as XLSX from "xlsx";
import { Roles } from "meteor/alanning:roles";

export const FindMax = (arr, key) => {
  if (arr.length) {
    let highest = 0;
    for (let i = 0; i < arr.length; i++) {
      let currentItem = arr[i][key];
      if (currentItem > highest) {
        highest = currentItem;
      }
    }
    return highest;
  }
  return 0;
};

export const FindMin = (arr, key) => {
  if (arr.length) {
    let lowest = 1;
    for (let i = 0; i < arr.length; i++) {
      let currentItem = arr[i][key];
      if (currentItem < lowest) {
        lowest = currentItem;
      }
    }
    return lowest;
  }
  return 1;
};

export const FilterSuccesfulPosting = arr => {
  if (arr.length) {
    let filteredArray = arr.filter(posting => {
      return posting.postingStatus == "4";
    });
    return filteredArray;
  }
};

export const FindPostingSuccessful = obj => {
  if (obj.postingStatus == "4") {
    return obj.postingDate;
  }
  return {};
};

export const StaffPostingStatusMessage = () => {
  const statusMessage = [
    "",
    "Posting Proposed",
    "Posting approved by the Director",
    "Posting rejected by the Director",
    "Posting approved by the Registrar",
    "Posting cancelled by the Registrar",
    "Posting cancelled"
  ];
  return statusMessage;
};

export const FindDeptPostingProposedTo = (postings = []) => {
  const proposedPosting = postings.find(posting => {
    return posting.postingStatus == "1";
  });
  if (!_.isEmpty(proposedPosting)) {
    return proposedPosting.unitName;
  }
  return "";
};

export const StaffType = type => {
  const staffType = ["", "Teaching Staff", "Non-Teaching Staff"];
  return staffType[parseInt(type)];
};

export const SortPostingDuration = pArray => {
  if (pArray.length) {
    let arr = pArray.sort((a, b) => {
      return a.serial - b.serial;
    });

    let newArr = arr.slice(0, arr.length - 1);
    let postingArray = [];
    for (let i = 0; i < newArr.length; i++) {
      const posting = newArr[i];
      if (posting.postingStatus == "4") {
        const startDate = posting.postingDate;
        let endDate = moment(new Date()).toISOString();
        if (i + 1 !== newArr.length) {
          endDate = newArr[i + 1].postingDate;
        }
        const duration = FindTimeDifference(startDate, endDate);
        const obj = {
          unit: posting.unitName,
          duration
        };
        postingArray.push(obj);
      }
      continue;
    }
    console.log(postingArray.reverse());
    return postingArray.reverse();
  }
  return [];
};

export const FindTimeDifference = (startTime, endTime) => {
  let start = moment(endTime);
  let end = moment(startTime);
  //Difference in number of days
  const diffDuration = moment.duration(start.diff(end));
  let years = diffDuration.years();
  let months = diffDuration.months();
  let days = diffDuration.days();
  years = years ? `${years} year(s)` : "";
  months = months ? `${months} month(s)` : "";
  days = days ? `${days} day(s)` : "";
  return `${years} ${months} ${days}`;
};

export const Capitalize = word => {
  if (word) {
    return word.toUpperCase();
  }
  return null;
};

export const GetNameFromUserId = userId => {
  const user = Meteor.users.findOne({ _id: userId });
  if (!_.isEmpty(user)) {
    return `${user.profile.name.first} ${user.profile.name.last}`;
  }
};

export const GetNameDetailsObjectFromId = () => {
  const user = Meteor.user();
  return {
    title: (user && user.profile.title) || "",
    firstname: user && user.profile.name.first,
    surname: user && user.profile.name.last,
    rank: 1
  };
};

export const GetEmailFromUserId = userId => {
  const user = Meteor.users.find(userId).fetch();
  if (user.length > 0) {
    return ` ${user[0].emails[0].address}`;
  }
};

export const SetTransactionId = () => {
  const date = new Date();
  const alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  let text = "";
  const components = [
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];
  for (let i = 0; i < 2; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  const id = components.join("");
  return id + text;
};

export const sumMeUp = (firstitem, seconditem) => {
  let sum = parseFloat(firstitem) + parseFloat(seconditem);
  return sum;
};

export const subtractMe = (firstitem, seconditem) => {
  let value = parseFloat(seconditem) - parseFloat(firstitem);
  return value;
};

export const IncludeDots = (time = "") => {
  let timeString = time.split("");
  let joinWords = "";
  for (let i = 0; i < timeString.length; i++) {
    if (i == 2) {
      joinWords += ":" + timeString[i];
    } else if (i == 4) {
      joinWords += ":" + timeString[i];
    } else {
      joinWords += timeString[i];
    }
  }
  return joinWords;
};

export const Title = () => {
  const title = [
    "Mr",
    "Mrs",
    "Dr",
    "Dr(Mrs)",
    "Engr",
    "Engr(Mrs)",
    "Prof",
    "Arch"
  ];
  return title;
};

export const capFirstLetter = word => {
  if (typeof word == "string") {
    const first = word.charAt(0).toUpperCase();
    const rest = word.slice(1);
    return first + rest;
  }
};

export const capAllFirstLetter = word => {
  if (typeof word == "string") {
    const arr = word.split(" ");
    let capWord = "";
    for (let i = 0; i < arr.length; i++) {
      let firstWord = arr[i];
      firstWord = firstWord.charAt(0).toUpperCase();
      let remainWord = arr[i].slice(1).toLowerCase();
      capWord += firstWord + remainWord + " ";
    }
    return capWord.trim();
  }
};

export const GetAllUserRoles = userId => {
  return Roles.getRolesForUser(userId);
};

export const validateEmail = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

export const CompareValues = (key, order = "asc") => {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order == "desc" ? comparison * -1 : comparison;
  };
};

export const RemoveSpaces = word => {
  if (word) {
    let replaceSpace = word
      .replace(/ /g, "_")
      .replace(/\(/g, "")
      .replace(/\)/g, "");
    return replaceSpace;
  }
};

export const ReplaceSpace = word => {
  if (word) {
    let replaceWord = word.replace(/_/g, " ");
    return replaceWord;
  }
};

export const setInputHeight = (defaultHeight, element) => {
  if (element) {
    // Support passing an event and a raw element from refs;
    const target = element.target ? element.target : element;
    target.style.height = `${defaultHeight}px`;
    target.style.height = `${target.scrollHeight}px`;
  }
};

export const StripHtml = html => {
  if (Meteor.isClient) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
};

export const RemoveSlash = word => {
  if (word) {
    const regex = new RegExp("/", "g");
    word = word.replace(regex, "-");
    return word;
  }
};

export const ReplaceSlash = word => {
  if (word) {
    const regex = new RegExp("-", "g");
    word = word.replace(regex, "/");
    return word;
  }
};

export const SheetToArray = sheet => {
  var result = [];
  var row;
  var rowNum;
  var colNum;
  var range = XLSX.utils.decode_range(sheet["!ref"]);
  for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    row = [];
    for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
      var nextCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
      if (typeof nextCell === "undefined") {
        row.push(void 0);
      } else row.push(nextCell.w);
    }
    result.push(row);
  }
  return result;
};

export const SortArrayByKey = (array, key) => {
  if (array.length) {
    const sortArray = array.sort((a, b) => {
      return a[key] - b[key];
    });
    return sortArray;
  }
  return [];
};

export const GetDetailsBasedOnRole = (role, group) => {
  if (Roles.userIsInRole(Meteor.userId(), role, group)) {
    return true;
  }
  return false;
};

export const GetRealTimeStatus = (difference, postings) => {
  if (difference) {
    let lastPosting = FindMax(FilterSuccesfulPosting(postings), "serial");
    let unitFrom = null;
    let postedTo = null;

    if (lastPosting) {
      if (postings[lastPosting - 1].postingStatus === "4") {
        const post = postings[lastPosting - 1];
        unitFrom = post.unitFrom;
        postedTo = post.unitName;
      }
    }

    if (difference.includes("-")) {
      //if we have minus in the difference
      //it means staff have not resumed
      return `Still at ${unitFrom} but resuming at ${postedTo} in
      ${difference.replace("-", "")} time`;
    } else {
      //here the posting difference is not negative
      //we either have a new posting
      if (unitFrom === "first") {
        //this is the first posting saved in the system
        return `${postedTo} : ${difference}`;
      }
      return `Time spent : ${difference}`;
    }
  } else {
    return;
  }
};

export const CheckForNegativeDate = difference => {
  if (difference.includes("-")) {
    return true;
  }
  return false;
};

export const FormatSalaryStructure = structure => {
  if (structure) {
    const structureArray = Array.from(structure);
    //build the string
    let string = null;
    if (structureArray[0] != "0") {
      string += structureArray[0];
    }
    string += structureArray[1];
    string += "/";
    string += structureArray[2];

    if (structureArray[2] != "0") {
      string += structureArray[2];
    }
    string += structureArray[3];

    return string;
  }
};

export const TeachingStaff = () => {
  const AcademicStaff = [
    "Graduate Assistant",
    "Assistant Lecturer",
    "Lecturer 11",
    "Senior Lecturer",
    "Associate Professor",
    "Professor",
    "Graduate Library Assistant",
    "Assistant Librarian",
    "Librarian 11",
    "Librarian 1",
    "Senior Librarian",
    "Deputy University Librarian",
    "University Librarian"
  ];
  return AcademicStaff;
};

export const SplitFacultyAndDept = faculty => {
  if (faculty) {
    const facArray = faculty.split("/");
    return facArray.length == 2 ? facArray[1] : facArray[0];
  }
  return;
};

export const StripRolesFromGroup = roles => {
  let para = "<p>";
  //assumption is made everybody will be in just one group
  for (group in roles) {
    const rolesArray = roles[group].length;
    para +=
      group === "__global_roles__"
        ? ""
        : rolesArray
        ? `<span className="text-info"><b>${capAllFirstLetter(
            group
          )}</b> &nbsp:</span>`
        : "";

    for (let i = 0; i < rolesArray; i++) {
      if (group == "__global_roles__") {
        para += "Super Admin";
      } else {
        para += `&nbsp; ${capAllFirstLetter(roles[group][i])}`;
      }

      if (i !== rolesArray - 1) {
        para += "&nbsp; || &nbsp;";
      }
    }
    para += "<br/>";
  }
  para += "</p>";
  return para;
};

export const compareValues = (key, order = "asc") => {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order == "desc" ? comparison * -1 : comparison;
  };
};

export const SortDirection = {
  ASC: "ASC",
  DESC: "DESC"
};

export const StaffEmploymentType = staff => {
  if (staff == undefined || staff == "") return;
  if (staff.toUpperCase() == "ACTIVE") {
    return "Pensionable";
  } else if (staff.toUpperCase() == "CONTRACT") {
    return "Contract";
  } else {
    return staff;
  }
};

export const RemoveStupidNairaSign = amount => {
  if (amount) {
    const removeSign = amount.replace("#", "");
    return removeSign;
  }
};

export const SplitFacultDept = faculty => {
  if (faculty) {
    const split = faculty.split("/");
    return {
      faculty: split[0],
      dept: split[1]
    };
  }
};

export const SortArray = array => {
  array.sort(function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  return array;
};

export const SortArrayOfObjects = (array, key) => {
  array.sort(function(x, y) {
    if (parseInt(x[key]) < parseInt(y[key])) {
      return -1;
    }
    if (parseInt(x[key]) > parseInt(y[key])) {
      return 1;
    }
    return 0;
  });
  return array;
};

export const ReturnArrayOfDesignation = array => {
  if (array == undefined) return [];
  let allDesignationArray = [];
  array.map(obj => {
    allDesignationArray.push(obj.cadreRank);
  });
  return allDesignationArray;
};

export const findNextRankAndLevel = (rank, designationArray) => {
  const found = false;
  for (i = 0; i < designationArray.length; i++) {
    const cadres = designationArray[i];
    for (j = 0; j < cadres.length; j++) {
      const obj = cadres[j];
      if (rank.toLowerCase() === obj.rank.toLowerCase()) {
        //we have found the rank here
        return {
          nextRank: cadres[j + 1] && cadres[j + 1].rank,
          nextLevel: cadres[j + 1] && cadres[j + 1].level
        };
      }
    }
    if (found) {
      break;
    }
  }
  return null;
};

export const AddSlashToPhoneNumber = phoneNumber => {
  let number = "";
  for (let i = 0; i < phoneNumber.length; i++) {
    if (i === 3) {
      number += `-${phoneNumber[i]}`;
    } else if (i === 7) {
      number += `-${phoneNumber[i]}`;
    } else {
      number += phoneNumber[i];
    }
  }
  return number;
};

export const GetRealValue = key => {
  let obj = {
    S: "single",
    M: "married",
    D: "divorced",
    W: "widow",
    W: "widower",
    "1": "Teaching staff",
    "2": "Non Teaching staff",
    active: "pensionable"
  };
  return obj[key] || key;
};

export const SearchArray = (element, array, key) => {
  let len = array.length,
    str = element.toString().toLowerCase();
  for (let i = 0; i < len; i++) {
    if (key) {
      if (array[i][key].toLowerCase() == str) {
        return i;
      }
    } else {
      if (array[i].toLowerCase() == str) {
        return i;
      }
    }
  }
  return -1;
};

export const DocumentTypes = () => {
  const documentArray = [
    { value: "MIN", data: "Minutes" },
    { value: "APC", data: "A&PC" },
    { value: "RTC", data: "Report to Council" },
    { value: "PL", data: "Promotion Letters" },
    { value: "all", data: "All Documents" }
  ];
  return documentArray;
};

export const RemoveFirstZero = scale => {
  if (scale && scale[0] === "0") {
    const modifiedScale = scale[1];
    return modifiedScale;
  } else {
    return scale;
  }
};

export const EmploymentStatus = () => {
  const statusObject = {
    "1": "active",
    "2": "retired",
    "3": "dismissal",
    "4": "appointment terminated",
    "5": "contract",
    "6": "sabbatical",
    "7": "leave of absence",
    "8": "visiting scholar",
    "9": "adjunt",
    "10": "absconded",
    "11": "special leave",
    "12": "on suspension"
  };

  return statusObject;
};

export const InsertDashInPhoneNumber = number => {
  if (number) {
    let modifiedNumber = number.trim();
    let numArray = modifiedNumber.split("");
    let returnNum = "";
    for (let i = 0; i < numArray.length; i++) {
      if (i == 3) {
        returnNum += `-${numArray[i]}`;
      } else if (i == 7) {
        returnNum += `-${numArray[i]}`;
      } else {
        returnNum += numArray[i];
      }
    }
    return returnNum;
  }
};

export const SortStaffDataBySalaryStructure = (staffArray = []) => {
  if (staffArray && staffArray.length) {
    let modifiedArray = staffArray.map(staff => {
      if (staff.salaryStructure.includes("CONUASS")) {
        //lets split the salary structure by space and also by /
        const salary = staff.salaryStructure;
        let salaryArray = salary.split(" ");
        let modified = salaryArray && salaryArray[1].split("/");
        //check if we have a number
        if (
          typeof parseInt(modified[0]) == "number" &&
          typeof parseInt(modified[1] == "number")
        ) {
          //we have a number here
          staff.rank =
            3000 + parseInt(modified[0]) * 10 + parseInt(modified[1]);
        }
      } else if (staff.salaryStructure.includes("CONMESS")) {
        //lets split the salary structure by space and also by /
        const salary = staff.salaryStructure;
        let salaryArray = salary.split(" ");
        let modified = salaryArray && salaryArray[1].split("/");
        //check if we have a number
        if (
          typeof parseInt(modified[0]) == "number" &&
          typeof parseInt(modified[1] == "number")
        ) {
          //we have a number here
          staff.rank =
            2000 + parseInt(modified[0]) * 10 + parseInt(modified[1]);
        }
      } else if (staff.salaryStructure.includes("CONTISS")) {
        //lets split the salary structure by space and also by /
        const salary = staff.salaryStructure;
        let salaryArray = salary.split(" ");
        let modified = salaryArray && salaryArray[1].split("/");
        //check if we have a number
        if (
          typeof parseInt(modified[0]) == "number" &&
          typeof parseInt(modified[1] == "number")
        ) {
          //we have a number here
          staff.rank =
            1000 + parseInt(modified[0]) * 10 + parseInt(modified[1]);
        }
      }

      return staff;
    });

    let sortedArray = modifiedArray.sort(__SortArray);
    return sortedArray;
  }
};

const __SortArray = (a, b) => {
  if (parseInt(a.rank) > parseInt(b.rank)) {
    return -1;
  } else if (parseInt(a.rank) < parseInt(b.rank)) {
    return 1;
  }
  return 0;
};

export const StaffDocumentsTypes = () => {
  return [
    { text: "Query letter", value: "query" },
    { text: "Warning letters", value: "warning" },
    { text: "Promotion letters", value: "promotion" },
    { text: "Bulk Upload", value: "bulk" },
    { text: "Leaves letters", value: "leave" }
  ];
};
