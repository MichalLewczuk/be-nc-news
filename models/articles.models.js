const db = require("../db/connection");
const { checkExists } = require("../db/helpers/utils");
const format = require("pg-format");

//SELECT

exports.selectArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  const validSort = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (!validSort.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Not a valid sort_by query",
    });
  }
  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: "Not a valid order query",
    });
  }
  let queryStr = format(
    `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, 
  COUNT(comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`
  );
  const queryValues = [];
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order.toUpperCase()};`;

  const results = await db.query(queryStr, queryValues);

  return results.rows;
};

exports.selectArticleById = async (article_id) => {
  const result = await db.query(
    `SELECT articles.*, 
     COUNT(comment_id)::INT AS comment_count
     FROM articles
     LEFT JOIN comments
     ON articles.article_id = comments.article_id 
     WHERE articles.article_id = $1
     GROUP BY articles.article_id;`,
    [article_id]
  );
  await checkExists("articles", "article_id", article_id);

  return result.rows[0];
};

//UPDATE

exports.updateArticleById = async (article_id, newVote) => {
  const result = await db.query(
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
    [article_id, newVote]
  );

  await checkExists("articles", "article_id", article_id);

  return result.rows[0];
};
