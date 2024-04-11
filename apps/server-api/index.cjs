const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const multer = require('multer')
const fs = require('fs')

// 配置Multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据请求中的某些条件动态设置存储目录
    let uploadFolder = 'uploads/' // 默认目录
    if (req.path.includes('login')) {
      uploadFolder += 'avatar/'
    } else {
      if (file.mimetype.startsWith('image/')) {
        if (file.fieldname === 'cover') {
          uploadFolder += 'covers/'
        } else {
          uploadFolder += 'images/'
        }
      } else if (file.mimetype.startsWith('video/')) {
        uploadFolder += 'videos/'
      }
    }
    // 确保目录存在
    fs.mkdirSync(uploadFolder, { recursive: true })
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    // 当前时间戳-原始文件名
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage: storage })

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

const User = require('./model/UserModel.cjs')
const PCUser = require('./model/PCUserModel.cjs')
// const UserDetail = require('./model/UserDetail.cjs')
const ReleaseNote = require('./model/ReleaseModel.cjs')

// 用户注册
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).send({ message: 'Username and password are required.' })
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).send({ message: '用户名已经存在，请直接登录' })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建新用户
    const user = new User({
      username,
      password: hashedPassword,
    })
    await user.save()

    res.status(200).send({ code: 0, message: 'User registered successfully.', data: user })
  } catch (error) {
    console.error(error)
    res.status(500).send({ code: 500, message: 'Error registering user.' })
  }
})

// 用户登录
app.post('/login', upload.single('avatar'), async (req, res) => {
  try {
    const { username, password } = req.body
    let user = await User.findOne({ username })
    // 如果用户不存在
    if (!user) {
      return res.status(401).send({ message: '用户名不存在' })
    }

    // 如果用户存在，则验证密码
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).send({ message: '密码错误' })
    }
    // 保存上传的头像路径到用户记录
    if (req.file) {
      user.avatar = req.file.path
      await user.save()
    }

    // 如果用户名和密码都有效，发送成功消息
    // const token = jwt.sign({ userId: user._id }, 'qweasdzxciopjklbnm', { expiresIn: '1h' })
    // req.session.token = token

    return res.status(200).send({ message: 'success', data: user })
  } catch (error) {
    console.error('Error logging in:', error, 111)
    res.status(500).json({ error: 'Error logging in' })
  }
})

// 获取用户信息
app.get('/getUserInfo/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const avatarUrl = req.protocol + '://' + req.get('host') + '/' + user.avatar
    const userInfo = {
      ...user.toObject(),
      avatarUrl,
    }
    res.status(200).send({ message: 'success', data: userInfo })
  } catch (e) {
    console.log(e)
  }
})

// 发布游记（当前用户）
app.post(
  '/publish/:userId/:username',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { userId, username } = req.params
      const { title, description } = req.body
      const releaseNote = new ReleaseNote({
        userId,
        username,
        title,
        description,
        images: [],
        create_at: new Date(),
      })

      // 支持多张图片
      if (req.files['images']) {
        req.files['images'].forEach((file) => {
          releaseNote.images.push(file.path)
        })
      }
      // 处理视频，仅支持一个视频
      if (req.files['video']) {
        releaseNote.video = req.files['video'][0].path
      }
      // 封面
      if (req.files['cover']) {
        releaseNote.cover = req.files['cover'][0].path
      }

      await releaseNote.save()

      return res.status(200).send({ message: 'success', data: releaseNote })
    } catch (e) {
      console.log(e)
    }
  }
)

