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

const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controllers");

// Comments Require

const {
  getCommentsByArticleId,
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controllers.js");

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
app.get("/api/users/:username", getUserByUsername);

// ### COMMENTS ###

// GET

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// POST

app.post("/api/articles/:article_id/comments", postComment);

// DELETE

app.delete("/api/comments/:comment_id", deleteCommentById);

// ### HANDLE ERRORS ###

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

// EXPORTS

module.exports = app;
