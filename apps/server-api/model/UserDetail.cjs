// UserDetail.js
const mongoose = require('mongoose')

const UserDetailSchema = new mongoose.Schema({
  userId: String,
  userAvatar: String,
  tours: [
    {
      title: String,
      description: String,
      images: [String],
      video: String,
      cover: String,
      imgUrls: [String],
      videoUrl: String,
      coverUrl: String,
    },
  ],
})

const UserDetail = mongoose.model('UserDetail', UserDetailSchema)

module.exports = UserDetail
