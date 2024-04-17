import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { createLanguageModel, createJsonTranslator } from 'typechat'
import { Post } from './src/post/index'
import cors from 'cors'
import bodyParser from 'body-parser'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.post('/chat', async (req: Request, res: Response) => {
  // 从请求体中获取数据
  const data = req.body

  const model = createLanguageModel(process.env)
  const schema = fs.readFileSync('src/post/index.ts', 'utf8')
  const translator = createJsonTranslator<Post>(model, schema, 'Post')
  translator.validator.stripNulls = true

  console.log(data, data.request)

  const response = await translator.translate(data.request)
  console.log(response)
  if (!response.success) {
    throw new Error(response.message)
  }
  const post = response.data

  res.end(JSON.stringify(post, undefined, 2))
})

// 启动服务器
const port = 3001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
