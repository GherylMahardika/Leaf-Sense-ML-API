const mysql = require('mysql2/promise');

async function connectToDatabase() {
    const connection = await mysql.createConnection({
      host: '34.101.195.218', // Cloud SQL host
      user: 'leaf-sense-db', // Cloud SQL username
      password: 'n%c?3js9:fQU?udZ', // Cloud SQL password
      database: 'LeafSenseDB', // Database name
    });
    return connection;
}

module.exports = { connectToDatabase };