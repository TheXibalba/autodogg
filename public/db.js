const mongoose = require("mongoose");
const dotenv=require("dotenv");
const connection=()=>{
    
mongoose.connect("mongodb+srv://AUtoDoggAdmin:3214567890@autodoggDb.ia2jk.mongodb.net/AutoDogg",
     {
    useNewUrlParser: true
   
},(err)=>{
    if(!err){
        console.log("Connected to the database!");
    }else{
        console.log(err);
    }
});
mongoose.set('useFindAndModify', false);
}

module.exports=connection;

//mongoose.connect("mongodb://localhost:27017/AutoDogg",  useUnifiedTopology: true