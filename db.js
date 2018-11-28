var spicedPg = require("spiced-pg");

if (!process.env.DATABASE_URL) {
    var secret = require("./secrets.json");
}

var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${secret.dbUser}:${secret.dbPass}@localhost:5432/social`
);

exports.createUsers = (first, last, email, pass) => {
    return db.query(
        `INSERT INTO users (first, last, email, pass)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first || null, last || null, email || null, pass || null]
    );
};
