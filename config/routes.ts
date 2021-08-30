export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    icon: 'table',
    component: './Dashboard',
  },
  {
    name: 'userList',
    path: '/userList',
    icon: 'UserOutlined',
    component: './user/UserList',
  },
  {
    name: 'goodsList',
    path: '/goodsList',
    icon: 'ShoppingOutlined',
    component: './GoodsList',
  },
  {
    name: 'categoryManagement',
    path: '/categoryManagement',
    icon: 'AppstoreAddOutlined',
    component: './CategoryManagement',
  },
  {
    name: 'orderManagement',
    path: '/orderManagement',
    icon: 'DollarOutlined',
    component: './OrderManagement',
  },
  {
    component: './404',
  },
];
