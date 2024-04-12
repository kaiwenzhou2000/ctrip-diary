import React, { createContext, useContext, useState, ReactNode } from 'react'

type IdentityType = 'superadmin' | 'publishGroup' | 'monitorGroup'
interface PermitContextType {
  identity: IdentityType
  setIdentity: React.Dispatch<React.SetStateAction<IdentityType>>
}

const PermitContext = createContext<PermitContextType | null>(null)

// 不同身份用户不能使用的操作
const permissionsMap: { [key in IdentityType]: string[] } = {
  // 审核列表：查看、编辑、删除
  // 'checkView', 'checkApprove', 'checkReject', 'checkDelete'
  // 用户管理：新建、编辑、删除
  // 'new','userEdit', 'userDelete'
  // 菜单管理：权限设置('permit')
  superadmin: [],
  publishGroup: ['checkDelete', 'userEdit', 'userDelete', 'permit'],
  monitorGroup: ['checkEdit', 'checkDelete', 'userEdit', 'userDelete', 'permit'],
}

export const PermitProvider = ({ children }: { children: ReactNode }) => {
  const [identity, setIdentity] = useState<IdentityType>('superadmin')

  return (
    <PermitContext.Provider value={{ identity, setIdentity }}>{children}</PermitContext.Provider>
  )
}

export const usePermit = () => {
  const context = useContext(PermitContext)
  if (!context) {
    throw new Error('usePermit must be used within a PermitProvider')
  }

  const { identity, setIdentity } = context

  const hasPermission = (permission: string): boolean => {
    const permissions = permissionsMap[identity] || []
    return permissions.includes(permission)
  }

  return { identity, setIdentity, hasPermission }
}
