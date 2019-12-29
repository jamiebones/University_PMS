import fs from "fs";

const GetBase64String = path => {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.readFileSync(path);

      resolve(new Buffer(file).toString("base64"));
    } catch (exception) {
      reject(`[Get Base64 String] || ${exception}`);
    }
  });
};

export { GetBase64String };
