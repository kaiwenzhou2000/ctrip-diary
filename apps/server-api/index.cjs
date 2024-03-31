const express = require('express')
const app = express()

// 当对主页发出 GET 请求时，响应“hello world”
app.get('/', function (req, res) {
  res.send('hello world')
})

// 监听 3000 端口
app.listen(3000, function () {
  console.log('app is listening at port 3000')
})
