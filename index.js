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
///////////////////WHAT DID THIS DO AGAIN?!/////////////////////
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
});
///////////////////WHAT DID THIS DO AGAIN?!/////////////////////
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
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        uploadProfilePic(
            req.session.userId,
            config.s3Url + req.file.filename
            // uploadData(
            //     config.s3Url + req.file.filename,
            //     req.body.title,
            //     req.body.description,
            //     req.body.username
        ).then(data => {
            console.log(req.file.filename);
            res.json(data);
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/upload", (req, res) => {
    console.log(req);
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
                console.log("results in get user/info: ", results.data);
                res.json(results);
            })
            .catch(err => {
                res.json({ error: err });
            });
    }
});

app.get("/friendship/:id", (req, res) => {
    checkFriendship(req.session.userId, req.params.id).then(results => {
        console.log("result in checkFriendship:", results.rows[0]);
        res.json(results.rows[0]);
    });
});

app.post("/friendship/:id/send", (req, res) => {
    sendFriendrequest(req.session.userId, req.params.id).then(results => {
        console.log("result in Send Friendship:", results.rows[0]);
        res.json(results.rows[0]);
    });
});

app.post("/friendship/:id/cancel", (req, res) => {
    cancelFriendrequest(req.session.userId, req.params.id).then(results => {
        console.log("result in cancel Friendship: ", results.rows[0]);
        res.json(results.rows[0]);
    });
});

app.post("/friendship/:id/accept", (req, res) => {
    acceptFriendrequest(req.session.userId, req.params.id).then(results => {
        console.log("result in accept Friendship: ", results.rows[0]);
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
    console.log("req in BIO: ", req);
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
        console.log("results in friendlist: ", result);
        res.json(result.rows);
    }).catch(err => {
        console.log("error in friendlist: ", err);
    });

});

app.post("/registration", (req, res) => {
    // if (req.body.password) {
    hash(req.body.password).then(pass => {
        return createUsers(req.body.first, req.body.last, req.body.email, pass)
            .then(result => {
                req.session.userId = result.rows[0].id;
                req.session.first = req.body.first;
                req.session.last = req.body.last;
                req.session.loggedIn = 1;
                console.log("req.session: ", req.session);
                console.log("result: ", result);
                res.json(result);
                // res.redirect("/profile");
            })
            .catch(err => {
                res.json({ success: false });
                console.log("error in registration: ", err);
            });
    });

    // } else {
    //     res.json({success: false});
    // }
});

app.post("/login", (req, res) => {
    getPass(req.body.email).then(result => {
        compare(req.body.password, result.rows[0].pass)
            .then(doesMatch => {
                if (doesMatch === true) {
                    console.log(result.rows[0]);
                    req.session.userId = result.rows[0].id;
                    req.session.loggedIn = 1;
                    console.log(result.rows[0]);
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
        console.log("arr of ids: ", arrOfIds);
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
        console.log("results in get Messages", result.rows);
        // let chatObj = {
        //     message: result.rows,
        //     first: result[1].rows[0].first,
        //     last: result[1].rows[0].last,
        //     profilepic: result[1].rows[0].profilepic
        // };
        io.sockets.emit("gotAllMessages", result.rows);
    });

    getWallposts(userId).then(result=>{
        console.log("results in wallpost with USERID: ", result.rows);
        socket.emit("getWallposts", result.rows);
    });

    socket.on('disconnect', ()=>{
        console.log(`socket with the id ${socket.id} is now disconnected`);
        delete onlineUsers[socketId];
        arrOfIds = Object.values(onlineUsers);
        if (arrOfIds.filter(
            id => id == userId
        ).length == 0) {
            io.sockets.emit("userLeft", userId);
        }
        console.log("arr of Ids after splice: ",arrOfIds);

    });

    socket.on('chatMessage', (msg)=>{
        console.log("msg from socket", msg);
        storeMessage(msg, userId).then(()=>{
            getNewMessage().then(result => {
                console.log("result in messageSent: ", result.rows);
                io.sockets.emit("newMessageSent", result.rows[0]);
            });
        });
    });
    socket.on('wallPost', (post)=>{
        console.log("msg from socket", post);
        wallpost(userId, post.id, post.message).then(()=>{
            getNewWallpost(post.id).then(result => {
                console.log("result in wallpost: ", result.rows);
                io.sockets.emit("newWallpost", result.rows[0]);
            });
        });
    });
    socket.on("wallMounted", (id)=>{
        getWallposts(id).then(result=>{
            console.log("results in wallpost with ID: ", result.rows);
            socket.emit("getWallposts", result.rows);
        });

    });
});


// socket.on('disconnect', ()=>{
//     console.log(`socket with the id ${socket.id} is now disconnected`);
//     let i = arrOfIds.indexOf(userId);
//     let splicedArr = arrOfIds.splice(i, 1);
//     console.log("arr of Ids after splice: ",splicedArr);
//
//
//     if (splicedArr.filter(
//         id => id == userId
//     ).length == 1) {
//         io.sockets.emit("userLeft", userId);
//     }
// });
// });


// getUser(userId).then(result=>{
//     socket.broadcast.emit("userJoined", result.rows);
// }).catch(err=>{
//     console.log("err in userJoined: ", err);
// });


// getUser(userId).then(result=>{
//     arrOfIds.push(result.rows[0].id);
//     getUsersByIds(arrOfIds).then(result=>{
//         socket.broadcast.emit("onlineUsers", result.rows);
//     }).catch(err=>{
//         console.log("err in usersbyid", err);
//     });
//
// });


// io.on('connection', function(socket) {
//     console.log(`socket with the id ${socket.id} is now connected`);
//
//     socket.on('disconnect', function() {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });
//
//     socket.on('thanks', function(data) {
//         console.log(data);
//     });
//
//     socket.emit('welcome', {
//         message: 'Welome. It is nice to see you'
//     });
// });
