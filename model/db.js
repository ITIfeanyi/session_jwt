const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://session-test:SSsX93vdVqgyYMUo@cluster0.ecyvm.mongodb.net/sessions_jwt?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      return err;
    }
    console.log("App connected to the database");
  }
);
