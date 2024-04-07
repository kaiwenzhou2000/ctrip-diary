// axios封装处理
import axios from 'axios'
// import { Alert } from 'react-native'

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    // if(token){
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.log(error)
    // 监控401状态码
    if (error.response.status === 401) {
      // const { message } = error.response.data
      // Alert.alert(message)
      // router.navigate('/login')
    }
    return Promise.reject(error)
  }
)

export { request }
