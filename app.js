// ## REQUIRE ##

const express = require("express");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./error-handlers/index.js");

// Topics Require

const { getTopics } = require("./controllers/topics.controllers");

// Articles Require

const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/articles.controllers");

// Users Require

const { getUsers } = require("./controllers/users.controllers");

// APP

const app = express();

app.use(express.json());

// @ ENDPOINTS @

// ### TOPICS ###

// GET

app.get("/api/topics", getTopics);

// ### ARTICLES ###

// GET

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

// PATCH

app.patch("/api/articles/:article_id", patchArticleById);

// ### USERS ###

// GET

app.get("/api/users", getUsers);

// ### HANDLE ERRORS ###

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

// EXPORTS

module.exports = app;
