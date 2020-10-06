const express=require("express");
const ejs=require("ejs");


const app=express();

const bodyParser=require("body-parser");


app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(express.json());


app.get("/",(req,res)=>{
res.render("index.ejs",{});
});










app.listen(3000,()=>{
    console.log("Server is running");
    console.log(__dirname);
});