const db = require("../db/connection");
const { checkExists } = require("../db/helpers/utils");

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

  await checkExists("users", "username", username);

  return result.rows[0];
};
