const { selectTopics } = require("../../be-nc-news/models/topics.models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    res.status(200).send({ topics });
  } catch (next) {}
};