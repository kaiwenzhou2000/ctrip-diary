import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import {
  ActionType,
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { updatePcUser } from '@/app/api/systemUser'
import { usePermit } from '@/app/components/permit'
interface Props {
  status: string
  userInfo?: UserItem
  actionRef: React.MutableRefObject<ActionType | undefined>
}

interface UserItem {
  _id: string
  username: string
  password: string
  identity: string
}
export default ({ status, userInfo, actionRef }: Props) => {
  const { hasPermission } = usePermit()
  const [modalVisit, setModalVisit] = useState(false)
  const [initialValues, setInitialValues] = useState({
    _id: '',
    username: '',
    password: '',
    identity: '',
  })

  useEffect(() => {
    if (status === 'userEdit' && userInfo) {
      setInitialValues({
        _id: userInfo._id,
        username: userInfo.username,
        password: userInfo.password,
        identity: userInfo.identity,
      })
    } else {
      setInitialValues({
        _id: '',
        username: '',
        password: '',
        identity: '',
      })
    }
  }, [status, userInfo])
  return (
    <>
      <div style={{ margin: 10 }}>
        <ModalForm
          title={status === 'new' ? '新建用户' : '编辑用户'}
          trigger={
            status === 'new' ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                disabled={hasPermission('new')}
                onClick={() => setModalVisit(true)}
              >
                新建用户
              </Button>
            ) : (
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={hasPermission('userEdit')}
                onClick={() => setModalVisit(true)}
              />
            )
          }
          initialValues={initialValues}
          onFinish={async (values: UserItem) => {
            await updatePcUser(initialValues._id, values)
            actionRef.current?.reload()
            return true
          }}
          open={modalVisit}
          onOpenChange={setModalVisit}
          modalProps={{
            width: 400,
          }}
        >
          <ProForm.Group>
            <ProFormText
              key="username"
              width="md"
              name="username"
              label="用户名"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
            />
            <ProFormText.Password
              key="userPassword"
              width="md"
              name="password"
              label="密码"
              tooltip="最长为 24 位"
              placeholder="请输入密码"
            />
            <ProFormSelect
              key="identity"
              width="md"
              options={[
                {
                  value: 'superadmin',
                  label: '超级管理员',
                },
                {
                  value: 'publishGroup',
                  label: '发布群组管理员',
                },
                {
                  value: 'monitorGroup',
                  label: '监听群组管理员',
                },
              ]}
              name="identity"
              label="身份"
            />
          </ProForm.Group>
        </ModalForm>
      </div>
    </>
  )
}
