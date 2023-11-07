const knex = require("knex")({
  client: process.env.CLIENT,
  connection: {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
});

module.exports = knex;
