"use strict";

const express = require("express");
const xServe = express();

const winston = require("winston");

const helmet = require("helmet");

const path = require("path");

/* 
Template contents:
  - web server with Express
  - logging to file with Winston
  - web server security with helmet
*/

// set up helmet for web server security
xServe.use(helmet());
xServe.use(helmet.noCache()); // disable caching

// Create Logger
const logger = winston.createLogger({
  level: "debug",
  /*  logging levels in winston 
      { emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 } 
    */
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "./log/xError.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "./log/xErrorCombined.log"
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "./log/xExceptions.log"
    })
  ]
});

// If not in production then log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

// serve static files
xServe.use(
  "/HewardsHandyHaversack",
  express.static(path.join(__dirname, "public"))
);

// express routing
xServe.get("/", (req, res) => res.send("Hell World by xServe!"));

xServe.post("/", function(req, res) {
  res.send("Got a POST request");
});

xServe.put("/token", function(req, res) {
  res.send("Got a PUT request at /token");
});

xServe.delete("/token", function(req, res) {
  res.send("Got a ");
});

// web server port
const portNumber = 3333;

// Start web server
xServe.listen(portNumber, () =>
  console.log(
    "Template Express server is started and Listening on port " +
      portNumber +
      "!\nby Tre' Grisby"
  )
);

xServe.on("error", onError);

// trap server errors and report them
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  // handle certain listen errors with developer messages
  switch (error.code) {
    case "EACCES":
      console.error("Requires elevated privileges. Now exiting process.");
      process.exitCode = 1;
      break;
    case "EADDRINUSE":
      console.error("Already in use. Now exiting process.");
      process.exitCode = 1;
      break;
  }
}
