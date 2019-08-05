export default [
    // {
    //   path: '/cardInfo',
    //   name: 'cardInfo',
    //   component: () => import('./views/cardInfo.vue'),
    //   meta: {
    //     title: '用户管理',
    //     icon: 'el-icon-document'
    //   }
    // },
    {
      path: '/cardManage',
      name: 'cardManage',
      component: () => import('./views/cardManage.vue'),
      meta: {
        title: '用户管理',
        icon: 'el-icon-document'
      }
    },
    {
      path: '/plant',
      name: 'plant',
      component: () => import('./views/plantManagement.vue'),
      meta: {
        title: '植物管理',
        icon: 'el-icon-document'
      }
    },
    
    {
      path: '/entryRecord',
      name: 'entryRecord',
      component: () => import('./views/entryRecord.vue'),
      meta: {
        title: '入园记录',
        icon: 'el-icon-document'
      }
    },
    {
      path: '/operateRecord',
      name: 'operateRecord',
      component: () => import('./views/operateRecord.vue'),
      meta: {
        title: '操作记录',
        icon: 'el-icon-document',
        access: ['admin']
      }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('./views/statistics.vue'),
      meta: {
        title: '年票数据统计',
        icon: 'el-icon-document'
      }
    }

  ]