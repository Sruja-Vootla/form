const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: String,
  address: String,
  age: Number,
});

module.exports = mongoose.model('User', userSchema);











