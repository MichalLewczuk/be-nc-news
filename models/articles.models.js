const db = require("../db/connection");

//SELECT

exports.selectArticles = async () => {
  const result = await db.query(`SELECT articles.*, 
    COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`);
  return result.rows;
};

exports.selectArticleById = async (article_id) => {
  const result = await db.query(
    `SELECT articles.*, 
     COUNT(comment_id) AS comment_count
     FROM articles
     LEFT JOIN comments
     ON articles.article_id = comments.article_id 
     WHERE articles.article_id = $1
     GROUP BY articles.article_id;`,
    [article_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article with id ${article_id} found in the database`,
    });
  }

  return result.rows[0];
};

//UPDATE

exports.updateArticleById = async (article_id, newVote) => {
  const result = await db.query(
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
    [article_id, newVote]
  );

  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article with id ${article_id} found in the database`,
    });
  }

  return result.rows[0];
};
