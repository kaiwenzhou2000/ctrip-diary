const mongoose = require('mongoose')

const ReleaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: Array },
  video: { type: String },
  cover: { type: String },
  create_at: { type: String },
  state: { type: String, required: true, default: 'Pending review' },
  isDeleted: { type: Boolean, default: false },
  reasons: { type: String, default: '' },
})

const ReleaseNote = mongoose.model('ReleaseNote', ReleaseSchema)

module.exports = ReleaseNote
