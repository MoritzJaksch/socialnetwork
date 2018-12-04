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

exports.getPass = email => {
    return db.query(
        `SELECT pass, id
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.getUser = userId => {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = $1`,
        [userId]
    );
};

exports.uploadProfilePic = (userId, profilepic) => {
    return db.query(
        `UPDATE users
        SET profilepic = $2
        WHERE id = $1
        RETURNING *`,
        [userId, profilepic]
    );
};

exports.updateBio = (userId, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *`,
        [userId, bio]
    );
};
