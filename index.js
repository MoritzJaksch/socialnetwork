const express = require("express");
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

const compression = require("compression");
const bodyParser = require("body-parser");
const ca = require("chalk-animation");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bcrypt");

app.use(require("cookie-parser")());
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
});

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const config = require("./config");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const {
    createUsers,
    getPass,
    getUser,
    uploadProfilePic,
    updateBio,
    checkFriendship,
    sendFriendrequest,
    cancelFriendrequest,
    acceptFriendrequest,
    getFriendsAndWannabes,
    getUsersByIds,
    storeMessage,
    getMessages,
    getNewMessage,
    wallpost,
    getWallposts,
    getNewWallpost
} = require("./db");

app.use(express.static("./public"));
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        uploadProfilePic(
            req.session.userId,
            config.s3Url + req.file.filename
        ).then(data => {
            res.json(data);
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/upload", (req, res) => {
    uploadProfilePic(req.session.userId, req.file.filename).then(pic => {
        res.json(pic);
    });
});

app.get("/user", (req, res) => {
    getUser(req.session.userId).then(results => {
        res.json(results);
    });
});

app.get("/user/:id/info", (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({ error: "same ID" });
    } else {
        getUser(req.params.id)
            .then(results => {
                res.json(results);
            })
            .catch(err => {
                res.json({ error: err });
            });
    }
});

app.get("/friendship/:id", (req, res) => {
    checkFriendship(req.session.userId, req.params.id).then(results => {
        res.json(results.rows[0]);
    });
});

app.post("/friendship/:id/send", (req, res) => {
    sendFriendrequest(req.session.userId, req.params.id).then(results => {
        res.json(results.rows[0]);
    });
});

app.post("/friendship/:id/cancel", (req, res) => {
    cancelFriendrequest(req.session.userId, req.params.id).then(results => {
        res.json(results.rows[0]);
    });
});

app.post("/friendship/:id/accept", (req, res) => {
    acceptFriendrequest(req.session.userId, req.params.id).then(results => {
        res.json(results.rows[0]);
    });
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/bio", (req, res) => {
    updateBio(req.session.userId, req.body.bio)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("error in bio: ", err);
        });
});

app.get("/friends/friendlist", (req,res)=>{
    getFriendsAndWannabes(req.session.userId).then(result=>{
        res.json(result.rows);
    }).catch(err => {
        console.log("error in friendlist: ", err);
    });

});

app.post("/registration", (req, res) => {
    hash(req.body.password).then(pass => {
        return createUsers(req.body.first, req.body.last, req.body.email, pass)
            .then(result => {
                req.session.userId = result.rows[0].id;
                req.session.first = req.body.first;
                req.session.last = req.body.last;
                req.session.loggedIn = 1;
                res.json(result);
                // res.redirect("/profile");
            })
            .catch(err => {
                res.json({ success: false });
            });
    });

});

app.post("/login", (req, res) => {
    getPass(req.body.email).then(result => {
        compare(req.body.password, result.rows[0].pass)
            .then(doesMatch => {
                if (doesMatch === true) {
                    req.session.userId = result.rows[0].id;
                    req.session.loggedIn = 1;
                } else {
                    res.json({ success: false });
                }
            })
            .then(() => {
                res.json(req.session);
            })
            .catch(err => {
                console.log("error in login: ", err);
                res.json({ success: false });
            });
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
server.listen(8080, function() {
    ca.rainbow("I'm listening.");
});

//////////////////SERVER-SIDE SOCKET CODE GOES HERE///////////////////
let onlineUsers = {};

io.on('connection', socket=>{
    console.log(`User with socket id ${socket.id} just connected`);
    console.log("socket Session info!", socket.request.session.userId);
    let socketId = socket.id;
    let userId = socket.request.session.userId;

    onlineUsers[socketId] = userId;

    let arrOfIds = Object.values(onlineUsers);
    getUsersByIds(arrOfIds).then(result=>{
        socket.emit("onlineUsers", result.rows);
    }).then(()=>{getUser(userId).then(results=>{
        if (arrOfIds.filter(
            id => id == userId
        ).length == 1) {
            console.log("USER JOINED BROADCASTED!");
            socket.broadcast.emit("userJoined", results.rows[0]);
        }

    });
    });

    getMessages().then(result => {
        io.sockets.emit("gotAllMessages", result.rows);
    });

    getWallposts(userId).then(result=>{
        socket.emit("getWallposts", result.rows);
    });

    socket.on('disconnect', ()=>{
        delete onlineUsers[socketId];
        arrOfIds = Object.values(onlineUsers);
        if (arrOfIds.filter(
            id => id == userId
        ).length == 0) {
            io.sockets.emit("userLeft", userId);
        }

    });

    socket.on('chatMessage', (msg)=>{
        storeMessage(msg, userId).then(()=>{
            getNewMessage().then(result => {
                io.sockets.emit("newMessageSent", result.rows[0]);
            });
        });
    });
    socket.on('wallPost', (post)=>{
        wallpost(userId, post.id, post.message).then(()=>{
            getNewWallpost(post.id).then(result => {
                io.sockets.emit("newWallpost", result.rows[0]);
            });
        });
    });
    socket.on("wallMounted", (id)=>{
        getWallposts(id).then(result=>{
            socket.emit("getWallposts", result.rows);
        });
    });

    socket.on("friendRequestSent", (id)=>{
        getUser(userId).then(result => {
            let receiver_id = Object.keys(onlineUsers).find(key => onlineUsers[key] == id);
            if (receiver_id != undefined) {
                socket.broadcast.to(receiver_id).emit('friendRequest', result.rows);

            } else {
                console.log("ERROR IN FRIENDREQUEST SENT");}




        });

    });
});
