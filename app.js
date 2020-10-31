const express = require("express");
const ejs = require("ejs");
const connection = require("./public/db.js");
const connectionLocal = require("./public/dbLocal.js");
const dotenv = require("dotenv").config();
const generateUserSchema = require("./public/generateUserSchema");
const generateUserModel = require("./public/generateUserModel");
const generateBrandsSchema = require("./public/generateBrandsSchema");
const generateBrandsModel = require("./public/generateBrandsModel");
const saveNewUser = require("./public/saveNewUser");
const auth = require("./public/auth");
const jwt = require("jsonwebtoken");
const app = express();
const parts=require("./public/parts.js"); 
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const predefinedMessages=require("./public/predefinedMessages");
const nodeMailer = require("nodemailer");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//Connect to the Database and initialize nodemailer!

    connection();




const transporter=
    nodeMailer.createTransport({
      service: "gmail",
      auth:{
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
      }
  });
  
  

//Generate the user schema for signing up the users
const userSchema = generateUserSchema();
const brandsSchema=generateBrandsSchema();
//Generate a user model based on the user schema

const userModel = generateUserModel(userSchema);
const brandsModel=generateBrandsModel(brandsSchema);





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

app.get("/signup",auth,(req, res) => {

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
        
                userModel.findOne({email:body.emailOfTheUser},(err, data)=>{
                    if(data!==null){
                        console.log("User Found!",data);

                        res.render("errorAndSuccessPage", {
                            authenticationIndicator: req.authenticated,
                            message: "This User Already Exists! Redirecting to The Login Page...",
                            redirectToPage: "/login",
                            color: "bg-warning"
                
                        });

                    }else{
                        console.log("USER NOT FOUND: ",err);



                        saveNewUser(newUser);
                        const mailOptions={
                            from: process.env.MAIL_FROM,
                            to: body.emailOfTheUser,
                            subject: "AutoDogg: Account Created!",
                            html: predefinedMessages(body.nameOfTheUser,1,"","","","","","",body.emailOfTheUser,body.passwordOfTheUser),
                            replyTo: process.env.MAIL_FROM
                        }
                        //Send Email
                     //   transporter.sendMail(mailOptions);
                        res.render("errorAndSuccessPage", {
                            authenticationIndicator: req.authenticated,
                            message: "Registered Successfully! Redirecting...",
                            redirectToPage: "/login",
                            color: "bg-success"
                        });





                    }
                });
             
                   
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
            let trimmedUserId= JSON.parse(JSON.stringify((data._id)));
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
                    httpOnly: true,
                    secure:true
                }).cookie("user",trimmedUserId,{
                    httpOnly:true,
                    secure:true
                });

              
                 res.redirect("/");


            }
        } catch (error) {
            console.log("Username or Password Not Found!");
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

// app.get("/parts/:brand",(req,res)=>{


    
    
//     const brandName=(req.params.brand);   
//     const tempImgPaths=parts[brandName].toyotaParts;
    
    
//     brandsModel.findOne({name: brandName},(err,collection)=>{
//         if(err){
//             console.log(err);
//         }else{
//        /*    
//             console.log(collection.parts);    */
//         res.render("partsPage",{
//         authenticationIndicator: req.authenticated,
//         collection: collection.parts
 
//     });


                 
 
//         }
//     });
 
 
// //  console.log(parts[brandName].imgPath);

// });

app.get("/contact",(req, res)=>{
    res.render("contact",{
        authenticationIndicator: req.authenticated
    });
});
app.post("/contact",(req, res)=>{
    const body=req.body;

    let mailOptions={
        from: process.env.MAIL_FROM,
        to: body.emailOfTheUser,
        subject: "AutoDogg",
        html: predefinedMessages(body.nameOfTheUser,4,"","","","","","","",""),
        replyTo: process.env.MAIL_FROM
    }
    //Send Email
    
    try{
    transporter.sendMail(mailOptions);
    console.log(req.body);
    res.render("errorAndSuccessPage",{
        authenticationIndicator: req.authenticated,
        message: "Message Sent! Redirecting...",
        color: "bg-success",
        redirectToPage: "/"
    });
}catch (error) {
    res.render("errorAndSuccessPage",{
        authenticationIndicator:req.authenticated,
        message: "An Error Has Ocurred! Please Try Again Later...",
    color: "bg-danger",
    redirectToPage: "/assistance"
    });
}    

    
});

app.get("/about",(req, res)=>{
res.render("about",{
    authenticationIndicator:req.authenticated
})
});

app.get("/assistance",(req, res)=>{
    res.render("assistance",{
        authenticationIndicator:req.authenticated
    })
    });
 
    
    app.post("/assistance",(req, res)=>{
        const body=req.body;
        let mailOptions={
            from: process.env.MAIL_FROM,
            to: body.emailOfTheUser,
            subject: "AutoDogg: Assistance Request",
            html: predefinedMessages(body.nameOfTheUser,2,"",body.carPlate,body.message,body.carModel,body.carYear,body.problem,"","") ,
            replyTo: process.env.MAIL_FROM
        }
        //Send Email
        
        try{
        transporter.sendMail(mailOptions);
        console.log(req.body);
        res.render("errorAndSuccessPage",{
            authenticationIndicator:req.authenticated,
            message: "Messsage Sent! Hang On, You Will Be Contacted Shortly...",
        color: "bg-success",
        redirectToPage: "/"
        });
    }catch (error) {
        res.render("errorAndSuccessPage",{
            authenticationIndicator:req.authenticated,
            message: "An Error Has Ocurred! Please Try Again Later...",
        color: "bg-danger",
        redirectToPage: "/assistance"
        });
    }    
    
    
    
    });  
    
app.get("/booking", auth,(req, res)=>{
    
    res.render("booking",{
        authenticationIndicator:req.authenticated
    })
});        


app.post("/booking",auth,(req, res) =>{
    
    try{

        const body=req.body;
        console.log(req.body);
        let tempName="";

        const authenticatedUser=(req.headers.cookie.split(";")[1]).split("=")[1];
        
        userModel.findOne({_id: authenticatedUser},(err,data)=>{
            if(!err){
                 tempName= (data.name).toLowerCase();
                 
                 const mailOptions={
                    from: process.env.MAIL_FROM,
                    to: data.email,
                    subject: "AutoDogg: Slot Booked!",
                    html: predefinedMessages(tempName,3,body.slotDate,body.carPlate,body.message,body.carModel,body.carYear,body.problem,"","") ,
                    replyTo: process.env.MAIL_FROM
                }
                transporter.sendMail(mailOptions,(err,info)=>{
                    if(!err){
                        console.log("Mail has been sent Successfully!");
                    }else{
                        throw new Error("Could not send the email!");
                    }
                });

            }else{
                console.log(err);
            }
           
        });

      
        //Send Email
      
      
    res.render("errorAndSuccessPage",{
        authenticationIndicator:req.authenticated,
        message: "Your Slot Has Been Booked Successfully! Redirecting...",
    color: "bg-success",
    redirectToPage: "/"
    });
    }catch(error){
        console.log(error);
        res.render("errorAndSuccessPage",{
            authenticationIndicator:req.authenticated,
            message: "An Error Ocurred! Redirecting...",
        color: "bg-danger",
        redirectToPage: "/"
        }); 
    }
});

app.get("/*", (req, res) => {
    res.render("errorAndSuccessPage", {
        authenticationIndicator: req.authenticated,
        message: "Invalid Path! Redirecting...",
        color: "bg-warning",
        redirectToPage: "/"
    });

});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
    
});