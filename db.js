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

exports.checkFriendship = (senderId, receiverId) => {
    return db.query(
        `SELECT * FROM friends
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [senderId, receiverId]
    );
};

exports.sendFriendrequest = (senderId, receiverId) => {
    return db.query(
        `INSERT INTO friends (sender_id, receiver_id)
        VALUES ($1, $2) RETURNING *`,
        [senderId, receiverId]
    );
};

exports.cancelFriendrequest = (senderId, receiverId) => {
    return db.query(
        `DELETE FROM friends
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1) RETURNING *`,
        [senderId, receiverId]
    );
};

exports.acceptFriendrequest = (senderId, receiverId) => {
    return db.query(
        `UPDATE friends
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1) RETURNING *`,
        [senderId, receiverId]
    );
};

exports.getFriendsAndWannabes = (myId) => {
    return db.query(
        `
    SELECT users.id, first, last, profilepic, accepted
    FROM friends
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
`, [myId]
    );
};

exports.getUsersByIds = (arrayOfIds) => {
    const query = `SELECT id, first, last, profilepic FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

exports.storeMessage = (message, userId) => {
    return db.query(`INSERT INTO chat (message, sender_id)
    VALUES ($1, $2)`,
    [message, userId]);
};

exports.getMessages = () =>{
    return db.query(`SELECT * FROM (
                        SELECT sender_id, message, created_at, first, last, profilepic
                        FROM chat
                        JOIN users
                        ON users.id = sender_id
                        ORDER BY created_at DESC
                        LIMIT 10
                    ) as reverse
                    ORDER BY reverse.created_at ASC`);
};



exports.getNewMessage = () =>{
    return db.query(`SELECT sender_id, message, created_at, first, last, profilepic
                    FROM chat
                    JOIN users
                    ON users.id = sender_id
                    ORDER BY created_at DESC
                    LIMIT 1`);
};

exports.wallpost = (sender_id, receiver_id, text) => {
    return db.query(`INSERT INTO wallpost (sender_id, receiver_id, wallpost)
    VALUES ($1, $2, $3)`, [sender_id, receiver_id, text]);
};

exports.getWallposts = (receiver_id) => {
    return db.query(`SELECT * FROM (SELECT sender_id, wallpost, wallpost.id, created_at, first, last, profilepic
                    FROM wallpost
                    JOIN users
                    ON users.id = sender_id
                    WHERE receiver_id = $1
                    ORDER BY created_at DESC) as reverse
                    ORDER BY reverse.created_at ASC
                    `, [receiver_id]);
};

exports.getNewWallpost = (receiver_id) => {
    return db.query(`SELECT sender_id, wallpost, wallpost.id, created_at, first, last, profilepic
                    FROM wallpost
                    JOIN users
                    ON users.id = sender_id
                    WHERE receiver_id = $1
                    ORDER BY created_at DESC
                    LIMIT 1
                    `, [receiver_id]);
};

// exports.getLikes = ()
//
// exports.insertWallLikes = ()
