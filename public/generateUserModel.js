const mongoose= require("mongoose");

const generateUserModel=(schema)=>{

return(

new mongoose.model("user",schema)


);

}

module.exports= generateUserModel;