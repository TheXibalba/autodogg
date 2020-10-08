//jshint esversion:6
const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = (req, res, next) => {

    try {

        const authCodeFromCookie = (req.headers.cookie.split(";")[0]).split("=")[1];
        /* console.log(authCodeFromCookie); */
  console.log("Auth Middleware has run!");
        jwt.verify(authCodeFromCookie, process.env.COOKIE_SECRET);
        req.authenticated = "TRUE";
        if(req.url==="/login"){
           res.redirect("/");
        }else{
        next();
        }
     } catch (error) {
        req.authenticated = "FALSE";
        
        
        if(req.url==="/" || req.url==="/login"){
            
            res.cookie("authCookie", "", {
                maxAge: 0
             });
            next();
        }else{

        
  
        return res.status(401).cookie("authCookie", "", {
           maxAge: 0
        }).send("<h1>Unauthorized!</h1>");
  
     }
    }
   
    
  
  };