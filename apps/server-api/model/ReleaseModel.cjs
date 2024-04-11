const mongoose = require('mongoose')

// const ReleaseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   images: { type: Array },
//   video: { type: String },
// })

const ReleaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [
    {
      path: { type: String, required: true }, // 图片路径
      uploadedAt: { type: Date, default: Date.now }, // 上传时间
    },
  ],
  videos: [
    {
      path: { type: String, required: true }, // 视频路径
      uploadedAt: { type: Date, default: Date.now }, // 上传时间
    },
  ],
})

const ReleaseNote = mongoose.model('ReleaseNote', ReleaseSchema)

module.exports = ReleaseNote
