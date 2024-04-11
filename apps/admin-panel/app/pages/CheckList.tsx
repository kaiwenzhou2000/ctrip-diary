import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Space, Input, Form, Modal, Select, message, Row, Col, Carousel, Popconfirm } from 'antd'
import { useState, useRef } from 'react'

import request from 'umi-request'

type DiaryEntryItem = {
  _id: string
  username: string
  title: string
  description: string
  images: string[]
  video: string
  time: string
  state: string
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false) // 新增状态控制查看详情的模态框
  const [currentRecord] = useState<DiaryEntryItem | null>(null) // 保存当前查看的记录
  const [editingRecord] = useState<DiaryEntryItem | null>(null)
  const actionRef = useRef<ActionType>()
  const [modalForm] = Form.useForm()
  const [form] = Form.useForm()

  // const handleView = (record: DiaryEntryItem) => {
  //   setCurrentRecord(record) // 设置当前选中的记录
  //   setIsViewModalVisible(true) // 显示模态框
  // }

  // const handleEdit = (record: DiaryEntryItem) => {
  //   setEditingRecord(record)
  //   if (record.state === 'Rejected') {
  //     // 如果状态为未通过，则显示Modal
  //     setIsModalVisible(true)
  //   } else {
  //     // 处理其他状态更新逻辑...
  //   }
  // }

  const columns: ProColumns<DiaryEntryItem>[] = [
    // 列定义...
    {
      title: '图片',
      dataIndex: 'images',
      search: false,
      render: (_, record) => (
        <Space>
          {record.images.map((image, index) => (
            // 假设您的服务器静态资源路径已经正确配置，可以直接通过URL访问图片
            <img key={index} src={image} alt={`img-${index}`} style={{ width: 50, height: 50 }} />
          ))}
        </Space>
      ),
      editable: false,
    },
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },

    {
      title: '发布者',
      dataIndex: 'username',
      copyable: true,
      ellipsis: true,
      width: '10%',
      editable: false,
    },
    {
      title: '标题',
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      tooltip: '标题过长会自动收缩',
      editable: false,
    },
    {
      title: '状态',
      dataIndex: 'state',
      // filters: true,
      // onFilter: true,
      // ellipsis: true,
      valueType: 'select',
      width: '10%',
      valueEnum: {
        'Pending review': {
          text: '待审核',
          status: 'Default',
        },
        Approved: {
          text: '已通过',
          status: 'Success',
        },
        Rejected: {
          text: '未通过',
          status: 'Error',
        },
      },
      renderFormItem: (_, { _, _, ...rest }) => {
        return (
          <Select {...rest}>
            <Select.Option value="Pending review">待审核</Select.Option>
            <Select.Option value="Approved">已通过</Select.Option>
            <Select.Option value="Rejected">未通过</Select.Option>
          </Select>
        )
      },
    },
    {
      title: '正文',
      dataIndex: 'description',
      search: false,
      ellipsis: true,
      tooltip: '正文过长会自动收缩',
      editable: false,
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      sorter: true,
      editable: false,
    },
    // {
    //   title: '操作',
    //   valueType: 'option',
    //   render: (text, record, _, action) => [
    //     <a key="view" onClick={() => handleView(record)}>
    //       查看
    //     </a>,
    //     <a
    //       key="editable"
    //       onClick={() => {
    //         action?.startEditable?.(record._id)
    //         console.log(action)
    //         console.log(record)
    //       }}
    //     >
    //       编辑
    //     </a>,
    //   ],
    // },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="view" onClick={() => console.log('查看', record)}>
          查看
        </a>,
        <a key="edit" onClick={() => action?.startEditable(record._id)}>
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除吗?"
          onConfirm={() => handleDelete(record._id)}
          okText="是"
          cancelText="否"
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ]

  const handleDelete = async (id: string) => {
    try {
      await request.delete(`/diaryEntries/${id}`)
      message.success('删除成功')
      actionRef.current?.reload()
    } catch (error) {
      console.error('删除失败', error)
      message.error('删除异常')
    }
  }
  const handleSave = async (
    key: React.Key, // 使用 React.Key 类型
    record: DiaryEntryItem // 处理可选的 newLineConfig 参数
  ): Promise<void> => {
    try {
      const id = String(key) // 类型断言，假定 key 总是可以被转换为 string
      await request.post(`/diaryEntries/${id}`, {
        data: record,
      })
      message.success('保存成功')
      actionRef.current?.reload()
    } catch (error) {
      console.error('保存失败', error)
      message.error('保存异常')
    }
  }

  const handleOk = async () => {
    // const values = await modalForm.validateFields()
    // console.log('Modal Form Values:', values)
    // setIsModalVisible(false)
    // modalForm.resetFields()
    // 在这里处理状态变更逻辑，比如发送请求到后端...
    try {
      const values = await modalForm.validateFields()
      console.log('Modal Form Values:', values)

      if (editingRecord) {
        // 发送请求到后端API，更新状态
        const response = await request.post(`/diaryEntries/${editingRecord._id}`, {
          state: values.state, // 假设表单中有一个名为state的字段
        })

        if (response.success) {
          // 如果更新成功，关闭模态框并刷新表格数据
          message.success('状态更新成功')
          setIsModalVisible(false)
          modalForm.resetFields() // 重置表单
          actionRef.current?.reload() // 刷新表格
        } else {
          message.error('状态更新失败')
        }
      }
    } catch (errorInfo) {
      console.error('Failed:', errorInfo)
      message.error('表单验证失败或更新过程中发生错误')
    }
  }
  const statusEnum: { [key: string]: string } = {
    'Pending review': '待审核',
    Approved: '已通过',
    Rejected: '未通过',
  }

  return (
    <>
      <ProTable<DiaryEntryItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          return request<{
            data: DiaryEntryItem[]
          }>('http://localhost:3000/getDiaryEntries', {
            params,
          })
        }}
        editable={{
          type: 'multiple',
          onSave: handleSave, // 使用更新后的 handleSave 函数
          actionRender: (row, _, dom) => [
            dom.save, // 使用保存按钮
            dom.cancel, // 使用取消按钮
            // 自定义删除按钮
            <Popconfirm
              key="del"
              title="确定删除吗?"
              onConfirm={() => handleDelete(row._id)}
              okText="是"
              cancelText="否"
            >
              <a href="#">删除</a>
            </Popconfirm>,
          ],
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
        rowKey="_id"
        // 更多ProTable配置...
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
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
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="审核列表"
      />
      <Modal
        title="审核说明"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="reason" label="审核情况">
            <Input.TextArea rows={4} placeholder="请输入未通过的原因" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="详情"
        visible={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => setIsViewModalVisible(false)}
        width={800} // 调整模态框的宽度以适应内容
      >
        <Row gutter={16}>
          <Col span={8}>
            {/* 如果有图片，使用 Carousel 组件展示图片轮播 */}
            {currentRecord?.images?.length > 0 && (
              <Carousel autoplay>
                {currentRecord.images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`img-${index}`}
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Carousel>
            )}
            {/* 如果有视频，下方展示视频 */}
            {currentRecord?.video && (
              <video style={{ width: '100%', marginTop: '10px' }} controls>
                <source src={currentRecord.video} type="video/mp4" />
                您的浏览器不支持视频标签。
              </video>
            )}
          </Col>
          <Col span={16}>
            <p>
              <strong>作者:</strong> {currentRecord?.username}
            </p>
            <p>
              <strong>标题:</strong> {currentRecord?.title}
            </p>
            <p>
              <strong>正文:</strong> {currentRecord?.description}
            </p>
            <p>
              <strong>时间:</strong> {currentRecord?.time}
            </p>
            <p>
              <strong>状态:</strong> {statusEnum[currentRecord?.state ?? 'Pending review']}
            </p>
          </Col>
        </Row>
      </Modal>
    </>
  )
}
