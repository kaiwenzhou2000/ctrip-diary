import { request } from '@/app/utils/request'

interface Response<T> {
  code?: number
  message: string
  data: T
}

type UserItem = {
  _id: string
  username: string
  password: string
  identity?: string
}

type UserList = {
  page: number
  per_page: number
  totalCount: number
  userList: UserItem[]
}

// 获取用户列表
export const getPCUserList = (): Promise<Response<UserList>> => {
  return request({
    url: '/getPCUserList',
    method: 'GET',
  })
}

// 更新用户信息
export const updatePcUser = (userId: string, data: UserItem) => {
  return request({
    url: `/updatePCUser/${userId}`,
    method: 'PUT',
    data,
  })
}

// 删除用户
export const delPCUser = (userId: string) => {
  return request({
    url: `/deletePCUser/${userId}`,
    method: 'DELETE',
  })
}
