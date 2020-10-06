const mongoose = require("mongoose");

const connection=()=>{
    mongoose.connect("mongodb://localhost:27017/AutoDogg", {
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