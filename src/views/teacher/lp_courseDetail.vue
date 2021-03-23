<template>
    <div class="pp_main boxsizing detail_main">
        <div class="container">
            <div class="pageTab">
                <div class="mess">
                    当前位置：<a class="pointer" @click="back"> {{backNum==1?'开课管理':'备课管理'}}</a> > <span>{{courseName}}</span>
                </div>
            </div>
        </div>
        <div class="container container_info">
            <div class="info_box">


                <!--头部课程详细信息-->
                <div class="top_info ">
                     <div class="c_pic"><img :src="picurl"/></div>
                     <div class="c_info">
                         <div class="right_info">
                             <div class="info_detail_box">
                                <p class="r_name">{{courseName}}<img class="pointer course_edit" v-if="status ==0" @click="isEdit=true" src="../../assets/img/icon_edit.png"/></p>

                                <div class="d-cel">
                                    共有{{chapterNumber}}个章节，{{sectionNumber}}个知识点
                                </div>
                                <!--已开课才有这个信息-->
                                <div class="d-cel clearfix">
                                    <div class="fl">课程时间：{{time}}</div>
                                    <div class="fr">{{numbers}}人学习</div>
                                </div>
                                <div class="line"></div>
                                 <el-scrollbar class="content_el-scrollbar">
                                    <div class="d-cel">{{introduction}}
                                    </div>
                                 </el-scrollbar>
                                <!--如果状态已开课之后就不可以在修改，按钮不显示-->

                                <div class="btnbox">
                                    <a class="btnDefault pointer btn-course" @click="type == 1?sure_newCourse=true:show_dialog_file = true" v-if="showopenClass()">{{type == 0?"确认备课":"确认开课"}}</a>
                                </div>
                             </div>
                         </div>
                     </div>
                </div>

                <!--备课弹出框-->
                <el-dialog

                        :visible.sync="show_dialog_file"
                        width="500px">
                    <div slot="title" class="dialog_header">
                        备课
                    </div>
                    <div class="confirm_dialog_body">
                        <p class="dialog_mess"><span class="span_icon icon_waring">确认备课吗</span></p>
                    </div>
                    <div slot="footer" class="dialog-footer ">
                        <a class="btnDefault" @click="archiveManagement">确 认</a>
                        <a class="btnDefault"   @click="show_dialog_file = false">取 消</a>
                    </div>
                </el-dialog>

                 <div class="detail_nav">
                    <a :class="{'cur':index==navindex}" v-for="(item,index) in menu" :key="index" @click="linkDetails(item,index)">{{item.name}}</a>
                </div>

                 <!--课程大纲-->
                <chapter :courseId="courseId" v-if="navindex==0" :chapters="courseChapters" :status="status"></chapter>


                <!--开课时间-->
                <div v-if="navindex==1" class="courseTime_box">
                   <div class="time_table">
                       <div class="v-middle">
                           <div class="din">
                               <el-date-picker
                                v-model="startTime"
                                :picker-options="pickerOptionsStart"
                                type="date"
                                placeholder="选择开始时间"
                                @focus="clickStartTime"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :disabled="isSetTime"
                                >
                                </el-date-picker>
                            </div>
                             <div class="din">
                               <el-date-picker
                                v-model="endTime"
                                :picker-options="pickerOptionsEnd"
                                type="date"
                                placeholder="选择结束时间"
                                @focus="clickEndTime"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :disabled="isSetTime">
                                </el-date-picker>
                            </div>
                            <div class="btnbox">
                                <a class="btnDefault pointer" @click="modifyCourseTime()" v-if="status ==0" >确认</a>
                            </div>
                       </div>
                   </div>
                </div>

                <!--班级列表-->
                <classList v-if="navindex==2"
                    @sureCheckClass="sureCheckClass"
                    :classesList = "classesList"
                    :classList = "classList"
                    @getCourseById="getCourseById"
                    @checkClass="checkClass(arguments)"
                    :status = status>
               </classList>


                <!--课程实验-->
                <experiment v-if="navindex==3" :typeData = type :status = status :course_info = myData></experiment>

                <!--课程课件-->
                <courseware v-if="navindex==4" :typeData = type :status = status  ></courseware>
                <coursework v-if="navindex==5" timeStatus='1' :noEdit = canCaozuo() :course_info = myData></coursework>

                <!--老师课程开课确认框-->
                <el-dialog
                    :visible.sync="sure_newCourse"
                    width="500px"
                    class="personDialog"
                >
                    <div slot="title" class="dialog_header">课程开课</div>

                    <div class="confirm_dialog_body" style="padding-bottom:20px">
                        <p class="dialog_mess">
                            <span class="span_icon icon_waring">是否确定开课！</span>
                        </p>
                    </div>
                    <span slot="footer" class="dialog-footer">
                <button class="btnDefault" @click="sure_newCourse = false">取消</button>
                <button class="btnDefault" @click="openClass">确认</button>
            </span>
                </el-dialog>
                <!--课程名称修改弹出框-->
                  <el-dialog
                    :visible.sync="isEdit"
                    width="500px"
                    class="personDialog"

                    >
                    <div slot="title" class="dialog_header">课程名称修改</div>

                    <div class="editMain" >
                        <el-form ref="form" label-width="60px">
                        <el-form-item label="名称">
                            <el-input v-model="editValue" placeholder="请输入修改的课程名称" :maxlength="16" v-emoji></el-input>
                        </el-form-item>

                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <button class="btnDefault" @click="isEdit = false">取消</button>
                        <button class="btnDefault" @click="modifyCourseName">确认修改</button>
                    </span>
                    </el-dialog>


            </div>


        </div>
    </div>
