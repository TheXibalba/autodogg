const mongoose = require("mongoose");



const generateBrandsSchema = () => {

    return (new mongoose.Schema({
       parts:[
          
        {  headlight:{
             img: String,
             price: Number
         } },
          {
             oil:{
             img: String,
             price: Number
          }
         }    ,
         { spark: {
             img: String,
             price: Number
         }
      },
      {    tyre: { 
             img:String,
             price: Number
          }
         }   
         ]
    }));

}





module.exports = generateBrandsSchema;






