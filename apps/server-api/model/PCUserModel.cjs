const mongoose = require('mongoose')

const PCUserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  identity: { type: String, required: true },
  created_at: { type: String },
})
const PCUser = mongoose.model('PCUser', PCUserSchema)

module.exports = PCUser
