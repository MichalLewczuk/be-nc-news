const db = require("../db/connection");

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
