import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    navindex:0,

    teacherNavindex:0, //老师端 学生tab切换
    adminNavindex:0, //老师端学生tab切换
    studentNavindex:0, //老师端学生tab切换

    uploadUrl:'http://ibwedu.f3322.net:8111/upload_excel',
    pic_Url:'http://ibwedu.f3322.net:8888',
    uploadUrlExcel: 'http://ibwedu.f3322.net:8111/upload_qb_excel',
    dowmloadExcel: 'http://ibwedu.f3322.net:8111/download_qb_excel',

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
    ],
    tea_menus: [
      { text: "开课管理", path: "/teacher" },
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


