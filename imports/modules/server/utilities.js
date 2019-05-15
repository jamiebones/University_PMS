import fs from "fs";

export const getBase64String = path => {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.readFileSync(path);
      resolve(new Buffer(file).toString("base64"));
    } catch (exception) {
      reject(exception);
    }
  });
};
