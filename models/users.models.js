const db = require("../db/connection");

exports.selectUsers = async () => {
  const result = await db.query("SELECT * FROM users;");
  return result.rows;
};
