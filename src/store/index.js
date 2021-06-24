import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    navindex:0,
    isDisableFlag: false,

    teacherNavindex:0, //老师端tab切换
    adminNavindex:0, //管理员端tab切换
    studentNavindex:0, //学生端tab切换
  
    uploadUrl:'http://ibwedu.f3322.net:8111/upload_excel',
    pic_Url:'http://ibwedu.f3322.net:8888',
    uploadUrlExcel: 'http://ibwedu.f3322.net:8111/upload_qb_excel',
    dowmloadExcel: 'http://ibwedu.f3322.net:8111/download_qb_excel',

    // uploadUrl:'http://192.168.1.3:8111/upload_excel',
    // pic_Url:'http://ibwedu.f3322.net:8888',
    // uploadUrlExcel: 'http://192.168.1.3:8111/upload_qb_excel',
    // dowmloadExcel: 'http://192.168.1.3:8111/download_qb_excel',

    ad_menus: [
      { text: "统计分析", path: "/admin" },
      { text: "课程管理", path: "/admin/courseManagement" },
      {
        text: "资源库",
        path: "",
        children: [
          { text: "实验库", path: "/admin/experimentLibrary" },
          { text: "课件库", path: "/admin/coursewareLibrary" },
          { text: "镜像库", path: "/admin/ImageRepository" },
          { text: "题库", path: "/admin/questionbankManagement" },
        ],
        showChilren: false,
      },
      { text: "运行实验管理", path: "/admin/experimentManage" },
      { text: "人员管理", path: "/admin/personnelManage" },
      { text: "分类管理", path: "/admin/sort" },
    ],
    tea_menus: [
      { text: "课程管理", path: "/teacher" },
      { text: "备课管理", path: "/teacher/lessonPreparationManagement" },
      { text: "作业管理", path: "/teacher/jobManagement"},
      { text: "实验报告管理", path: "/teacher/experimentalReport"},
      { text: "课堂管理", path: "/teacher/courseManagement" },
    ],
    stu_menus:[
      {text:'我的课程',path: "/student"},
      {text:'实验报告',path: "/student/myReport"},
      {text:'我的作业',path: "/student/myHomework"},
      {text:'我的笔记',path: "/student/myNotes"}
    ]


  },
  mutations: {
    updateNavindex(state, value) {
      state.navindex = value
    },
    updateTeacherNavindex(state, value) {
      state.teacherNavindex = value
    },
    updateAdminNavindex(state, value) {
      state.adminNavindex = value
    },
    updateStudentNavindex(state, value) {
      state.studentNavindex = value
    },

  },
  actions: {
  },
  modules: {
  }
})


