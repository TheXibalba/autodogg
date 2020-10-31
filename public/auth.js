//jshint esversion:6
const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = (req, res, next) => {

   try {

      const authCodeFromCookie = (req.headers.cookie.split(";")[0]).split("=")[1];
     // const authenticatedUser=(req.headers.cookie.split(";")[1]).split("=")[1];
     
      console.log("Auth Middleware has run!");
      jwt.verify(authCodeFromCookie, process.env.COOKIE_SECRET);
      req.authenticated = "TRUE";
      if (req.url === "/login" || req.url==="/signup" ) {
         res.redirect("/");
      } else if(req.url==="/assistance"){
            res.render("assistance",{
               authenticationIndicator: "TRUE"
            });
      }
       else{
         next();
      }
   } catch (error) {
      //console.log(error);
      req.authenticated = "FALSE";


      if (req.url === "/" || req.url === "/login" || req.url==="/signup" ) {

         res.cookie("authCookie", "", {
            maxAge: 0
         }).cookie("user","",{
            maxAge:0
         });
         next();
      } else if(req.url==="/assistance"){
         res.render("assistance",{
            authenticationIndicator: "FALSE"
         });
      } else{
         return res.cookie("authCookie", "", {
            maxAge: 0
         }).cookie("user","",{
            maxAge:0
         }).render("errorAndSuccessPage",{
            authenticationIndicator: "FALSE",
            message: "Unauthorized User! Redirecting...",
            color: "bg-warning",
            redirectToPage: "/login"

         });

      }
   }
};