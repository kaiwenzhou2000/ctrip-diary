import { request } from '@/app/utils/request'

type User = {
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
