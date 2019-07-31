//import { logger } from "../../Logger/Logger.js";
//import errormodule from "./errormodule";
import getPrivateFile from "./get-private-file";
import templateToText from "./handlebars-email-to-text";
import templateToHTML from "./handlebars-email-to-html";

export const compileHtmlTemplate = (template, templateVars) => {
  return new Promise((resolve, reject) => {
    try {
      const text = templateToText(
        getPrivateFile(`email-templates/${template}.txt`),
        templateVars || {}
      );
      const html = templateToHTML(
        getPrivateFile(`email-templates/${template}.html`),
        templateVars || {}
      );
      resolve({ text, html });
    } catch (exception) {
      reject(`[ Compiling template ] || ${exception}`);
    }
  });
};
