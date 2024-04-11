export type WaterFallItem = {
  id: string
  title: string
  avatar: string
  username: string
  cover: string
  state: 'Pending review' | 'Approved' | 'Rejected'
}
