const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connection = () => {

    mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.ia2jk.mongodb.net/autodogg?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }, (err) => {

        if (!err) {
            console.log("Connected to the database!");


        } else {
            console.log(err);
            return err;

        }
    });
    mongoose.set('useFindAndModify', false);
}

module.exports = connection;

//mongoose.connect("mongodb://localhost:27017/AutoDogg",  useUnifiedTopology: true