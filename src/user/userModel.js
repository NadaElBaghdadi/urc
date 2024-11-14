const client = require('./db');

const checkUserExists = async (username, email) => {
  const result = await client.query(
    'SELECT * FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );
  return result.rows.length > 0; 
};
const saveUserToDatabase = async (user) => {
    const { username, email, password, external_id } = user;
  
    const result = await client.query(
      'INSERT INTO users (username, password, email, created_on, external_id) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
      [username, password, email, external_id]
    );
  
    return result.rows[0];
  };
  
  module.exports = { checkUserExists, saveUserToDatabase };
  
module.exports = { checkUserExists };
