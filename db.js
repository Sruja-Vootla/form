const mongoose = require('mongoose');

// connection to mongodb

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/userdb', {
      useNewUrlParser: true,          // handles special characters better (new MongoDB connection string parser.)
      useUnifiedTopology: true,       //improves handling of server discovery, monitoring, and failover and avoids deprecation warnings.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
