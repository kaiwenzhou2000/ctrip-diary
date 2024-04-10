import { request } from '@/app/utils/request'

interface Response<T> {
  code?: number
  message: string
  data: T
}

type User = {
  username: string
  password: string
  avatar?: string
}

type PublishItem = {
  userId: string
  title: string
  description: string
  [key: string]: string
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

export const publishTourItem = (userId: string, data: PublishItem) => {
  return request({
    url: `/publish/${userId}`,
    method: 'POST',
    data,
  })
}

// 获取游记信息
export const getTourItem = (publishId: string) => {
  return request({
    url: `/getPublishNote/${publishId}`,
    method: 'GET',
  })
}

// 更新游记信息
export const updateTourItem = (publishId: string, data: PublishItem) => {
  return request({
    url: `/updatePublishNote/${publishId}`,
    method: 'PUT',
    data,
  })
}
