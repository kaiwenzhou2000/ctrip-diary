const mongoose = require('mongoose')

const diaryEntrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] }, // 假设images是字符串数组
  video: { type: String, default: '' },
  time: { type: String, required: true },
  state: { type: String, required: true, default: 'Pending review' },
  // 如果您想要Mongoose自动处理创建时间和更新时间
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema)

module.exports = DiaryEntry
