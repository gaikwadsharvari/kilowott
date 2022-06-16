var knex = require("knex")({
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "postgres",
      database: "kilowott",
      port: 5432,
      charset: "utf8",
    },
    pool: {
      afterCreate: function (connection, callback) {
        connection.query('SET timezone = "Asia/Kolkata";', function (err) {
          callback(err, connection);
        });
      },
    },
  });
  
  var bookshelf = require("bookshelf")(knex);
  
  module.exports = bookshelf;
  