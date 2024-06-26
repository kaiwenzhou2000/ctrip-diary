import { request } from '@/app/utils/request'

type PublishItem = {
  userId: string
  title: string
  description: string
  [key: string]: string
}

// 发布游记
export const publishTourItem = (userId: string, username: string, data: PublishItem) => {
  return request({
    url: `/publish/${userId}/${username}`,
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

// 获取当前用户的游记列表(我的游记列表)
export const getCurUserTourList = (userId: string) => {
  return request({
    url: `/getCurUserTourList/${userId}`,
    method: 'GET',
  })
}

// 获取所有用户的游记列表(首页渲染)
export const getAllUserTourList = ({
  current,
  pageSize,
  // search,
}: {
  current: number
  pageSize: number
  // search: string
}) => {
  return request({
    url: `/getAllDiaries?current=${current}&pageSize=${pageSize}`,
    method: 'GET',
  })
}

// AI生成游记
export const chatWithAI = (content: string) => {
  return fetch('http://127.0.0.1:3001/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      request: content,
    }),
  }).then((response) => response.json())
}
