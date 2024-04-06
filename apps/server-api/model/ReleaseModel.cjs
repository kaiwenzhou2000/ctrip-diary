const mongoose = require('mongoose')

const ReleaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: Array },
  video: { type: String },
})
const ReleaseNote = mongoose.model('ReleaseNote', ReleaseSchema)

module.exports = ReleaseNote
