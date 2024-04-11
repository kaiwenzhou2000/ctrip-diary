import { CrownFilled, SmileFilled, TabletFilled, TeamOutlined } from '@ant-design/icons'
import { Welcome, CheckList, UserManage, Permission } from './pages'

interface Route {
  path: string
  name: string
  icon: React.ReactElement
  access: string
  component: React.ReactElement
  routes?: Route[]
}

// 路由配置函数
function getRouteConfig(permissions: string[]) {
  const filterRoutes = (routes: Route[]) => {
    return routes.reduce((acc: Route[], route) => {
      const isAllowed = !route.access || permissions.includes(route.access)
      if (isAllowed) {
        // 判断子路由权限
        if (route.routes) {
          route.routes = route.routes.filter(
            (subRoute) => !subRoute.access || permissions.includes(subRoute.access)
          )
          if (route.routes.length === 0) return acc
        }
        acc.push(route)
      }
      return acc
    }, [])
  }

  const routesConfig = {
    route: {
      path: '/',
      routes: [
        {
          path: '/welcome',
          name: '欢迎',
          icon: <SmileFilled />,
          access: 'welcome',
          component: <Welcome />,
        },
        {
          path: '/manage',
          name: '管理页',
          icon: <CrownFilled />,
          access: 'manage',
          component: <Welcome />,
          routes: [
            {
              path: '/manage/userManage',
              name: '用户管理',
              icon: <TeamOutlined />,
              access: 'userManage',
              component: <UserManage />,
            },
            {
              path: '/manage/menuManage',
              name: '菜单管理',
              icon: <CrownFilled />,
              access: 'menuManage',
              component: <Permission />,
            },
          ],
        },
        {
          path: '/check',
          name: '审核页',
          icon: <TabletFilled />,
          access: 'check',
          component: <CheckList />,
          routes: [
            {
              path: '/check/checkList',
              name: '审核列表',
              icon: <CrownFilled />,
              access: 'checkList',
              component: <CheckList />,
            },
            {
              path: '/list/sub-page2',
              name: '二级列表页面',
              icon: <CrownFilled />,
              access: 'subPage2',
              component: <Welcome />,
            },
          ],
        },
      ],
    },
    location: {
      pathname: '/',
    },
  }

  // 应用权限筛选
  routesConfig.route.routes = filterRoutes(routesConfig.route.routes)

  return routesConfig
}

export default getRouteConfig
