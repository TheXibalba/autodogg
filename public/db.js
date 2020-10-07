const mongoose = require("mongoose");
const dotenv=require("dotenv");
const connection=()=>{
    
mongoose.connect("mongodb+srv://admin-yuvraj:Y2U4V6R8@cluster0.ia2jk.mongodb.net/autodogg?retryWrites=true&w=majority",
     {
    useNewUrlParser: true,
    useUnifiedTopology: true
   
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