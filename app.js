const express=require("express");
const ejs=require("ejs");
const connection=require("./public/db.js");
const connectionLocal=require("./public/dbLocal.js");
const generateUserSchema=require("./public/generateUserSchema");
const generateUserModel=require("./public/generateUserModel");
const saveNewUser=require("./public/saveNewUser");
const auth=require("./public/auth");
const jwt=require("jsonwebtoken");
const app=express();

const bodyParser=require("body-parser");

 
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


 //Connect to the Database!
 connection();

 //Generate the user schema for signing up the users
 const userSchema=generateUserSchema();
/* console.log(userSchema); */
 //Generate a user model based on the user schema

 const userModel=generateUserModel(userSchema);



 app.get("/",auth,(req,res)=>{
   // connection();
     let tempAuthStatus="";
    if(req.authenticated==="TRUE"){
        tempAuthStatus="TRUE"
    }else{
        tempAuthStatus="FALSE"
    }
    console.log("tempAuthStatus: ", tempAuthStatus );
    res.render("index.ejs",{
        authenticationIndicator: tempAuthStatus,
    

    });

});

app.get("/signup",(req,res)=>{
  //  connection();
    let tempAuthStatus="";
    if(req.authenticated==="TRUE"){
        tempAuthStatus="TRUE"
    }else{
        tempAuthStatus="FALSE"
    }

    res.render("signup.ejs",{
        authenticationIndicator: tempAuthStatus,
    });
});

app.post("/signup",(req,res)=>{
  //  connection();
    const body=req.body;
    const newUser = new userModel({
        name: body.nameOfTheUser,
        email: body.emailOfTheUser,
        password:body.passwordOfTheUser,
        contact: body.contactOfTheUser,
        ID:{
            idType:body.idTypeOfTheUser,
            idLastChars: body.idValue
        },
        
    });
    
  
  /*   newUser.save(function(err){
        if(err){
            console.log(err);
            res.send("user not saved!");
        }else{
            console.log("User has been Saved successfully!");
            res.redirect("/login");
        }
       }); */

    saveNewUser(newUser);

res.redirect("/login");

    
});


app.get("/login",auth,(req,res)=>{
  //  connection();
    res.render("login.ejs",{
        authenticationIndicator: req.authenticated
    });
});

app.post("/login",(req, res) => {
   // connection();
        const body = req.body;

        const emailOfTheUser = body.emailOfTheUser;
        const passwordOfTheUser = body.passwordOfTheUser;

         userModel.findOne({ email: emailOfTheUser }, (err, data) => {
         
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


            } else {
                console.log("Password mismatch!");
                res.sendStatus(404);

            }
        });





         

    });


app.get("/logout",(req,res)=>{
    res.clearCookie("authCookie").redirect("/");
});


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running");
    console.log(__dirname);
});