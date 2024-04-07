import { request } from '@/app/utils/request'

type User = {
  username: string
  password: string
  avatar?: string
}

type PublishItem = {
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

export const loginUser = (data: User) => {
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

export const publishTourItem = (data: PublishItem) => {
  return request({
    url: '/publish',
    method: 'POS1. 获取所有数据，更新状态T',
    data,
  })
}
