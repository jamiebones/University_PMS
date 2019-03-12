
if (Meteor.isServer) {
    import winston from "winston";
    
        let console = new winston.transports.Console({
            name: "console",
            timestamp: true
        });
    
        export const logger = new winston.Logger({
            transports: [
                console,
                new winston.transports.File({filename: 'application.log'}),
            ]
        });
   
   //export const logger = winston.createLogger({
     //   transports: [
     //     new winston.transports.Console(),
     //     new winston.transports.File({filename: 'application.log'}),
    //    ]
    //  });
   }

   else{
    //export const logger = {
     //   info: console.log,
     //   warn: console.log,
     //   error: console.log
    //};
   }