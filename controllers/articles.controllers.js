const {
  selectArticleById,
  updateArticleById,
} = require("../../be-nc-news/models/articles.models");

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticleById(article_id);

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    if (
      Object.keys(req.body).length !== 1 ||
      "inc_votes" in req.body === false
    ) {
      throw {
        status: 400,
        msg: `Invalid request body`,
      };
    }
    const newVote = req.body.inc_votes;

    const article = await updateArticleById(article_id, newVote);

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
