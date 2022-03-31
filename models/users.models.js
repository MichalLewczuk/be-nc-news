const db = require("../db/connection");

// SELECT

exports.selectUsers = async () => {
  const result = await db.query("SELECT username FROM users;");
  return result.rows;
};

exports.selectUserByUsername = async (username) => {
  const result = await db.query(
    `SELECT * 
     FROM users
     WHERE username LIKE $1;`,
    [username]
  );
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `Username ${username} not found in the database`,
    });
  }

  return result.rows[0];
};
