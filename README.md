### 项目依赖安装

```bash
pnpm install
```

#### 开启移动端

```bash
pnpm run dev:mobile
```

#### 开启PC端

```bash
pnpm run dev:admin
```

#### 开启服务器

```bash
pnpm run dev:server
```

- 项目运行在simulator环境下。
- 如需启动expo go进行使用，需要进入mobile-app/app/utils的request.js文件夹，将localhost替换为本机编译的ip地址

### 技术栈

#### 移动端

- React Native
- Expo
- glusStack-ui使用React Native和Expo进行跨平台移动应用开发，界面组件采用GlueStack UI库以提升开发效率和用户体验

#### PC端

- React
- Nextjs
- Antd Pro采用Antd Design Pro和Nextjs构建响应式的管理界面，优化管理员的操作流程和体验

#### 服务端

- Nodejs
- MongoDB基于Nodejs和Express构建RESTful API，数据存储使用MongoDB，确保应用数据的灵活处理和高效存取
