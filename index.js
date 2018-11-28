const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require('body-parser');
const ca = require("chalk-animation");
const cookieSession = require("cookie-session");
// const csurf = require("csurf");
const { hash, compare } = require("./bcrypt");

///////////////////WHAT DID THIS DO AGAIN?!/////////////////////
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
});
///////////////////WHAT DID THIS DO AGAIN?!/////////////////////

app.use(require("cookie-parser")());
app.use(
    cookieSession({
        secret:
            process.env.SESSION_SECRET ||
            require("./secrets.json").sessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
// app.use(csurf());

// app.use(function(req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

const {
    createUsers,
} = require("./db");


app.use(express.static('./public'));
app.use(compression());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

app.post("/registration", (req,res)=>{
    if (req.body.password) {
        hash(req.body.password)
            .then(pass => {
                return createUsers(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    pass
                ).then(result => {
                    req.session.userId = result.rows[0].id;
                    req.session.first = req.body.first;
                    req.session.last = req.body.last;
                    req.session.loggedIn = 1;
                    console.log("req.session: ", req.session);
                    console.log("result: ", result);
                    res.json(result);
                    // res.redirect("/profile");
                }) .catch(err => {
                    res.json({success: false});
                    console.log("error in registration: ", err);
                });

            });

    } else {
        res.json({success: false});
    }
});





// app.get("/user", (req, res) => {});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    ca.rainbow("I'm listening.");
});
