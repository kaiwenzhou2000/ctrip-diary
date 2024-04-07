import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { Button, Dropdown, Space, Tag, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { getPCUserList, delPCUser } from '@/app/api/systemUser'
// import request from 'umi-request'
// export const waitTimePromise = async (time: number = 100) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true)
//     }, time)
//   })
// }

// export const waitTime = async (time: number = 100) => {
//   await waitTimePromise(time)
// }

type UserPersonalInfo = {
  // ???
  url?: string
  // pcUserId:string
  // id: number
  // number: number
  _id: string
  username: string
  identity: string
  created_at?: string
  updated_at?: string
  // closed_at?: string
}

const status: { [key: string]: JSX.Element } = {
  superadmin: <Tag color="red">超级管理员</Tag>,
  publishGroup: <Tag color="gold">发布群组用户</Tag>,
  monitorGroup: <Tag color="cyan">监听群组用户</Tag>,
}

type UserItem = {
  _id: string
  username: string
  password: string
  identity?: string
}

export default () => {
  const actionRef = useRef<ActionType>()
  const [userList, setUserList] = useState<UserItem[]>([])
  useEffect(() => {
    const getSystemUserList = async () => {
      const res = await getPCUserList()
      setUserList(res.data.userList)
    }
    getSystemUserList()
  }, [userList])

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
      search: false,
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
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
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
      // <TableDropdown
      //   key="actionGroup"
      //   onSelect={() => action?.reload()}
      //   menus={[
      //     { key: 'copy', name: '复制' },
      //     { key: 'delete', name: '删除' },
      //   ]}
      // />,
      // ],
    },
  ]

  return (
    <ProTable<UserPersonalInfo>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      dataSource={userList}
      // request={async (params, sort, filter) => {
      // console.log(sort, filter)
      //   // await waitTime(2000)
      //   return request<{
      //     data: GithubIssueItem[]
      //   }>('https://proapi.azurewebsites.net/github/issues', {
      //     params,
      //   })
      // }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value)
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      // form={{
      //   // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
      //   syncToUrl: (values, type) => {
      //     if (type === 'get') {
      //       return {
      //         ...values,
      //         created_at: [values.startTime, values.endTime],
      //       }
      //     }
      //     return values
      //   },
      // }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="用户管理"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload()
          }}
          type="primary"
        >
          新建
        </Button>,
        <Dropdown
          key="menu"
          menu={{
            items: [
              {
                label: '1st item',
                key: '1',
              },
              {
                label: '2nd item',
                key: '1',
              },
              {
                label: '3rd item',
                key: '1',
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  )
}
