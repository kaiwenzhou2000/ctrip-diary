const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const multer = require('multer')
const fs = require('fs')
// const upload = multer({ dest: 'uploads/' }) // 存储到`uploads`目录

// 配置Multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据请求中的某些条件动态设置存储目录
    let uploadFolder = 'uploads/' // 默认目录
    if (req.path.includes('login')) {
      uploadFolder += 'avatar/'
    } else {
      if (file.mimetype.startsWith('image/')) {
        uploadFolder += 'images/'
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
const ReleaseNote = require('./model/ReleaseModel.cjs')
const PCUser = require('./model/PCUserModel.cjs')

app.get('/', function (req, res) {
  res.send('hello world')
})

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
app.post('/publish/:userId', upload.single('file'), async (req, res) => {
  try {
    const userId = req.params.userId
    const { title, description } = req.body
    const releaseNote = new ReleaseNote({
      userId,
      title,
      description,
    })

    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        releaseNote.images.push(req.file.path)
      } else if (req.file.mimetype.startsWith('video/')) {
        releaseNote.video = req.file.path
      }
    }
    await releaseNote.save()

    return res.status(200).send({ message: 'success', data: releaseNote })
  } catch (e) {
    console.log(e)
  }
})

// PC端接口

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
    res.status(500).send({ status: 1, msg: '删除用户异常，请重新尝试' })
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
    await PCUser.insertMany([
      {
        username: 'test',
        password: 'test111',
        identity: 'superadmin',
        created_at: '2024-04-10T10:51:47Z',
      },
      {
        username: 'aaa',
        password: 'aaa111',
        identity: 'publishGroup',
        created_at: '2024-04-01T19:01:47Z',
      },
      {
        username: 'uuu',
        password: 'uuu111',
        identity: 'monitorGroup',
        created_at: '2024-04-03T14:13:47Z',
      },
      {
        username: '要删掉的',
        password: 'uuu111',
        identity: 'monitorGroup',
        created_at: '2024-03-31T18:34:47Z',
      },
      {
        username: 'fegdgdr',
        password: 'grgeher',
        identity: 'publishGroup',
        created_at: '2024-04-03T14:13:47Z',
      },
      {
        username: '5geg6j',
        password: 'vsniodvnis',
        identity: 'monitorGroup',
        created_at: '2024-03-31T18:34:47Z',
      },
    ])
    console.log('Sample user inserted successfully')
  } catch (error) {
    console.error('Error inserting sample user:', error)
  }
}

mongoose.connect('mongodb://localhost/ctrip').then(async () => {
  await insertSampleUser()
  console.log('连接数据库成功!!!')
  // 监听 3000 端口
  app.listen(3000, function () {
    console.log('app is listening at port 3000')
  })
})
