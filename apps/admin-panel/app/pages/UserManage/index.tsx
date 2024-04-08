import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Space, Tag, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useRef, useState } from 'react'
import { delPCUser } from '@/app/api/systemUser'
import request from 'umi-request'
import UserForm from './userForm'
type UserPersonalInfo = {
  url?: string
  _id: string
  username: string
  identity: string
  created_at?: string
  updated_at?: string
}

const status: { [key: string]: JSX.Element } = {
  superadmin: <Tag color="red">超级管理员</Tag>,
  publishGroup: <Tag color="gold">发布群组用户</Tag>,
  monitorGroup: <Tag color="cyan">监听群组用户</Tag>,
}

export default () => {
  const actionRef = useRef<ActionType>()
  const [openUserDialog, setOpenUserDialog] = useState(false)
  // const [userList, setUserList] = useState<UserItem[]>([])
  // useEffect(() => {
  //   const getSystemUserList = async () => {
  //     const res = await getPCUserList()
  //     setUserList(res.data.userList)
  //   }
  //   getSystemUserList()
  // }, [userList])

  const handleEditOrAddUser = (id: string) => {
    setOpenUserDialog(true)
    console.log(id)
  }
  const deleteUser = async (id: string) => {
    await delPCUser(id)
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
        publishGroup: { text: '发布群组用户', status: 'publishGroup' },
        monitorGroup: { text: '监听群组用户', status: 'monitorGroup' },
      },
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_)
      },
      render: (_, record) => status[record.identity],
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'created_at',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          }
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_text, record) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditOrAddUser(record._id)}
            />
            <Popconfirm
              title="确认删除该项任务吗?"
              onConfirm={() => deleteUser(record._id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )
      },
      // [
      // <a
      //   key="editable"
      //   // onClick={() => {
      //   //   action?.startEditable?.(record.id)
      //   // }}
      // >
      //   编辑
      // </a>,
      // <a key="view">查看</a>,
      // <a key="delete" onClick={() => deleteUser(record._id)}>
      //   删除
      // </a>,
      // <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
      //   查看
      // </a>,
      // <a href={record.url} target="_blank" key="delete">
      //   删除
      // </a>,
      // ],
    },
  ]

  return (
    <>
      {/* <UserForm visible={openUserDialog} /> */}
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
        headerTitle="用户管理"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              // actionRef.current?.reload()
              handleEditOrAddUser('')
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
    </>
  )
}
