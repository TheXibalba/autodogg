const express = require("express");
const ejs = require("ejs");
const connection = require("./public/db.js");
const connectionLocal = require("./public/dbLocal.js");
const generateUserSchema = require("./public/generateUserSchema");
const generateUserModel = require("./public/generateUserModel");
const saveNewUser = require("./public/saveNewUser");
const auth = require("./public/auth");
const jwt = require("jsonwebtoken");
const app = express();

const bodyParser = require("body-parser");


app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//Connect to the Database!
connection();

//Generate the user schema for signing up the users
const userSchema = generateUserSchema();

//Generate a user model based on the user schema

const userModel = generateUserModel(userSchema);

app.get("/", auth, (req, res) => {

    let tempAuthStatus = "";
    if (req.authenticated === "TRUE") {
        tempAuthStatus = "TRUE"
    } else {
        tempAuthStatus = "FALSE"
    }
    console.log("tempAuthStatus: ", tempAuthStatus);
    res.render("index", {
        authenticationIndicator: tempAuthStatus,


    });

});

app.get("/signup", (req, res) => {

    let tempAuthStatus = "";
    if (req.authenticated === "TRUE") {
        tempAuthStatus = "TRUE"
    } else {
        tempAuthStatus = "FALSE"
    }

    res.render("signup", {
        authenticationIndicator: tempAuthStatus,
    });
});

app.post("/signup", (req, res) => {

    const body = req.body;
    const newUser = new userModel({
        name: body.nameOfTheUser,
        email: body.emailOfTheUser,
        password: body.passwordOfTheUser,
        contact: body.contactOfTheUser,
        ID: {
            idType: body.idTypeOfTheUser,
            idLastChars: body.idValue
        },

    });


    try {
        saveNewUser(newUser);

        res.render("errorAndSuccessPage", {
            authenticationIndicator: req.authenticated,
            message: "Registered Successfully! Redirecting...",
            redirectToPage: "/login",
            color: "bg-success"
        })

    } catch (error) {
        res.render("errorAndSuccessPage", {
            authenticationIndicator: req.authenticated,
            message: "Error During user Signup! Redirecting...",
            redirectToPage: "/signup",
            color: "bg-warning"

        });
    }




});


app.get("/login", auth, (req, res) => {

    res.render("login", {
        authenticationIndicator: req.authenticated
    });
});

app.post("/login", (req, res) => {

    const body = req.body;

    const emailOfTheUser = body.emailOfTheUser;
    const passwordOfTheUser = body.passwordOfTheUser;

    userModel.findOne({
        email: emailOfTheUser,
        password: passwordOfTheUser
    }, (err, data) => {
        try {
            if (data.password === passwordOfTheUser) {
                console.log("Password matched!");

                const user = {
                    id: data._id,
                    email: data.emailOfTheUser,
                };
                const token = jwt.sign(user, process.env.COOKIE_SECRET, {
                    expiresIn: process.env.SESSION_EXPIRES_IN
                });
                res.cookie("authCookie", token, {
                    httpOnly: true
                });

                res.redirect("/");


            }
        } catch (error) {
            console.log("Password mismatch!");
            res.render("errorAndSuccessPage", {
                authenticationIndicator: req.authenticated,
                message: "The Username or Password is Invalid! Redirecting...",
                color: "bg-warning",
                redirectToPage: "/login"


            });

        }


    });

});


app.get("/logout", (req, res) => {
    res.clearCookie("authCookie").redirect("/");
});

app.get("/*",auth, (req, res) => {
    res.render("errorAndSuccessPage", {
        authenticationIndicator: req.authenticated,
        message: "Invalid Path! Redirecting...",
        color: "bg-warning",
        redirectToPage: "/"
    });

});
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
    console.log(__dirname);
});