// 获取当前用户游记列表
app.get('/getCurUserTourList/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const curUserList = await ReleaseNote.find({ userId: userId })
    const userItem = await User.findById(userId)
    const modifiedList = curUserList.map((item) => {
      const imgUrls = item.images.map((img) => {
        return req.protocol + '://' + req.get('host') + '/' + img
      })
      const videoUrl = req.protocol + '://' + req.get('host') + '/' + item.video
      const coverUrl = req.protocol + '://' + req.get('host') + '/' + item.cover
      const avatarUrl = req.protocol + '://' + req.get('host') + '/' + userItem.avatar
      return {
        ...item.toObject(),
        imgUrls,
        videoUrl,
        coverUrl,
        avatarUrl,
      }
    })

    return res.status(200).send({ data: modifiedList, success: true })
  } catch (e) {
    console.error(e)
    res.status(500).send({ success: false, message: 'Server error' })
  }
})

// 获取所有游记列表
// app.get('/getAllUserTourList', async (req, res) => {
//   try {
//     const allUsers = await User.find()

//     const userDetailsPromises = allUsers.map(async (user) => {
//       const userTours = await ReleaseNote.find({ userId: user._id.toString() })

//       const tours = userTours.map((tour) => {
//         const imgUrls = tour.images.map((img) => `${req.protocol}://${req.get('host')}/${img}`)
//         const videoUrl = `${req.protocol}://${req.get('host')}/${tour.video}`
//         const coverUrl = `${req.protocol}://${req.get('host')}/${tour.cover}`

//         return {
//           ...tour.toObject(),
//           imgUrls,
//           videoUrl,
//           coverUrl,
//         }
//       })

//       // 更新或创建UserDetail文档
//       return UserDetail.findOneAndUpdate(
//         { userId: user._id.toString() },
//         {
//           userId: user._id.toString(),
//           username: user.username,
//           userAvatar: user.avatar,
//           tours,
//         },
//         { upsert: true, new: true, returnOriginal: false }
//       )
//     })

//     // 等待所有UserDetail文档的更新操作完成
//     const updatedUserDetails = await Promise.all(userDetailsPromises)

//     // 返回更新后的UserDetail数据
//     res.status(200).send({ success: true, data: updatedUserDetails })
//   } catch (e) {
//     console.error(e)
//     res.status(500).send({ success: false, message: 'Server error' })
//   }
// })

// 获取游记具体信息
app.get('/getPublishNote/:publishId', async (req, res) => {
  try {
    const publishId = req.params.publishId
    const publishItem = await ReleaseNote.findById(publishId)
    const videoUrl = req.protocol + '://' + req.get('host') + '/' + publishItem.video
    const imgUrls = publishItem.images.map((img) => {
      return req.protocol + '://' + req.get('host') + '/' + img
    })
    const newPublishItem = {
      ...publishItem.toObject(),
      imgUrls,
      videoUrl,
    }

    res.status(200).send({ message: 'success', data: newPublishItem })
  } catch (e) {
    console.log(e)
  }
})

// 更新游记信息
app.put(
  '/updatePublishNote/:publishId',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const publishId = req.params.publishId
      const { title, description } = req.body

      const releaseNote = await ReleaseNote.findById(publishId)

      // if (!releaseNote) {
      //   return res.status(404).send({ message: '游记未找到' })
      // }

      // 更新标题和描述
      releaseNote.title = title || releaseNote.title
      releaseNote.description = description || releaseNote.description

      // 更新图片
      if (req.files['images']) {
        releaseNote.images = req.files['images'].map((file) => file.path)
      }

      // 更新视频
      if (req.files['video']) {
        releaseNote.video = req.files['video'][0].path
      }

      // 更新封面
      if (req.files['cover']) {
        releaseNote.cover = req.files['cover'][0].path
      }
      await releaseNote.save()

      return res.status(200).send({ message: 'success', data: releaseNote })
    } catch (e) {
      console.log(e)
      res.status(500).send({ message: '更新游记信息异常, 请重新尝试' })
    }
  }
)

// PC端接口

