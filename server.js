const express = require('express')
const cors = require('cors')        // cors -> Cross Origin Resource Sharing
const connectDB = require('./db')
const mongoose = require('mongoose')

const app = express()           // creates an Express application instance.
app.use(express.json())         // parse incoming JSON requests
app.use(cors())                 // enables CORS for all incoming requests.(allows your frontend (on another domain or port) to call your API without being blocked by the browser.)

connectDB()

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: String,
  email: String,
  age: Number,
  gender: String,
  address: String
})

const User = mongoose.model('User', UserSchema)

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


app.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, age, gender, address } = req.body
    const newUser = new User({ firstName, lastName, mobile, email, age, gender, address })
    await newUser.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user' })
  }
})

app.put('/api/users/:id', async (req, res) => {       //:id (route parameter) = mongoDB id of the user to update
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

app.listen(5000, () => console.log('Server running on port 5000'))
