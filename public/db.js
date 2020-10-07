const mongoose = require("mongoose");
const dotenv=require("dotenv");
const connection=()=>{
    
mongoose.connect("mongodb+srv://"+(process.env.DATABASE_USERNAME)+":"+(process.env.DATABASE_PASSWORD)+"@autodoggDb.ia2jk.mongodb.net/AutoDogg?retryWrites=true&w=majority",
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

//mongoose.connect("mongodb://localhost:27017/AutoDogg",