import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Input, Form, Modal, Select, message, Row, Col, Popconfirm, Button, Image } from 'antd'
import { useState, useRef, Key } from 'react'
import request from 'umi-request'
import { usePermit } from '../components/permit'
import { updatediaryEntries, deletediaryEntries, diaryEntries } from '../api/systemUser'

type DiaryEntryItem = {
  _id: string
  userId: string
  username: string
  title: string
  description: string
  imgUrls: string[]
  videoUrl: string
  time: string
  state: string
  reasons: string[]
  create_at: string[]
  coverUrl: string
}

export default () => {
  const { hasPermission } = usePermit()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false) // 新增状态控制查看详情的模态框
  const [currentRecord, setCurrentRecord] = useState<DiaryEntryItem | null>(null) // 保存当前查看的记录
  const actionRef = useRef<ActionType>()
  const [modalForm] = Form.useForm()
  const [form] = Form.useForm()

  const handleView = (record: DiaryEntryItem) => {
    setCurrentRecord(record)
    setIsViewModalVisible(true)
  }

  const columns: ProColumns<DiaryEntryItem>[] = [
    {
      title: '图片',
      dataIndex: 'images',
      key: 'images',
      editable: false,
      search: false,
      render: (_, record) => (
        <>
          <Image
            alt=""
            width={100}
            src={record.coverUrl}
            style={{ marginRight: '8px', marginBottom: '8px' }}
            height={100}
          />
        </>
      ),
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
      renderFormItem: (_, { ...rest }) => {
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
      dataIndex: 'create_at',
      valueType: 'dateTime',
      sorter: true,
      editable: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_text, record, _, action) => [
        <Button key="view" type="link" onClick={() => handleView(record)}>
          查看
        </Button>,
        <Button
          key="editable"
          type="link"
          disabled={hasPermission('checkEdit')}
          onClick={() => action?.startEditable(record._id)}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定删除吗?"
          onConfirm={() => handleDelete(record._id)}
          okText="是"
          cancelText="否"
        >
          <Button type="link" disabled={hasPermission('checkDelete')} key="delete">
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleDelete = async (id: string): Promise<void> => {
    try {
      console.log(id)
      await deletediaryEntries(id, true)
      message.success('删除成功')
      actionRef.current?.reload()
    } catch (error) {
      console.error('删除失败', error)
      message.error('删除异常')
    }
  }

  const handleSave = async (_key: Key | Key[], record: DiaryEntryItem): Promise<void> => {
    try {
      const { _id, state } = record
      await updatediaryEntries(_id, state)
      if (state === 'Rejected') {
        setIsModalVisible(true)
        setCurReasonId(_id)
        message.warning('审核状态未通过')
      } else if (state === 'Approved') {
        message.success('审核状态已通过')
      }
      actionRef.current?.reload()
    } catch (error) {
      message.error('保存异常')
    }
  }

  const [curReasonId, setCurReasonId] = useState<string>('')
  const handleOk = async () => {
    try {
      const formData = form.getFieldsValue()
      const { reasons } = formData
      await diaryEntries(curReasonId, reasons)
      setIsModalVisible(false)
      modalForm.resetFields() // 重置表单
      actionRef.current?.reload() // 刷新表格
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
          }>('http://localhost:3000/getPCAllDiaries', {
            params,
          })
        }}
        editable={{
          type: 'multiple',
          onSave: handleSave,
          actionRender: (_row, _, dom) => [
            dom.save, // 使用保存按钮
            dom.cancel, // 使用取消按钮
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
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="reasons" label="审核情况">
            <Input.TextArea rows={4} placeholder="请输入未通过的原因" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="详情"
        open={isViewModalVisible}
        onOk={() => setIsViewModalVisible(false)}
        onCancel={() => setIsViewModalVisible(false)}
        width={800}
      >
        <Row gutter={16}>
          <Col span={8}>
            {currentRecord?.imgUrls?.map(
              (imgUrls: string | undefined, index: Key | null | undefined) => (
                <div key={index}>
                  <Image
                    src={imgUrls}
                    alt={`Image-${index}`}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} // 调整为您需要的尺寸
                  />
                </div>
              )
            )}

            {/* 如果有视频，下方展示视频 */}
            {currentRecord?.videoUrl && (
              <video style={{ width: '100%', marginTop: '10px' }} controls>
                <source src={currentRecord.videoUrl} type="video/mp4" />
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
              <strong>时间:</strong> {currentRecord?.create_at}
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
