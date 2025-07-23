const mongoose = require("mongoose");

const connectDB = async () => {
<<<<<<< HEAD
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};
=======
    try {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch(err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
}
>>>>>>> 8273f5103fd85c6470a5520e5ae494151cf3da5d

module.exports = connectDB;
