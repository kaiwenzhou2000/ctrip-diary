const mongoose = require('mongoose')

const diaryEntrySchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  video: { type: String, default: '' },
  time: { type: String, required: true },
  state: { type: String, required: true, default: 'Pending review' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
})

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema)

module.exports = DiaryEntry
