module.exports = {
  "type": "mysql",
  "host": process.env.RDS_HOSTNAME,
  "port": process.env.RDS_PORT,
  "username": process.env.RDS_USERNAME,
  "password": process.env.RDS_PASSWORD,
  "database": process.env.RDS_DB_NAME,
  "connectTimeout": 100000,
  "synchronize": true,
  "logging": false,
  "entities": [
      "src/models/*.ts"
  ],
};