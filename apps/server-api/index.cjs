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

app.post('/publish', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body
    const releaseNote = new ReleaseNote({
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
    console.log(releaseNote)
    await releaseNote.save()

    return res.status(200).send({ message: 'success', data: releaseNote })
  } catch (e) {
    console.log(e)
  }
})

mongoose.connect('mongodb://localhost/ctrip').then(async () => {
  console.log('连接数据库成功!!!')
  // 监听 3000 端口
  app.listen(3000, function () {
    console.log('app is listening at port 3000')
  })
})
