import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',   
    component: index,
    redirect: '/admin',
    meta:{navindex:0},
    children:[
      {
        path: '/admin',
        name: 'statisticalAnalysis',//统计分析
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/statisticalAnalysis.vue'),
        meta:{navindex:0},
      },
      {
        path: '/admin/personnelManage',//管理员端人员管理
        name: 'personnelManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/personnelManagement.vue'),
        meta:{navindex:4},
      },
      {
        path: '/admin/experimentManage',//运行实验管理
        name: 'experimentManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/experimentManagement.vue'),
        meta:{navindex:3},
      },
      {
        path: '/admin/courseManagement',//课程管理
        name: 'courseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/courseManagement.vue'),
        meta:{navindex:1},
      },
      {
        path: '/admin/newCourse',//新建课程
        name: 'newCourse',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/newCourse.vue'),
        meta:{navindex:1},
      },
      {
        path: '/admin/courseDetail',//新建课程
        name: 'courseDetail',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/lp_courseDetail.vue'),
        meta:{navindex:1},
      },
      {
        path: '/admin/experimentLibrary',//实验库
        name: 'experimentLibrary',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/experimentLibrary.vue'),
        meta:{navindex:2},
      },

      {
        path: '/admin/ImageRepository',//镜像库
        name: 'ImageRepository',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/ImageRepository.vue'),
        meta:{navindex:2},
      },
      
      {
        path: '/admin/coursewareLibrary',//课件库
        name: 'coursewareLibrary',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/coursewareLibrary.vue'),
        meta:{navindex:2},
      },
      {
        path: '/admin/questionbankManagement',//题库
        name: 'questionbankManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/questionbankManagement.vue'),
        meta:{navindex:2},
      },
      {
        path: '/admin/sort',//分类
        name: 'sort',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/sort.vue'),
        meta:{navindex:5},
      },

      

   
      
    ]
  },
  {
    path:'/teacher',//教师端
    component: index,
    redirect: '/teacher/newCourseManagement',
    meta:{navindex:0},
    children:[
      {
        path: '/teacher/newCourseManagement',//开课管理
        name: 'newCourseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/newCourseManagement.vue'),
        meta:{navindex:0},
      },
      {
        path: '/teacher/jobManagement',//作业管理
        name: 'jobManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/jobManagement.vue'),
        meta:{navindex:2},
      },
      {
        path: '/teacher/experimentalReport',//实验报告
        name: 'experimentalReport',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/experimentalReport.vue'),
        meta:{navindex:3},
      },
      {
        path: '/teacher/courseManagement',//课程管理
        name: 'teacourseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/courseManagement.vue'),
        meta:{navindex:4},
      },
      {
        path: '/teacher/lessonPreparationManagement',//备课管理
        name: 'lessonPreparationManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/lessonPreparationManagement.vue'),
        meta:{navindex:1},
       

      },
      {  
        path: '/teacher/couseDetail',//备课管理-课程详情
        name: 'couseDetail',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/lp_courseDetail.vue'),
        
      }
     
    ]
  },
  {
    path:'/student',//学生端
    component: index,
    redirect: '/student/myCourses',
    meta:{navindex:0},
    children:[
      {
        path:'/student/myCourses',
        name: 'myCourses',
        component: () => import('../views/student/myCourses.vue'),
        meta:{navindex:0},
      },
      {  
        path: '/student/courseDetail',//学生端课程详情
        name: 'studentCouseDetail',
        component: () => import('../views/student/lp_courseDetail.vue'),
       
      },
      {  
        path: '/student/myReport',//学生端我的报告
        name: 'studentReport',
        component: () => import('../views/student/myReport.vue'),
        meta:{navindex:1},
       
      },
      {  
        path: '/student/myHomework',//学生端我的作业
        name: 'studentmyHomework',
        component: () => import('../views/student/myHomework.vue'),
        meta:{navindex:2},
       
      },
      {  
        path: '/student/myNotes',//学生端我的作业
        name: 'studentmyNotes',
        component: () => import('../views/student/myNotes.vue'),
        meta:{navindex:3},
      }
      
    ]
  },
  {
    path: '/experiment',//操作界面
    name: 'experiment',
    component: () => import('../views/experiment.vue')
  },


  {
    path: '/login',//页面登录
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    path: '/operation',//页面操作
    name: 'operation',
    component: () => import(/* webpackChunkName: "about" */ '../views/operation.vue')
  }
]

const router = new VueRouter({
  //mode: 'history',
  routes,
})


router.beforeEach((to, from, next) => {

 if(from.path=='/experiment'){
    sessionStorage.setItem('slt_Experiment',1)
 }

  //对于登录页面不拦截
  if (to.path === '/login') {
    next();
  } else {
    //var会将作用域放大，let只是局部的作用域
    let admin_username = sessionStorage.getItem('p_p-admin_userName');
    let teacher_username = sessionStorage.getItem('p_p-teacher_userName');
    let user_id =  sessionStorage.getItem('userId');
    let student_username = sessionStorage.getItem('p_p-student_userName');
    if(to.path.indexOf("operation") != -1){
       next();
    }else{
      if(!(user_id &&user_id!=null)){
        next('/login');
      }
      if(to.path.indexOf("admin") != -1){
          if (admin_username === null || admin_username === '') {
            next('/login');
          } else {
            next();
          }
      }
      if(to.path.indexOf("teacher") != -1){
          if (teacher_username === null || teacher_username === '') {
            next('/login');
          } else {
            next();
          }
      }
      if(to.path.indexOf("student") != -1){
        if (student_username === null || student_username === '') {
          next('/login');
        } else {
          next();
        }
      }
    
    next();
  }
  }
});

/*
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
   router.replace(targetPath);
  }
 });
 */

export default router
