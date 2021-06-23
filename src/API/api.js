import axios from './http'
import qs from 'qs'

var getCity = function (data) {
	return axios.post('/area/get-province-list', getJson(data))
}

//创建token
var createToken = function (data) {
	return axios.post('/createToken', getJson(data))
}

//用户登录
var login = function (data) {
	return axios.post('/login', getJson(data))
}

//获取服务器硬件信息
var hardware = function(data){
	return axios.get('/hardware', getJson(data))
}

//用户在线人数
var online = function(data){
	return axios.get('/online', getJson(data))
}

//在线用户列表
var onlineUsers = function(data){
	return axios.get('/online_user?page='+data.page+'&per_page='+data.per_page)
}

//查询学生，教师信息
var searchUser = function(data){
	return axios.get(encodeURI('/search_user?search='+data.search+'&type='+data.type+'&classes='+data.classes+'&page='+data.page+'&per_page='+data.per_page))
}

//修改学生教师密码
var updateUserPassword = function(data){
	return axios.post('/update_userPassword',data,{headers: {'Content-Type':'application/json'}})
}

//班级列表
var searchClass = function(data){
	return axios.get('/search_class', getJson(data))
}

//班级人数
var searchClassCount = function(data){
	return axios.get('/getClassCountByClassId?classId='+data.classId)
}

//管理员端正在进行的实验
var getRunExperiment = function(data){
	return axios.get('/getRunExperiment?page='+data.page+'&perPage='+data.perPage)
}


//删除用户
var deleteUser = function(params){
	return axios.delete('/delete_user', {data:params})
}

//修改用户
var modifyUser = function(data){
	return axios.post('/modify_user', data,{headers: {'Content-Type':'application/json'}})
}

//老师获取管理员内置课程（开课管理页面的列表）
var getAdminCourseList = function(data){
	return axios.get('/get_admin_course_list?page='+data.page+'&per_page='+data.per_page+'&name='+data.search)
}

//老师获取自己的课程（备课管理的列表）
var getCourseListByUserId = function(data){
	return axios.get('/get_course_list_by_user_id?user_id='+data.user_id+'&page='+data.page+'&per_page='+data.per_page+'&name='+data.search)
}

//老师获取自己的课程（备课管理的列表,不含名称）
var getCourseListNoNameByUserId = function(data){
  return axios.get('/get_public_course_list_by_user_id?user_id='+data.user_id+'&page='+data.page+'&per_page='+data.per_page)
}

//通过id获取课程
var getCourseById = function(data){
	return axios.get('/get_course_by_id?course_id='+data.course_id)
}

//通过id获取课程
var modifyCourseStatus = function(data){
	return axios.post('/modify_course_status',data,{headers: {'Content-Type':'application/json'}})
}

//查询管理员没有发布的课程
var getAdminUnpublishedCourseList = function(data){
	return axios.get('/get_admin_course_list_by_status?user_id='+data.user_id+'&per_page='+data.per_page+'&page='+data.page+'&name='+data.name+'&status='+data.status)
}

//管理员查询已归档的课程
var getExpirCourseList = function(data){
	return axios.get('/get_expired_course_list?per_page='+data.per_page+'&page='+data.page)
}

//管理员新建课程
var insertCourse = function(data){
	return axios.post('/insert_course', data,{headers: {'Content-Type':'application/json'}})
}

//管理员新增课程章
var insertCourseChapterCompleted = function(data){
	return axios.post('/insert_course_chapter_completed', data,{headers: {'Content-Type':'application/json'}})
}

