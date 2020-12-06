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
//const parts=require("./public/parts.js"); 
const partsTweaked=require("./public/partsTweaked.js"); 
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const predefinedMessages=require("./public/predefinedMessages");
const nodeMailer = require("nodemailer");
const {google}=require("googleapis");
const OAuth2 = google.auth.OAuth2;
let mailList=[process.env.ADMIN_MAIL_ID_1,process.env.ADMIN_MAIL_ID_2]; 


app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//Connect to the Database and initialize nodemailer!


    connection();



    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID , //CLient ID
        process.env.CLIENT_SECRET, // Client Secret
        process.env.REDIRECT_URL // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });
    const accessToken = oauth2Client.getAccessToken();
    const transporter=
    nodeMailer.createTransport({
        service: "gmail",
        auth:{
            type: "OAuth2",
            user: process.env.EMAIL_USERNAME,
            clientId: process.env.CLIENT_ID,
            clientSecret:process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
            
        },
        tls: {
            rejectUnauthorized: false
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
                      transporter.sendMail(mailOptions,(err,info)=>{
                        if(!err){
                            console.log("Mail has been sent Successfully!");
                        }else{
                            throw new Error("Could not send the email!");
                        }
                    }
                        );
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
    res.clearCookie("authCookie").render("errorAndSuccessPage",{
        authenticationIndicator: req.authenticated,
        message: "Logged Out! Redirecting...",
        color: "bg-warning",
        redirectToPage: "/"
    });
});

 app.get("/parts/:brand",(req,res)=>{
    
     const brandName=(req.params.brand);   
 
    
    res.render("partsPage",{
        authenticationIndicator: req.authenticated,
        partsTweaked: partsTweaked,
        brandName:brandName
    });
    

     });


app.get("/cart",auth,(req, res)=>{
    res.render("viewCart",{
        authenticationIndicator: req.authenticated
    })
});                 
 


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
    };
    let mailOptionsSelf={
        from: process.env.MAIL_FROM,
        to: mailList,
        subject: "AutoDogg: A Customer Contacted",
        html: predefinedMessages(body.nameOfTheUser,7,"","",body.message,"","","","","",body.contactOfTheUser),
        replyTo: body.emailOfTheUser
    }
    //Send Email
    
    try{
    transporter.sendMail(mailOptions,(err,info)=>{
        if(!err){
            console.log("Mail has been sent to the customer!");
            transporter.sendMail(mailOptionsSelf,(err,info)=>{
                if(!err){
                    console.log("Mail has been sent to the Admin!");
                    
        
                }else{
                    throw new Error("Could not send the email!");
                }});

        }else{
            throw new Error("Could not send the email!");
        }});
   // console.log(req.body);
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
    redirectToPage: "/contact"
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
        //console.log(body);
        const url=`http://maps.google.com/maps?q=,`;
        let mailOptions={
            from: process.env.MAIL_FROM,
            to: body.emailOfTheUser,
            subject: "AutoDogg: Assistance Request",
            html: predefinedMessages(body.nameOfTheUser,2,"",body.carPlate,body.message,body.carModel,body.carYear,body.problem,"","") ,
            replyTo: process.env.MAIL_FROM
        }
        let mailOptionsSelf={
            from: process.env.MAIL_FROM,
            to: mailList,
            subject: "AutoDogg: Assistance Was Requested",
            html: predefinedMessages(body.nameOfTheUser,6,"",body.carPlate,body.message,body.carModel,body.carYear,body.problem,"","",body.contactOfTheUser) ,
            replyTo: body.emailOfTheUser
        }

       
        //Send Email
         
        try{
        transporter.sendMail(mailOptions,(err,info)=>{
            if(!err){
                console.log("Mail has been sent to the customer!");
                transporter.sendMail(mailOptionsSelf,(err,info)=>{
                    if(!err){
                        console.log("Mail has been sent to the Admin!");
                        
                    }else{
                        throw new Error("Could not send the email!");
                    }});
            }else{
                throw new Error("Could not send the email!");
            }});
       // console.log(req.body);
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
        //console.log(req.body);
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
                };
                 const mailOptionsSelf={
                    from: process.env.MAIL_FROM,
                    to: mailList,
                    subject: "AutoDogg: A Slot Was Booked!",
                    html: predefinedMessages(tempName,5,body.slotDate,body.carPlate,body.message,body.carModel,body.carYear,body.problem,"","") ,
                    replyTo: data.email
                };
               
                transporter.sendMail(mailOptions,(err,info)=>{
                    if(!err){
                        console.log("Mail has been sent to the customer!");
                        transporter.sendMail(mailOptionsSelf,(err,info)=>{
                            if(!err){
                                console.log("Mail has been sent to the Admin!");
                            }else{
                                throw new Error("Could not send the email!");
                            }
                        });
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

app.get("/checkoutPage",auth,(req, res)=>{
    res.render("checkoutPage",{
        authenticationIndicator: req.authenticated,

    });
});



app.post("/checkoutPage",auth,(req, res)=>{
    const body=req.body;
    const Name= body.nameOfTheUser;
    const Email=body.emailOfTheUser;
    const Contact=body.contactOfTheUser;
    const State=body.state;
    const Pincode=body.pincode;
    const Address=body.address+`, ${State}, Pincode:${Pincode}`;
    const message=body.message;
    const Amount=(body.totalAmt).slice((body.totalAmt).indexOf("_")+1);
    let partsCombo="";
    const objKeys=Object.keys(body);
    let i=1;
    for (const [key, value] of Object.entries(body)) {
        if(key.indexOf("_")>-1){
        const tempString =`${key}: ${value}`;
        const normalValue=value.replace("_"," ");
        const normalKey=key.replace("_"," ");
        const quantity=value.slice(0,1);
        const cost=value.slice(2);
        partsCombo+=`<b>${i}.</b> Part: ${normalKey} <b>;</b> Quantity: ${quantity} <b>;</b> Cost: ₹${cost} <b>;</b>`+"<br>";
        i++;
      }
    } partsCombo+=`<b><b>Payable Amount::</b> ₹${Amount}`+"<br>";
    i=0;
    //console.log(partsCombo);
    let mailOptions={
        from: process.env.MAIL_FROM,
        to: body.emailOfTheUser,
        subject: "AutoDogg: Ordered Successfully!",
        html: predefinedMessages(Name,8,"","","","","","","","","",partsCombo,Address),
        replyTo: process.env.MAIL_FROM
    };
    let mailOptionsSelf={
        from: process.env.MAIL_FROM,
        to: mailList,
        subject: "AutoDogg: Order Request",
        html: predefinedMessages(Name,9,"","",body.message,"","","","","",body.contactOfTheUser,partsCombo,Address),
        replyTo: body.emailOfTheUser
    }
    //Send Email
    
    try{
    transporter.sendMail(mailOptions,(err,info)=>{
        if(!err){
            console.log("Mail has been sent to the customer!");
            transporter.sendMail(mailOptionsSelf,(err,info)=>{
                if(!err){
                    console.log("Mail has been sent to the Admin!");
                    
        
                }else{
                    throw new Error("Could not send the email!");
                }});

        }else{
            throw new Error("Could not send the email!");
        }});
   // console.log(req.body);
    res.render("errorAndSuccessPage",{
        authenticationIndicator: req.authenticated,
        message: "Ordered Successfully! Redirecting...",
        color: "bg-success",
        redirectToPage: "/"
    });
}catch (error) {
    res.render("errorAndSuccessPage",{
        authenticationIndicator:req.authenticated,
        message: "An Error Has Ocurred! Please Try Again Later...",
    color: "bg-danger",
    redirectToPage: "/cart"
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
    console.log("Server is running on: "+process.env.PORT);
    
});