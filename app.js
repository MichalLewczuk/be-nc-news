const express = require("express");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./error-handlers/index.js");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controllers");

app.get("/api/topics", getTopics);

//handle errors

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