</template>
<script>
import classList from "@/components/d_classList_box.vue";//学生信息-班级列表

import chapter from "@/components/d_chapter_box.vue";//课程大纲
import experiment from "@/components/d_experiment_box.vue";//课程实验
import courseware from "@/components/d_courseware_box.vue";//课程课件
import coursework from "@/components/d_coursework_box.vue";//课程作业

import {getCourseById,modifyCourseStatus,searchClass,searchClassCount,modifyCourseName,prepareCourse} from '@/API/api';

export default {
    inject:['reload'],
    data(){
        return{
           backNum:1,
           navindex:0,
            introduction:'',
            numbers:'',
            chapterNumber:'',
            sectionNumber:'',
            time:'',
            courseName:'',
            type:'',
            show_dialog_file:false,

           menu:[
               {name:'课程大纲'},
               {name:'开课时间'},
               {name:'学生信息'},
               {name:'课程实验'},
               {name:'课程课件'},
               {name:'课程作业'}
            ],

           picurl:'',

            startTime:'',//课程开始时间
            endTime:'',//课程结束时间
              // 开始日期 :picker-options 中引用
            pickerOptionsStart: {},
            // 结束日期 :picker-options 中引用
            pickerOptionsEnd: {},
            isSetTime:false,//设置时间是否设置(这个根据课程是否是已开课)



            showStudentList:false,//是否显示学生列表
            courseId:'',
            course:'111',
            courseChapters:[],
            classesList:[],
            status:0,
            show_courseOutline:{},//当前展示的课程章节，新建小节还是展示小节列表
            show_courseSection:{},//当前展开的是哪个小节

            isEdit:false ,//课程名称修改是否显示
            editValue:'',//
            sure_newCourse:false,//教师端是否开课弹窗显示

            classList:[],//该课程下班级列表

            myData:{},

        }
    },
    components:{classList,chapter,experiment,courseware,coursework},
    created(){
        let that = this;
        that.backNum = that.$route.query.back?that.$Base64.decode(that.$route.query.back):2;
        that.courseId = that.$route.query.courseId;
        if(sessionStorage.getItem('slt_Experiment') !=null &&　sessionStorage.getItem('slt_Experiment') == 1){
            sessionStorage.removeItem('slt_Experiment')
            that.$store.commit("updateTeacherNavindex",3);
        }
        that.navindex = that.$store.state.teacherNavindex;

    },
    beforeDestroy(){
        let that = this;
        that.$store.commit("updateTeacherNavindex",0);

    },
    mounted(){
        let that = this;
        that.show_courseOutline = sessionStorage.getItem('show_courseOutline')?JSON.parse(sessionStorage.getItem('show_courseOutline')):{};
         that.show_courseSection = sessionStorage.getItem('show_courseSection')?JSON.parse(sessionStorage.getItem('show_courseSection')):{};

        that.getCourseById();

        if(that.backNum == 1){
          that.type = 0
        }else if(that.backNum == 2){
          that.type = 1
        }



    },
    methods:{
        getCourseById(){

            let course_id = this.$route.query.courseId
            let that = this;
            let obj = {};
            obj.course_id = course_id;
            getCourseById(obj).then(res=> {
                if(res.code==200){
                    // console.log(res.data)
                    that.courseDetail =res.data
                    that.courseName = res.data.name
                    that.introduction = res.data.introduction
                    that.numbers = res.data.numbers==null?that.numbers = 0:res.data.numbers
                    that.chapterNumber = res.data.chapter_number
                    that.sectionNumber = res.data.small_section_number

                    if(res.data.start_at !='' && res.data.end_at != '' && res.data.start_at !=null && res.data.end_at != null){
                        let ipos1 = res.data.start_at.indexOf("T");
                        let ipos2 = res.data.start_at.indexOf("T");
                        that.startTime = res.data.start_at.substring(0,ipos1)
                        that.endTime =  res.data.end_at.substring(0,ipos2)
                        that.time = res.data.time = res.data.start_at.substring(0,ipos1) +' - '+ res.data.end_at.substring(0,ipos2);
                    }else{
                        that.time = '暂无设置时间';
                    }
                    that.myData = res.data;
                    that.course = res.data
                    that.status = res.data.status

                    //该课程下面选中的班级列表

                    that.classesList = res.data.classesList

                    if(that.navindex==2){

                       that.searchClass();
                    }

                    that.courseChapters = res.data.chapters
                    that.picurl = that.$store.state.pic_Url+ res.data.pic_url
                    that.addParamShow(that.courseChapters)
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        //修改课程名称
        modifyCourseName(){
          let that = this;
          if (that.editValue=='') {
              return that.$toast('请输入课程名称',2000)

          }
          let obj = {}
          obj.course_id = this.$route.query.courseId
          obj.course_name = that.editValue
          obj.owner_id = sessionStorage.getItem("userId")
          modifyCourseName(obj).then(res=> {
            if(res.code==200){
              that.isEdit = false
              that.$toast('修改成功',2000)
              that.reload();
            }else{
              that.$toast("修改失败",3000)
            }
          })
        },
        //教师开课
        openClass(){
            let that = this;
            let obj = {}
            obj.owner_id = sessionStorage.getItem("userId")
            obj.user_id_list =  [];
            obj.course_id = this.$route.query.courseId;
            obj.start = '';
            obj.end = '';
            obj.status = 1;
            if (that.time == "暂无设置时间") {
                return that.$toast("请先设置开课时间", 3000);
            }

            let dates1 = new Date(that.endTime);
            let dates2 = new Date();

            if (dates1 < dates2) {
              return that.$toast("该课程结束时间不能小于当前时间", 3000);
            }

            if (that.numbers == 0) {
                return that.$toast("请先设置学生信息", 3000);
            }
            modifyCourseStatus(obj).then(res=> {
                if(res.code==200){
                    that.$toast('开课成功',3000)

                    that.reload();
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },

      archiveManagement(){

          let that = this;
          let obj = {};
          obj.user_id = sessionStorage.getItem("userId");
          obj.course_id = this.$route.query.courseId;
          prepareCourse(obj).then(res=> {
              if(res.code==200){
                  that.$toast("备课成功",2000)
                  that.$router.push({path:'/teacher/lessonPreparationManagement'}).catch((err)=>{
                  console.log(err)
                })
                  that.$store.commit("updateNavindex", 1);
                  // that.$store.commit("updateNavindex", 1);
              }else{
                  that.$toast("备课失败",3000)
              }
          })
      },
        //章节下拉显示添加参数
        addParamShow(array){
            let that = this;
            array.sort(this.compare('order'))
            for(var i=0;i<array.length;i++){

             /*章节是否展开 */
            if( that.show_courseOutline.id == array[i].id){
                this.$set(array[i], 'show', true);
            }else{
                    this.$set(array[i], 'show', false);
            }

                if(i == array.length-1){
                    //alert(i)
                    that.$set(array[i], 'lastNum', 0)
                }
                array[i].status = 1
                array[i].sections.sort(this.compare('order'))
                for(var j=0;j<array[i].sections.length;j++){

                    if(array[i].sections[j].id == that.show_courseSection.id){
                        this.$set(array[i].sections[j], 'show', true);
                    }else{
                        this.$set(array[i].sections[j], 'show', false);
                    }

                    if(j == array[i].sections.length - 1) {
                        that.$set(array[i].sections[j], 'lastNum', 0)
                    }
                    array[i].sections[j].status = 1
                    array[i].sections[j].small_sections.sort(this.compare('order'))
                    for(var k=0;k<array[i].sections[j].small_sections.length;k++){
                        this.$set(array[i].sections[j].small_sections[k], 'show', false);
                        if(k == array[i].sections[j].small_sections.length - 1) {
                            that.$set(array[i].sections[j].small_sections[k], 'lastNum', 0)
                        }
                    }
                }
            }
        },
        compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },




        modifyCourseTime(){
            let that = this;
            let obj = {};
            obj.owner_id = sessionStorage.getItem('userId');
            obj.course_id = that.$route.query.courseId;

            //that.startTime=that.startTime.getFullYear() + '-' + (that.startTime.getMonth() + 1) + '-' + that.startTime.getDate();
            if(that.startTime == ''){
              return this.$toast('开课开始时间不能为空',2000)
            }
             if(that.endTime == ''){
              return this.$toast('开课结束时间不能为空',2000)
            }
            obj.start = new Date(that.startTime).toUTCString();
            obj.end = new Date(that.endTime).toUTCString();
            obj.status = '';
            obj.user_id_list = [];
            // console.log(JSON.stringify(obj))
            modifyCourseStatus(JSON.stringify(obj)).then(res=> {
                if(res.code==200){
                    that.reload();
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        clickStartTime() {
        this.pickerOptionsStart.disabledDate = time => {
          if (this.endTime) {
            if (time.getTime() > new Date(this.endTime).getTime()) {
              return true
            }
            if (time.getTime() < Date.now() - 8.64e7) {
              return true
            }
          } else {
            if (time.getTime() < Date.now() - 8.64e7) {
              return true
            }
          }
        }
      },
      clickEndTime(){
        this.pickerOptionsEnd.disabledDate = time => {
          if (this.startTime) {
            return (
              time.getTime() > Date.now || time.getTime() <= new Date(this.startTime).getTime()
            )
          } else {
            return time.getTime() < Date.now()
          }
        }
      },
        back(){
            //返回课堂管理
            let that = this;

            if(that.backNum==1){
               that.$router.push({path:'/teacher'}).catch((err)=>{
                   console.log(err)
               })
               that.$store.commit("updateNavindex", 0);
            }else{
                that.$router.push({path:'/teacher/lessonPreparationManagement'}).catch((err)=>{
                   console.log(err)
               })
               that.$store.commit("updateNavindex", 1);
            }
        },

        //页面nav切换
        linkDetails(item,num){
          let that = this;
          that.navindex = num;
          that.$store.commit("updateTeacherNavindex",num);
          sessionStorage.setItem("store",JSON.stringify(this.$store.state))

           sessionStorage.removeItem('show_courseOutline');
          sessionStorage.removeItem('show_courseSection');

          if(num==2){
              that.getCourseById();
          }else{
               that.reload()
          }
          that.showStudentList = false;
        },



        //班级选择确认
        sureCheckClass(){
            this.showStudentList = true
        },
         //班级列表
        searchClass(){
            let that = this;
            searchClass().then(res=> {
                if(res.code==200){
                    that.classList = res.data
                    that.checkedClass();
                    /*
                    for(let i =0;i<res.data.length;i++){
                        let objCount = {}
                        objCount.classId= res.data[i].id;
                        //查看班级人数
                        searchClassCount(objCount).then(res1=> {
                            if(res.code==200){
                                that.$set(that.classList[i], "number", res1.data);
                            }else{
                                that.$toast(res.message,3000)
                            }
                        })
                    }*/
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },

       //页面初始化班级选中
      checkedClass(){
        let that = this;
        //classesList已经选中的班级     //班级列表classList

        for (let i=0; i<that.classList.length; i++) {
             that.$set(that.classList[i], 'checked',0)
             that.$set(that.classList[i],'user_id_list',[])
            for (let j=0; j<that.classesList.length; j++) {
                if (that.classList[i].id == that.classesList[j].class_id) {
                    //执行业务
                    if(that.classesList[j].completed){
                    that.$set(that.classList[i], 'checked',1)
                    that.$set(that.classList[i],'user_id_list',[])

                    }else{
                    that.$set(that.classList[i], 'checked',2)
                        let obj = {};
                        obj.id = that.classList[i].id;
                        obj.name = that.classList[i].name;
                        obj.user_id_list = that.classesList[j].user_id_list;
                        that.$set(that.classList[i],'user_id_list',that.classesList[j].user_id_list);

                    }


                }
            }

        }

        // console.log(that.classList)


      },

      showopenClass(){
        let that =this
        if (that.type==0) {
            return true
        }else{
            if (that.status==0) {
             return true
            }else {
             return false
            }
        }
      },

      canCaozuo(){
          let that = this
        if (that.status!=-1&&that.type==1) {
            return 1
        }else {
            return 0
        }
      },


     //班级选中事件
     checkClass(params){
         let that = this
        let index = params[1]
        let checked = params[2];

        //console.log(params);
        if(checked==0){
           that.$set(that.classList[index], 'checked',1)
           that.$set(that.classList[index], 'user_id_list',[])
        }else{
           that.$set(that.classList[index], 'checked',0)
           that.$set(that.classList[index], 'user_id_list',[])
        }
     }


    },
    filters: {

      }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
.course_edit{margin-left: 15px; vertical-align:middle; margin-top: -3px;}
</style>
