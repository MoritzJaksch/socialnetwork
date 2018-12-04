const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const ca = require("chalk-animation");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bcrypt");

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

app.use(require("cookie-parser")());
app.use(
    cookieSession({
        secret:
            process.env.SESSION_SECRET ||
            require("./secrets.json").sessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
const {
    createUsers,
    getPass,
    getUser,
    uploadProfilePic,
    updateBio,
    checkFriendship,
    sendFriendrequest,
    cancelFriendrequest,
    acceptFriendrequest
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

// app.get("/user", (req, res) => {});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.listen(8080, function() {
    ca.rainbow("I'm listening.");
});
