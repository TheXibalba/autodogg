const mongoose= require("mongoose");


const saveNewUser=(newUser)=>{
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("User has been Saved successfully!");
        }
       });
}

module.exports= saveNewUser;