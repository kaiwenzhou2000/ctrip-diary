import { request } from '@/app/utils/request'

interface Response<T> {
  code?: number
  message: string
  data: T
}

type UserItem = {
  _id: string
  username: string
  password?: string
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

// 设置权限
export const updateUserPermission = (userId: string, permission: string[]) => {
  return request({
    url: `/setPermission/${userId}`,
    method: 'POST',
    data: {
      permission,
    },
  })
}

// 获取用户信息
export const getUserInfo = (userId: string) => {
  return request({
    url: `/getPCUserInfo/${userId}`,
    method: 'GET',
  })
}

// 删除用户
export const delPCUser = (userId: string) => {
  return request({
    url: `/deletePCUser/${userId}`,
    method: 'DELETE',
  })
}

//获取用户游记
export const getPCUserWork = (): Promise<Response<UserList>> => {
  return request({
    url: '/getDiaryEntries',
    method: 'GET',
  })
}

//更新用户状态
export const updatediaryEntries = (id: string, state: string) => {
  return request({
    url: `/updatediaryEntries/${id}`,
    method: 'put',
    data: {
      state,
    },
  })
}

//逻辑删除
export const deletediaryEntries = (id: string, isDeleted: boolean) => {
  return request({
    url: `/deletediaryEntries/${id}`,
    method: 'put',
    data: {
      isDeleted,
    },
  })
}

//更新原因
export const diaryEntries = (id: string, reasons: string) => {
  return request({
    url: `/diaryEntries/${id}`,
    method: 'put',
    data: {
      reasons,
    },
  })
}
