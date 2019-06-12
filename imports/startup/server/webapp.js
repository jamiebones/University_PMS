import { WebApp } from "meteor/webapp";

WebApp.connectHandlers.use("", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
  return next();
});
