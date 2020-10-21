const mongoose = require("mongoose");

const generateBrandsModel = (schema) => {

    return (new mongoose.model("brand", schema));

}

module.exports = generateBrandsModel;