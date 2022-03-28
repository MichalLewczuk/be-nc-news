const db = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  const result = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
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