//管理员查询课程章下的课件
var getCoursewareByChapterId = function(data){
	return axios.get('/getCoursewareByChapterId?chapterId='+data.chapterId+'&kind='+data.kind+'&type='+data.type+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询课程节下的课件
var getCoursewareBySectionId = function(data){
	return axios.get('/getCoursewareBySectionId?sectionId='+data.sectionId+'&perPage='+data.perPage+'&page='+data.page+'&kind='+data.kind+'&type='+data.type)
}

//管理员查询课程章下的作业
var getAssignmentByChapterId = function(data){
	return axios.get('/getAssignmentByChapterId?chapterId='+data.chapterId+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询课程下的所有课件
var getCoursewareByCourseId = function(data){
	return axios.get('/getCoursewareByCourseId?courseId='+data.courseId+'&kind='+data.kind+'&type='+data.type+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询课程节下的作业
var getAssignmentBySectionId = function(data){
	return axios.get('/getAssignmentBySectionId?sectionId='+data.sectionId+'&perPage='+data.perPage+'&page='+data.page+'&type='+data.type)
}

//管理员查询父级分类
var findParentCategory = function(data){
	return axios.get('/findParentCategory',data)
}

//管理员查询子级分类
var findChildCategory = function(data){
	return axios.get('/findChildCategory?parent_category_id='+data.parent_category_id)
}

// //管理员查询课程下的所有实验
// var findChildCategory = function(data){
// 	return axios.get('/findChildCategory?parent_category_id='+data.parent_category_id)
// }


//管理员查询分类下的实验
var findAllByCategoryId = function(data){
	return axios.get('/findExperimentByCategory?category_id='+data.category_id+'&name='+data.name+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询分类下的实验
var findAllExperimentByCategoryId = function(data){
	return axios.get('/findSelectedExperimentByCategory?f_category_id='+data.f_category_id+'&c_category_id='+data.c_category_id+'&section_id='+data.section_id+'&name='+data.name+'&perPage='+data.perPage+'&page='+data.page+'&type='+data.type)
}

//管理员查询课件库所有的课件
var getCoursewareAll = function(data){
	//kind种类，type0内置课件  type1教师上传  name关键词  去除'&chapter_id='+data.chapter_id+'&section_id='+data.section_id+
	return axios.get('/getCoursewareAll?perPage='+data.perPage+'&page='+data.page+'&kind='+data.kind+'&type='+data.type+'&name='+data.name+'&category_id='+data.category_id+'&c_category_id='+data.c_category_id+'&chapter_id='+data.chapter_id+'&section_id='+data.section_id)
}

//管理员查询所有的镜像
var getImagequoteList = function(data){
	return axios.get('/getImagequoteList?kind='+data.kind+'&imageName='+data.imageName+'&page='+data.page+'&perPage='+data.perPage)
}

//管理员删除所选的镜像
var deleteImages = function(data){
	return axios.post('/deleteImages?imagesID='+data.imagesID)
}

//管理员查询运行试验管理
var getRunContainerList = function(data){
	return axios.get('/getRunContainerList?type='+data.type+'&classId='+data.classId+'&page='+data.page+'&perPage='+data.perPage)
}

//管理员一键释放所有虚拟机
var stopRunContainerList = function(data){
	return axios.post('/stopRunContainerList',getJson(data))
}

//管理员新增节下的实验
var bindExperiments = function(data){
	return axios.post('/bindExperiments',data,{headers: {'Content-Type':'application/json'}})
}

//根据班级id获取课程
var getAdminCourseByClassId = function(data){
	return axios.get('get_admin_course_list_by_class_id?class_id='+data.class_id+'&page='+data.page+'&per_page='+data.perPage)
}


//管理员新增镜像
var addImage = function(data){
	return axios.get('/addImage?imageName='+data.imageName+'&introduction='+data.introduction+'&kind='+data.kind+'&url='+data.url)
}


//管理员新增实验
var insertExperiment = function(data){
	return axios.post('/insertExperiment', data,{headers: {'Content-Type':'application/json'}})
}
//更新实验
var updateExperiment = function(data){
	return axios.post('/updateExperiment', data,{headers: {'Content-Type':'application/json'}})
}

//管理员查询所有的题库
var getQuestionBackAll = function(data){
	return axios.get(encodeURI('/getQuestionBackAll?type='+data.type+'&content='+data.content+'&category_id='+data.category_id+'&assignment_id='+data.assignment_id+'&perPage='+data.perPage+'&page='+data.page+'&c_category_id='+data.c_category_id))
}

//管理员查询课程节下的题目
var getStudentAnswerBySectionId = function(data){
	return axios.get('/getStudentAnswerBySectionId?sectionId='+data.sectionId+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员删除所选题目
var deleteQuestionBackById = function(data){
	return axios.post('/deleteQuestionBackById', data,{headers: {'Content-Type':'application/json'}})
}

//查询实验库列表
var findExperiment = function(data){
	return axios.get('/findExperimentByCategory?category_id='+data.category_id+'&name='+data.name+'&perPage='+data.perPage+'&page='+data.page+'&type='+data.type)
}

//教师获取作业列表
var getStudentJobList = function (data) {
    return axios.get('/getAssignmentAll?classId=' + data.classId + '&page=' + data.page + '&perPage=' + data.perPage+ '&name=' + data.name+ '&courseId=' + data.courseId+ '&status=' + data.status+ '&chapterId=' + data.chapterId+ '&sectionId=' + data.sectionId+ '&startTime=' + data.startTime+ '&endTime=' + data.endTime+'&ownerId='+data.ownerId)
}

//教师获取作业详情
var getStudentJobDetail = function (data) {
	return axios.get('/getStudentAnswerByAssignmentUserId?userId=' + data.userId + '&page=' + data.page + '&perPage=' + data.perPage+ '&assignmentId=' + data.assignmentId)
}

//教师批改作业
var submitCorrectJob = function (data) {
	return axios.post('/addStudentScore', data, { headers: { 'Content-Type': 'application/json' } })
}
//管理员删除实验
var deleteExperiment =function(data){
	return axios.post('/deleteExperiment?id='+data.id)
}

//查询课程下的实验
var findAllByType =function(data){
	return axios.get('/findAllByType?id='+data.id+ '&type=' + data.type+ '&perPage=' + data.perPage+ '&page=' + data.page+'&experiment_type='+data.experiment_type)
}
//上传文件
var upload = function(data){
	return axios.post('/upload',data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

//管理员添加题库
var adminSubmitQuestions = function (data) {
	return axios.post('/addQuestionBack', data, { headers: { 'Content-Type': 'application/json' } })
}

//管理员课程添加节
var addSection = function (data) {
	return axios.post('/add_section', data, { headers: { 'Content-Type': 'application/json' } })
}

//管理员课程添加小节
var addSmallSection = function (data) {
	return axios.post('/add_small_section', data, { headers: { 'Content-Type': 'application/json' } })
}

//管理员删除课程章
var removeChapter =function(params){
	return axios.delete('/remove_chapter', {data:params} )
}

//管理员删除课程节
var removeSection =function(params){
	return axios.delete('/remove_section', {data:params} )
}

//管理员删除课程小节
var removeSmallSection =function(params){
	return axios.delete('/remove_small_section', {data:params} )
}



//管理员章节添加课件
var addChapterSectionCourseware = function (data) {
	return axios.post('/addChapterSectionCourseware', data, { headers: { 'Content-Type': 'application/json' } })
}

//管理员课件库删除课件
var deleteCoursewareById = function (data) {
	return axios.post('/deleteCoursewareById', data, { headers: { 'Content-Type': 'application/json' } })
}

//管理员课件库新增课件
var addCourseware = function (data) {
	return axios.post('/addCourseware', data, { headers: { 'Content-Type': 'application/json' } })
}

//学生获取课程
var student_getCourseList =function(data){
	return axios.get('/get_course_list?user_id='+data.user_id+ '&per_page=' + data.per_page+ '&page=' + data.page+'&start=' + data.start+'&end=' + data.end+'&name=' + data.name)
}
//教师获取课堂列表
var getRunContainerByTeacher =function(data){
	return axios.get('/getRunContainerByTeacher?courseId='+data.courseId+'&filter='+data.filter+'&perPage=' + data.perPage+ '&page=' + data.page+'&teacherId='+data.teacherId)
}
//课程结束 容器ID是list数组，type 0是START,1是 STOP,2是 RESTART
var execContainer=function(data){
	return axios.post('/execContainer?containerId='+data.containerId+'&type='+data.type)
}

//获取章下面的节pdf附件
var get_chapter_by_id = function(data){
	return axios.get('/get_chapter_by_id?chapter_id='+data.chapter_id)
}
//创建实验
var createContainers  =function(data){
	return axios.get('/createContainers?userId='+data.userId+'&experimentId='+data.experimentId+'&courseId='+data.courseId)
}
//管理员和教师关闭实验
var removeContainers = function(data){
	return axios.post('/removeContainers?containerIds='+data.containerIds)
}

//管理员端课程下的题库添加题目
var addAssignment = function(data){
	return axios.post('/addAssignment', data, { headers: { 'Content-Type': 'application/json' } })
}

//学生获取作业列表
var student_getJobList =function(data){
    return axios.get('/getStudentAssignment?userId='+data.userId+ '&perPage=' + data.perPage+ '&page=' + data.page+'&courseId=' + data.courseId+'&chapterId=' + data.chapterId+'&sectionId=' + data.sectionId+'&status=' + data.status+'&name=' + data.name)
}


//学生获取作业详情
var student_getJobDetail =function(data){
    return axios.get('/getStudentAnswerByAssignment?userId='+data.userId+ '&perPage=' + data.perPage+ '&page=' + data.page+'&assignmentId=' + data.assignmentId)
}


//管理员课程下上传节下的作业(保存按钮)
var addQuestionBackAssignmentList =function(data){
	return axios.post('/addQuestionBackAssignmentList',data, { headers: { 'Content-Type': 'application/json' } })
}

//管理员课程下上传节下的作业(确认按钮)
var modifyAssignmentStatusById =function(data){
	return axios.post('/modifyAssignmentStatusById',data, { headers: { 'Content-Type': 'application/json' } })
}


//管理员端删除课程
var removeCourseById =function(params){
	return axios.delete('/remove_course_by_id',{data:params})
}

//学生端新增实验报告
var insertExperimentRepor = function(data){
	return axios.post('/insertExperimentRepor', data,{headers: {'Content-Type':'application/json'}})
}
//学生端判断是否已提交实验报告
var hasExperimentReport = function(data){
	return axios.get('/hasExperimentReport?experiment_id='+data.experiment_id+'&user_id='+data.user_id)
}

//管理员端删除课程
var unbindExperiments =function(data){
	return axios.post('/unbindExperiments?section_id='+data.section_id+'&experiment_id='+data.experiment_id)
}

//管理员端查询课程下的作业名称
var getAssignmentNameBySectionId =function(data){
	return axios.get('/getAssignmentNameBySectionId?sectionId='+data.sectionId)
}

//学生保存作业
var stduentSaveHomework = function(data){
	return axios.post('/addStudentAnswerList', data,{headers: {'Content-Type':'application/json'}})
}

//学生提交作业
var stduentSubmitHomework = function(data){
	return axios.post('/modifyStudentAnswerStatusById', data,{headers: {'Content-Type':'application/json'}})
}
//查询实验报告列表
var findByExperimentReportAll = function(data){
	return axios.get('/findByExperimentReportAll?course_id='+data.course_id+'&ownerId='+data.ownerId+'&status='+data.status+'&isCorrect='+data.isCorrect+'&name='+data.name+'&startTime='+data.startTime+'&endTime='+data.endTime+'&perPage=' + data.perPage+ '&page=' +data.page)
}
//学生端提交实验报告和教师端批阅
var updateExperimentReport = function(data){
	return axios.post('/updateExperimentReport',data,{headers: {'Content-Type':'application/json'}})
}
//查看实验报告
var findExperimentReportByExperimentAndUserId = function(data){
	return axios.get('/findExperimentReportByExperimentAndUserId?experiment_id='+data.experiment_id+'&user_id='+data.user_id)
}

//班级学生信息
var getStudentsByClasses = function(data){
	return axios.get('/get_students_by_classes?classIds='+data.classIds+ '&per_page=' + data.per_page+ '&page=' + data.page)
}

//修改作业名称
var modifyAssignmentNameById = function(data){
	return axios.post('/modifyAssignmentNameById', data,{headers: {'Content-Type':'application/json'}})
}

//学生获取笔记
var getStudentsNotes = function(data){
	return axios.get('/get_courseware_remark_list?course_id='+data.course_id+ '&per_page=' + data.per_page+ '&page=' + data.page+ '&user_id=' + data.user_id+ '&title=' + data.title)
}

//学生上传笔记
var stduentUploadNotes = function(data){
	return axios.post('/upload_remark', data,{headers: {'Content-Type':'application/json'}})
}

//删除课程章或节下的课件
var deleteChapterSectionCourseById = function(data){
	return axios.post('/deleteChapterSectionCourseById', data,{headers: {'Content-Type':'application/json'}})
}
//学生删除笔记
var delete_remark =function(params){
	return axios.delete('/delete_remark', {data:params} )
}

//教师备课
var prepareCourse = function(data){
	return axios.post('/prepare_course', data,{headers: {'Content-Type':'application/json'}})
}

//修改课程章名称
var modifyChapterNameById = function(data){
	return axios.post('/modify_chapter_name_by_id', data,{headers: {'Content-Type':'application/json'}})
}

//修改课程节名称
var modifySectionNameById = function(data){
	return axios.post('/modify_section_name_by_id', data,{headers: {'Content-Type':'application/json'}})
}

//修改课程小节名称
var modifySmallSectionNameById = function(data){
	return axios.post('/modify_small_section_name_by_id', data,{headers: {'Content-Type':'application/json'}})
}
//下载代码
var downloadCode=function(data){
	return axios.post('/downloadCode?containerId='+data.containerId+'&fileName='+data.fileName)
}

//课程归档
var modifyExpiredCourseStatus = function(data){
  return axios.post('/modify_expired_course_status', data,{headers: {'Content-Type':'application/json'}})
}

//课程归档
var getStudentsByClasseId = function(data){
  return axios.get('/get_students_by_classeId?classId='+data.classId)
}

//查看归档课程
var getChangedCourseList = function(data){
  return axios.get('/get_changed_course_list?name='+data.name+ '&per_page=' + data.per_page+ '&page=' + data.page)
}

//修改课程名称
var modifyCourseName = function(data){
  return axios.post('/modify_course_name', data,{headers: {'Content-Type':'application/json'}})
}
//重新开启镜像
var createAndRunContainers = function(data){
	return axios.get('/createAndRunContainers?userId='+data.userId+'&experimentId='+data.experimentId+'&courseId='+data.courseId+'&imageId='+data.imageId)

}

//管理员教师删除作业
var deleteAssignmentById = function(data){
  return axios.post('/deleteAssignmentById', data,{headers: {'Content-Type':'application/json'}})
}

//结束单个实验镜像
var stopExperiment =function(data){
	return axios.post('/stopExperiment?userId='+data.userId+'&experimentId='+data.experimentId)
}

//用户退出登陆
var layout =function(data){
  return axios.get('/logout?user_id='+data.user_id)
}
//学生获取实验报告列表
var findStudentExperimentReport =function(data){
	return axios.get('/findStudentExperimentReport?course_id='+data.course_id+'&status='+data.status+'&name='+data.name+'&user_id='+data.user_id+'&perPage=' + data.perPage+ '&page=' +data.page)
}

//分类管理
var insertCategoryList = function(data){
	return axios.post('/insertCategoryList', data,{headers: {'Content-Type':'application/json'}})
  }


export{
	getCity,createToken,login,hardware,online,onlineUsers,searchUser,searchClass,deleteUser,getAdminCourseList,getCourseListByUserId,getCourseById,
	modifyCourseStatus,getCoursewareBySectionId,modifyUser,getAdminUnpublishedCourseList,getCoursewareAll,insertCourse,getExpirCourseList,
	getImagequoteList,deleteImages,addImage,insertExperiment,getAdminCourseByClassId,getQuestionBackAll,deleteQuestionBackById,insertCourseChapterCompleted,
	getCoursewareByChapterId,getAssignmentByChapterId,getAssignmentBySectionId,getCoursewareByCourseId,findParentCategory,findChildCategory,
	getStudentJobList,getStudentJobDetail,submitCorrectJob,findAllByCategoryId,getStudentAnswerBySectionId,findExperiment,deleteExperiment,
	findAllByType,getRunContainerList,adminSubmitQuestions,addSection,addChapterSectionCourseware,addCourseware,addSmallSection,
	stopRunContainerList,bindExperiments,searchClassCount,getRunExperiment,upload,student_getCourseList,removeChapter,removeSection,removeSmallSection,
	deleteCoursewareById,getRunContainerByTeacher,execContainer,get_chapter_by_id,createContainers,removeContainers,modifyAssignmentNameById
	,addAssignment,student_getJobList,student_getJobDetail,addQuestionBackAssignmentList,removeCourseById,insertExperimentRepor,hasExperimentReport
	,unbindExperiments,getAssignmentNameBySectionId,findByExperimentReportAll,updateExperimentReport,findExperimentReportByExperimentAndUserId,getStudentsByClasses,
	getStudentsNotes,stduentUploadNotes,findAllExperimentByCategoryId,updateUserPassword,deleteChapterSectionCourseById,delete_remark,stduentSubmitHomework,stduentSaveHomework
	,prepareCourse,modifyChapterNameById,modifySectionNameById,modifySmallSectionNameById,updateExperiment,modifyAssignmentStatusById,downloadCode,modifyExpiredCourseStatus
	,getChangedCourseList,modifyCourseName,getCourseListNoNameByUserId,deleteAssignmentById,layout,
  getStudentsByClasseId,createAndRunContainers,stopExperiment,findStudentExperimentReport,insertCategoryList
}

function getJson (data) {
	return qs.stringify(data)
}
