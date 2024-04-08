import { PlusOutlined } from '@ant-design/icons'
import {
  LoginForm,
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components'
import { Button, message } from 'antd'
import { useState } from 'react'

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export default () => {
  const Components = {
    ProForm,
    ModalForm,
    LoginForm,
  }
  const [type, setType] = useState<keyof typeof Components>('ProForm')

  const FormComponents = Components[type]

  return (
    <>
      <ProFormRadio.Group
        style={{
          margin: 16,
        }}
        radioType="button"
        fieldProps={{
          value: type,
          onChange: (e) => setType(e.target.value),
        }}
        options={['ProForm', 'ModalForm']}
      />
      <div
        style={{
          margin: 24,
        }}
      >
        <FormComponents
          // @ts-ignore
          labelWidth="auto"
          trigger={
            <Button type="primary">
              <PlusOutlined />
              新建表单
            </Button>
          }
          onFinish={async (values: any) => {
            await waitTime(2000)
            console.log(values)
            message.success('提交成功')
          }}
          initialValues={{
            name: '蚂蚁设计有限公司',
            useMode: 'chapter',
          }}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="name"
              label="签约客户名称"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
            />
            <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name={['contract', 'name']}
              width="md"
              label="合同名称"
              placeholder="请输入名称"
            />
            <ProFormDateRangePicker
              width="md"
              name={['contract', 'createTime']}
              label="合同生效时间"
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              options={[
                {
                  value: 'chapter',
                  label: '盖章后生效',
                },
              ]}
              readonly
              width="xs"
              name="useMode"
              label="合同约定生效方式"
            />
            <ProFormSelect
              width="xs"
              options={[
                {
                  value: 'time',
                  label: '履行完终止',
                },
              ]}
              name="unusedMode"
              label="合同约定失效效方式"
            />
          </ProForm.Group>
          <ProFormText width="sm" name="id" label="主合同编号" />
          <ProFormText
            name="project"
            width="md"
            disabled
            label="项目名称"
            initialValue="xxxx项目"
          />
          <ProFormText width="xs" name="mangerName" disabled label="商务经理" initialValue="启途" />
        </FormComponents>
      </div>
    </>
  )
}
