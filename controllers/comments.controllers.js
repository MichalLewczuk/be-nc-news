const { checkExists } = require("../db/helpers/checkExists");
const {
  selectCommentsByArticleId,
  insertComment,
} = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.models");
const { selectUserByUsername } = require("../models/users.models");

// GET

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;

    const promises = [
      selectCommentsByArticleId(article_id),
      checkExists("articles", "article_id", article_id),
    ];

    const results = await Promise.all(promises);
    const comments = results[0];

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

// POST

exports.postComment = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { username, body } = req.body;
    if (
      Object.keys(req.body).length !== 2 ||
      "username" in req.body === false ||
      "body" in req.body === false
    ) {
      throw {
        status: 400,
        msg: `Invalid request body`,
      };
    }

    const promises = [
      checkExists("articles", "article_id", article_id),
      checkExists("users", "username", username),
      insertComment(article_id, username, body),
    ];

    const results = await Promise.all(promises);
    const comment = results[2];

    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