// 获取游记信息
app.get('/getAllDiaries', async (req, res) => {
  try {
    // 分页
    const page = parseInt(req.query.current) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    // 筛选
    let findParams = { isDeleted: false }

    if (req.query.username) {
      findParams.username = req.query.username
    }
    if (req.query.state) {
      findParams.state = req.query.state
    }
    if (req.query.startTime && req.query.endTime) {
      findParams.created_at = {
        $gte: req.query.startTime,
        $lte: req.query.endTime,
      }
    }
    const skip = (page - 1) * pageSize
    const allUserItem = await User.find()
    const userList = await ReleaseNote.find(findParams).skip(skip).limit(pageSize)
    const totalCount = await ReleaseNote.countDocuments(findParams)
    const modifiedUserList = userList.map((item) => {
      const imgUrls = item.images.map((img) => {
        return req.protocol + '://' + req.get('host') + '/' + img
      })
      const videoUrl = req.protocol + '://' + req.get('host') + '/' + item.video
      const coverUrl = req.protocol + '://' + req.get('host') + '/' + item.cover

      const user = allUserItem.find((user) => item.userId.toString() === user._id.toString())
      const avatarUrl = user ? `${req.protocol}://${req.get('host')}/${user.avatar}` : ''

      return {
        ...item.toObject(),
        imgUrls,
        avatarUrl,
        videoUrl,
        coverUrl,
      }
    })

    return res.status(200).send({
      data: modifiedUserList,
      page,
      success: true,
      total: totalCount,
    })
  } catch (e) {
    console.error(e)
    res.status(500).send({ success: false, message: 'Server error' })
  }
})

// 获取客户端用户列表(包含筛选和分页)
app.get('/getPCUserList', async (req, res) => {
  try {
    // 分页
    const page = parseInt(req.query.current) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    // 筛选
    let findParams = {}

    if (req.query.username) {
      findParams.username = req.query.username
    }
    if (req.query.identity) {
      findParams.identity = req.query.identity
    }
    if (req.query.startTime && req.query.endTime) {
      findParams.created_at = {
        $gte: req.query.startTime,
        $lte: req.query.endTime,
      }
    }
    const skip = (page - 1) * pageSize
    const userList = await PCUser.find(findParams).skip(skip).limit(pageSize)
    const totalCount = await PCUser.countDocuments(findParams)

    return res.status(200).send({
      data: userList,
      page,
      success: true,
      total: totalCount,
    })
  } catch (e) {
    console.error(e)
    res.status(500).send({ success: false, message: 'Server error' })
  }
})

// 修改用户信息
app.put('/updatePCUser/:userId', async (req, res) => {
  try {
    const pcUserId = req.params.userId
    const pcUserInfo = req.body
    const updatedPcUser = await PCUser.findByIdAndUpdate(pcUserId, pcUserInfo, { new: true })

    if (!updatedPcUser) {
      return res.status(404).send({ message: '用户不存在' })
    }

    return res.status(200).send({ message: '更新成功', data: updatedPcUser })
  } catch (error) {
    res.status(500).send({ message: '更新用户信息异常, 请重新尝试' })
  }
})

// 获取用户信息
app.get('/getPCUserInfo/:userId', async (req, res) => {
  try {
    const pcUserId = req.params.userId
    const pcUser = await PCUser.findById(pcUserId)
    return res.status(200).send({ message: 'success', data: pcUser })
  } catch (e) {
    console.log(e)
  }
})

// 设置权限
app.post('/setPermission/:userId', async (req, res) => {
  try {
    const pcUserId = req.params.userId
    const { permission } = req.body
    const updatedPcUser = await PCUser.findByIdAndUpdate(
      pcUserId,
      { $set: { permission } },
      { new: true }
    )

    return res.status(200).send({ message: '权限设置成功', data: updatedPcUser })
  } catch (e) {
    res.status(500).send({ message: '更新用户权限异常, 请重新尝试' })
  }
})

