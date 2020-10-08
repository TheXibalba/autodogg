const mongoose= require("mongoose");



const generateUserSchema=()=>{
    
  return(  new mongoose.Schema({
    name: {
        type:String,
        required: true,
        
    },
    email:{
        type:String,
        required:true
        
    },
    contact:{
        type:String,
        required:true
    },
    password:{
        type: String
    },
    ID:{
        idType:{
            type: String
        },
        idLastChars:{
            type: String
        }
    }
}
)
);

}



module.exports=generateUserSchema;