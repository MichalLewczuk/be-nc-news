const db = require("../db/connection");
const { checkExists } = require("../db/helpers/checkExists");

// SELECT

exports.selectCommentsByArticleId = async (article_id) => {
  const result = await db.query(
    `SELECT comments.comment_id, comments.body, comments.votes, comments.author, comments.created_at 
       FROM comments
       JOIN articles
       ON articles.article_id = comments.article_id 
       WHERE articles.article_id = $1`,
    [article_id]
  );

  return result.rows;
};

// INSERT

exports.insertComment = async (article_id, username, body) => {
  const result = await db.query(
    "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
    [article_id, username, body]
  );

  return result.rows[0];
};

// REMOVE

exports.removeCommentById = async (comment_id) => {
  const result = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
    [comment_id]
  );

  return result.rows[0];
};
