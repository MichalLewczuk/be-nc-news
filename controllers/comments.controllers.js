const { selectCommentsByArticleId } = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;

    const promises = [
      selectCommentsByArticleId(article_id),
      selectArticleById(article_id),
    ];

    const results = await Promise.all(promises);
    const comments = results[0];

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
