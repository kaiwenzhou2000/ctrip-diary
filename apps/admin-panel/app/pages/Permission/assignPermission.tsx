'use client'
import { Modal, Tree } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { updateUserPermission } from '@/app/api/systemUser'
interface PermitProps {
  assignId: string
  permitList: string[]
  permitVisible: boolean
  closePermit: () => void
}
const AssignPermission = ({ assignId, permitList, permitVisible, closePermit }: PermitProps) => {
  const treeData = useMemo(
    () => [
      { title: '欢迎页', key: 'welcome' },
      {
        title: '管理页',
        key: 'manage',
        children: [
          { title: '用户管理', key: 'userManage' },
          { title: '菜单管理', key: 'menuManage' },
        ],
      },
      {
        title: '审核页',
        key: 'check',
        children: [{ title: '审核列表', key: 'checkList' }],
      },
    ],
    []
  )

  useEffect(() => {
    if (assignId) {
      setCheckedKeys(permitList)
    }
  }, [assignId, permitList])

  const [checkedKeys, setCheckedKeys] = useState<string[]>([])

  const onCheck = (checkedKeysValue: string[]) => {
    setCheckedKeys(checkedKeysValue)
  }

  const handlePermission = async () => {
    await updateUserPermission(assignId, checkedKeys)
    closePermit()
  }

  return (
    <>
      <Modal
        title="授权列表"
        open={permitVisible}
        okText="确认授权"
        cancelText="取消"
        onOk={handlePermission}
        onCancel={closePermit}
      >
        <Tree
          className="border-solid border-slate-50"
          checkable
          treeData={treeData}
          defaultCheckedKeys={['welcome']}
          expandedKeys={['manage']}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
        />
      </Modal>
    </>
  )
}

export default AssignPermission
