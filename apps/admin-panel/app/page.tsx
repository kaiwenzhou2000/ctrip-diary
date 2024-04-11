'use client'

import {
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons'
import type { ProSettings } from '@ant-design/pro-components'
import {
  PageContainer,
  ProCard,
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components'
import { ConfigProvider, Divider, Dropdown, Input, theme } from 'antd'
import React, { useState } from 'react'
// import { getUserInfo } from './api/systemUser'
import getRouteConfig from './_defaultProps'

const MenuCard = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Divider
        style={{
          height: '1.5em',
        }}
        type="vertical"
      />
    </div>
  )
}

const SearchInput = () => {
  const { token } = theme.useToken()
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24,
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <Input
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          backgroundColor: token.colorBgTextHover,
        }}
        prefix={
          <SearchOutlined
            style={{
              color: token.colorTextLightSolid,
            }}
          />
        }
        placeholder="搜索方案"
        variant="borderless"
      />
      <PlusCircleFilled
        style={{
          color: token.colorPrimary,
          fontSize: 24,
        }}
      />
    </div>
  )
}

export default () => {
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
  })

  const [pathname, setPathname] = useState('/welcome')
  const [num] = useState(40)
  if (typeof document === 'undefined') {
    return <div />
  }

  const [permission] = useState([
    'welcome',
    'manage',
    'userManage',
    'menuManage',
    'check',
    'checkList',
  ])
  // useEffect(() => {
  // const getUserPermit = async () => {
  //   // 替换为实际id
  //   // const res = await getUserInfo('66156bb3a2870a73ac3cd53e')
  //   const res = await getUserInfo('66156bb3a2870a73ac3cd53a')
  //   const { permission } = res.data
  //   setPermsission(permission)
  // }
  // getUserPermit()
  // }, [])
  const routeConfig = getRouteConfig(permission)

  const getCurrentComponent = (pathname: string) => {
    const routes = routeConfig.route.routes
    for (const route of routes) {
      if (route.path === pathname) {
        if (!route.component && route.routes && route.routes.length > 0) {
          return route.routes[0].component
        } else {
          return route.component
        }
      }

      // 如果一级路由不匹配，检查其子路由
      if (route.routes) {
        for (const subRoute of route.routes) {
          if (subRoute.path === pathname) {
            return subRoute.component
          }
        }
      }
    }

    return null
  }

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('test-pro-layout') || document.body
          }}
        >
          <ProLayout
            prefixCls="my-prefix"
            bgLayoutImgList={[
              {
                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                left: 85,
                bottom: 100,
                height: '303px',
              },
              {
                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                bottom: -68,
                right: -45,
                height: '303px',
              },
              {
                src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                bottom: 0,
                left: 0,
                width: '331px',
              },
            ]}
            {...routeConfig}
            location={{
              pathname,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
              },
            }}
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: true,
            }}
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: '七妮妮',
              render: (_props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: '退出登录',
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                )
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return []
              if (typeof window === 'undefined') return []
              return [
                props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                  <SearchInput />
                ) : undefined,
                <InfoCircleFilled key="InfoCircleFilled" />,
                <QuestionCircleFilled key="QuestionCircleFilled" />,
                <GithubFilled key="GithubFilled" />,
              ]
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a>
                  {logo}
                  {title}
                </a>
              )
              if (typeof window === 'undefined') return defaultDom
              if (document.body.clientWidth < 1400) {
                return defaultDom
              }
              if (_.isMobile) return defaultDom
              return (
                <>
                  {defaultDom}
                  <MenuCard />
                </>
              )
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined
              return (
                <div
                  style={{
                    textAlign: 'center',
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2021 Made with love</div>
                  <div>by Ant Design</div>
                </div>
              )
            }}
            onMenuHeaderClick={(e) => console.log(e)}
            menuItemRender={(item, dom) => (
              <div
                onClick={() => {
                  setPathname(item.path || '/welcome')
                }}
              >
                {dom}
              </div>
            )}
            {...settings}
          >
            <PageContainer
              token={{
                paddingInlinePageContainerContent: num,
              }}
            >
              <ProCard
                style={{
                  height: '200vh',
                  minHeight: 800,
                }}
              >
                <div>{getCurrentComponent(pathname)}</div>
              </ProCard>
            </PageContainer>

            <SettingDrawer
              pathname={pathname}
              enableDarkTheme
              getContainer={(e: unknown) => {
                if (typeof window === 'undefined') return e
                return document.getElementById('test-pro-layout')
              }}
              settings={settings}
              onSettingChange={(changeSetting) => {
                setSetting(changeSetting)
              }}
              disableUrlParams={false}
            />
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  )
}