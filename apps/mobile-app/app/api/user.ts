import { request } from '@/app/utils/request'

interface Response<T> {
  code?: number
  message: string
  data: T
}

type User = {
  _id?: string
  username: string
  password: string
  avatar?: string
}

export const registerUser = (data: User) => {
  return request({
    url: '/register',
    method: 'POST',
    data,
  })
}

export const loginUser = (data: User): Promise<Response<User>> => {
  return request({
    url: '/login',
    method: 'POST',
    data,
  })
}

export const getUserItem = (userId: string) => {
  return request({
    url: `/getUserInfo/${userId}`,
    method: 'GET',
  })
}
