const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect("mongodb://localhost:27017/authentication_store", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex:true
    })
    .then((con) => {
      console.log(
        "mongoDB database connected with HOST : ",
        con.connection.host
      );
    })
    .catch((err) => console.log(err));
};

module.exports = connectDatabase;
