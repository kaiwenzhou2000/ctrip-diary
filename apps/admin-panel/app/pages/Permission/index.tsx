import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { EditOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import AssignPermission from './assignPermission'
import { useRef, useState } from 'react'
import request from 'umi-request'

type UserPersonalInfo = {
  url?: string
  _id: string
  username: string
  password: string
  identity: string
  created_at?: string
  updated_at?: string
  permission: []
}

const status: { [key: string]: JSX.Element } = {
  superadmin: <Tag color="red">超级管理员</Tag>,
  publishGroup: <Tag color="gold">发布群组管理员</Tag>,
  monitorGroup: <Tag color="cyan">监听群组管理员</Tag>,
}

export default () => {
  const actionRef = useRef<ActionType>()

  const [assignId, setAssignId] = useState('')
  const [permitList, setPermitList] = useState([])
  const [permitVisible, setPermitVisible] = useState(false)

  const assignPermission = (userInfo: { _id: string; permission: [] }) => {
    const { _id, permission } = userInfo
    setPermitVisible(true)
    setAssignId(_id)
    setPermitList(permission)
  }

  const closePermit = () => {
    setPermitVisible(false)
  }

  const columns: ProColumns<UserPersonalInfo>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      copyable: true,
      ellipsis: true,
      tooltip: '用户名过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      disable: true,
      title: '身份',
      dataIndex: 'identity',
      valueEnum: {
        superadmin: { text: '超级管理员', status: 'superadmin' },
        publishGroup: { text: '发布群组管理员', status: 'publishGroup' },
        monitorGroup: { text: '监听群组管理员', status: 'monitorGroup' },
      },
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_)
      },
      render: (_, record) => status[record.identity],
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_text, record) => {
        return (
          <>
            <Button type="primary" icon={<EditOutlined />} onClick={() => assignPermission(record)}>
              设置权限
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <>
      <ProTable<UserPersonalInfo>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          return request<{
            data: UserPersonalInfo[]
          }>('http://localhost:3000/getPCUserList', {
            params,
          })
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
        }}
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              }
            }
            return values
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="菜单管理"
      />
      <AssignPermission
        assignId={assignId}
        permitList={permitList}
        permitVisible={permitVisible}
        closePermit={closePermit}
        actionRef={actionRef}
      />
    </>
  )
}