// 删除用户
app.delete('/deletePCUser/:userId', async (req, res) => {
  try {
    const taskId = req.params.userId
    const deletedUserItem = await PCUser.findByIdAndDelete(taskId)
    if (!deletedUserItem) {
      return res.status(404).send({ status: 1, msg: '未找到要删除的用户' })
    }
    return res.status(200).send({ status: 0, msg: '用户已成功删除' })
  } catch (error) {
    console.error('删除用户异常', error)
    res.status(500).send({ success: false, message: 'Server error' })
  }
})

// 审核数据
//查询
app.get('/getDiaryEntries', async (req, res) => {
  try {
    const page = parseInt(req.query.current) || 1
    const pageSize = parseInt(req.query.pageSize) || 10

    let findParams = { isDeleted: false }

    if (req.query.title) {
      findParams.title = new RegExp(req.query.title, 'i')
    }

    if (req.query.state) {
      findParams.state = req.query.state
    }

    // 假设create_at已经是日期类型，这里使用范围查询
    if (req.query.startTime && req.query.endTime) {
      findParams.create_at = {
        $gte: new Date(req.query.startTime),
        $lte: new Date(req.query.endTime),
      }
    }

    const skip = (page - 1) * pageSize
    const releaseNotes = await ReleaseNote.find(findParams).skip(skip).limit(pageSize)
    const totalCount = await ReleaseNote.countDocuments(findParams)

    res.status(200).send({
      data: releaseNotes,
      current: page,
      pageSize,
      total: totalCount,
    })
  } catch (e) {
    console.error(e)
    res.status(500).send({ message: 'Server error' })
  }
})

// 更新state状态
app.put('/updatediaryEntries/:id', async (req, res) => {
  const { id } = req.params // 从URL中获取日记条目的ID
  const { state } = req.body // 从请求体中获取新的状态值
  console.log(state)
  if (!state) {
    // 如果没有提供新的状态值，则返回错误响应
    return res.status(400).send({ message: 'State is required.' })
  }
  try {
    const entry = await ReleaseNote.findByIdAndUpdate(
      id, // 使用正确的参数名
      { state: state }, // 更新状态
      { new: true } // 返回更新后的文档
    )

    if (!entry) {
      // 如果找不到对应的日记条目，则返回错误响应
      return res.status(404).send({ message: 'Diary entry not found.' })
    }

    // 返回更新成功的响应，包括更新后的日记条目
    res.send({ message: 'Diary entry updated successfully.', data: entry })
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Error updating diary entry.' })
  }
})

app.put('/diaryEntries/:id', async (req, res) => {
  const { id } = req.params
  const { reasons } = req.body // 接收状态和原因

  try {
    const updatedEntry = await ReleaseNote.findByIdAndUpdate(
      id,
      { reasons: reasons }, // 更新状态和原因
      { new: true }
    )

    if (!updatedEntry) {
      return res.status(404).send({ message: 'Diary entry not found.' })
    }

    res.send({ message: 'Diary entry updated successfully.', data: updatedEntry })
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Error updating diary entry.' })
  }
})

// 逻辑删除
app.put('/deletediaryEntries/:id', async (req, res) => {
  // console.log('Received ID:', req.params.id)
  const { id } = req.params
  try {
    const updatedEntry = await ReleaseNote.findByIdAndUpdate(
      id,
      { isDeleted: true }, // 直接将 isDeleted 设为 true
      { new: true }
    )
    if (!updatedEntry) {
      return res.status(404).send({ message: 'Diary entry not found.' })
    }
    res.send({ message: 'Diary entry deleted successfully.', data: updatedEntry })
  } catch (error) {
    console.error('Error deleting diary entry:', error)
    res.status(500).send({ message: 'Error deleting diary entry.' })
  }
})

mongoose.connect('mongodb://localhost/ctrip').then(async () => {
  console.log('连接数据库成功!!!')
  // 监听 3000 端口
  app.listen(3000, function () {
    console.log('app is listening at port 3000')
  })
})
