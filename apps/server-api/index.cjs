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
    // 根据请求中的条件动态设置存储目录
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
const ReleaseNote = require('./model/ReleaseModel.cjs')

// 用户注册
app.post('/register', upload.single('avatar'), async (req, res) => {
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
    // 保存上传的头像路径到用户记录
    if (req.file) {
      user.avatar = req.file.path
    }
    await user.save()

    res.status(200).send({ code: 0, message: 'User registered successfully.', data: user })
  } catch (error) {
    console.error(error)
    res.status(500).send({ code: 500, message: 'Error registering user.' })
  }
})

// 用户登录
app.post('/login', async (req, res) => {
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

    return res.status(200).send({ message: 'success', data: user })
  } catch (error) {
    console.error('Error logging in:', error)
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

// 获取所有用户游记列表
app.get('/getAllDiaries', async (req, res) => {
  try {
    // 分页
    const page = parseInt(req.query.current) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    // 筛选参数
    // const search = req.query.search

    // 过滤
    let findParams = { isDeleted: false }

    // if (search) {
    //   findParams.$or = [
    //     { title: { $regex: new RegExp(search, 'i') } },
    //     { description: { $regex: new RegExp(search, 'i') } },
    //   ]
    // }
    const skip = (page - 1) * pageSize
    const allUserItem = await User.find()
    const userList = await ReleaseNote.find(findParams).skip(skip).limit(pageSize)
    const modifiedUserList = userList.map((item) => {
      if (item.state !== 'Approved') return null
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

    const filteredUserList = modifiedUserList.filter((item) => item !== null)

    const totalCount = filteredUserList.length

    return res.status(200).send({
      data: filteredUserList,
      page,
      success: true,
      total: totalCount,
    })
  } catch (e) {
    console.error(e)
    res.status(500).send({ success: false, message: 'Server error' })
  }
})

// 获取单条游记具体信息
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

// 更新单条游记信息
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
app.get('/getPCAllDiaries', async (req, res) => {
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

// PC端用户登录
app.post('/PClogin', async (req, res) => {
  try {
    const { username, password } = req.body
    let user = await PCUser.findOne({ username })
    // 如果用户不存在
    if (!user) {
      return res.status(401).send({ message: '用户名不存在' })
    }

    // 如果用户存在，则验证密码
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).send({ message: '密码错误' })
    }

    return res.status(200).send({ message: 'success', data: user })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: 'Error logging in' })
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

// 设置用户权限
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

// 更新游记的审核状态
app.put('/updatediaryEntries/:id', async (req, res) => {
  const { id } = req.params
  const { state } = req.body
  console.log(state)
  if (!state) {
    return res.status(400).send({ message: 'State is required.' })
  }
  try {
    const updatedList = await ReleaseNote.findByIdAndUpdate(id, { state: state }, { new: true })

    if (!updatedList) {
      return res.status(404).send({ message: 'Diary entry not found.' })
    }

    res.send({ message: 'Diary entry updated successfully.', data: updatedList })
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Error updating diary entry.' })
  }
})

// 审核未通过，更新游记原因
app.put('/diaryEntries/:id', async (req, res) => {
  const { id } = req.params
  const { reasons } = req.body

  try {
    const updatedEntry = await ReleaseNote.findByIdAndUpdate(
      id,
      { reasons: reasons },
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

// 游记列表逻辑删除
app.put('/deletediaryEntries/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updatedEntry = await ReleaseNote.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    if (!updatedEntry) {
      return res.status(404).send({ message: 'Diary entry not found.' })
    }
    res.send({ message: 'Diary entry deleted successfully.', data: updatedEntry })
  } catch (error) {
    console.error('Error deleting diary entry:', error)
    res.status(500).send({ message: 'Error deleting diary entry.' })
  }
})

const insertSampleUser = async () => {
  try {
    // 检查是否已有用户数据
    const existingUsers = await PCUser.find()
    if (existingUsers.length > 0) {
      console.log('已存在用户数据，无需插入示例数据')
      return
    }

    // 插入新的用户数据，后续删除
    const insertedPCusers = [
      {
        username: 'superadmin',
        password: '123456',
        identity: 'superadmin',
        created_at: '2024-04-10T10:51:47Z',
        // 菜单权限
        permission: ['welcome', 'manage', 'userManage', 'menuManage', 'check', 'checkList'],
      },
      {
        username: 'publishUser',
        password: 'publish123',
        identity: 'publishGroup',
        created_at: '2024-04-01T19:01:47Z',
        permission: ['welcome', 'manage', 'userManage', 'check', 'checkList'],
      },
      {
        username: 'monitorUser',
        password: 'monitor123',
        identity: 'monitorGroup',
        created_at: '2024-04-03T14:13:47Z',
        permission: ['welcome', 'manage', 'userManage', 'check', 'checkList'],
      },
      {
        username: 'otherUser',
        password: 'uuu111',
        identity: 'monitorGroup',
        created_at: '2024-03-31T18:34:47Z',
        permission: ['welcome', 'manage'],
      },
      {
        username: 'fegdgdr',
        password: 'grgeher',
        identity: 'publishGroup',
        created_at: '2024-04-03T14:13:47Z',
        permission: ['welcome'],
      },
      {
        username: '5geg6j',
        password: 'vsniodvnis',
        identity: 'monitorGroup',
        created_at: '2024-03-31T18:34:47Z',
        permission: ['welcome'],
      },
      {
        username: 'aaaa',
        password: 'nnnnnn',
        identity: 'monitorGroup',
        created_at: '2024-03-31T18:34:47Z',
      },
    ]

    // 使用bcrypt加密所有用户的密码
    const promises = insertedPCusers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      return { ...user, password: hashedPassword }
    })

    // 等待所有密码加密完成
    const usersWithHashedPasswords = await Promise.all(promises)

    // 插入加密后的用户数据
    await PCUser.insertMany(usersWithHashedPasswords)

    console.log('Sample user inserted successfully')
  } catch (error) {
    console.error('Error inserting sample user:', error)
  }
}
mongoose.connect('mongodb://localhost/ctrip').then(async () => {
  console.log('连接数据库成功!!!')
  await insertSampleUser()
  // 监听 3000 端口
  app.listen(3000, function () {
    console.log('app is listening at port 3000')
  })
})
