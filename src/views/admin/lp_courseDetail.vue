<template>
    <div class="pp_main boxsizing detail_main Scroll_detail_main" ref="detail_main" id="detail_main">
        <div class="container">
            <div class="pageTab clearfix">
                <div class="mess">
                    当前位置：<a class="pointer" @click="back">课程管理</a> > <span>{{coursrName}}</span>
                </div>
            </div>
        </div>
        <div class="container container_info" ref="container_info">
            <div class="info_box">


                <!--头部课程详细信息-->
                <div class="top_info ">
                     <div class="c_pic"><img :src="picurl"/></div>
                     <div class="c_info">
                         <div class="right_info">
                             <div class="info_detail_box">
                                <p class="r_name">{{coursrName}}</p>

                                <div class="d-cel">
                                    共有{{chapter_number}}个章节，{{small_section_number}}个知识点
                                </div>
                                <!--已开课才有这个信息-->
                                <div class="d-cel clearfix">
                                    <div class="fl">{{time}}</div>
                                    <div class="fr">{{numbers}}人学习</div>
                                </div>
                                <div class="line"></div>
                                 <el-scrollbar class="content_el-scrollbar">
                                    <div class="d-cel">
                                        {{introduction}}
                                    </div>
                                 </el-scrollbar>
                                <!--如果状态已开课之后就不可以在修改，按钮不显示-->
                                <div class="btnbox">
                                    <a class="btnDefault pointer btn-course" @click="resetDialog = true" v-if="status == 0">确认发布</a>
                                </div>
                             </div>
                         </div>
                     </div>
                </div>

                 <div class="detail_nav">
                    <a  :class="{'cur':index==navindex}" v-for="(item,index) in menu" :key="index" @click="linkDetails(item,index)">{{item.name}}</a>
                </div>

                 <!--课程大纲-->
                <chapter :courseId="courseId" v-if="navindex==0" :chapters="courseChapters" :isHasData="isHasData"  :status="status"></chapter>




                <!--课程实验-->
                <experiment :role="role" v-if="navindex==1" :status="status" :typeData = "type"></experiment>

                <!--课程课件-->
                <courseware v-if="navindex==2" :status="status" :typeData = "type" @getScroll="getScroll"></courseware>

                <coursework v-if="navindex==3" :status="status" :noEdit = "typeWork"></coursework>


            </div>


        </div>

        <!--重置-->
        <el-dialog
                :visible.sync="resetDialog"
                width="500px"
                class="personDialog"
        >
            <div slot="title" class="dialog_header">课程发布</div>
            <!--
           <div class="editMain" style="margin:0 50px" >
             <el-form ref="form" label-width="80px">
               <el-form-item label="输入密码">
                 <el-input  type="password" placeholder="请输入密码" maxlength="20" v-model="password" v-emoji></el-input>
               </el-form-item>

               <el-form-item label="确认密码">
                 <el-input type="password" placeholder="请输入确认密码" maxlength="20" v-model="confirmPassword" v-emoji></el-input>
               </el-form-item>

             </el-form>
           </div>
           -->
            <div class="confirm_dialog_body" style="padding-bottom:20px">
                <p class="dialog_mess">
                    <span class="span_icon icon_waring">是否发布课程！</span>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
        <button class="btnDefault" @click="resetDialog = false">取消</button>
        <button class="btnDefault" @click="modifyCourseStatus">确认</button>
      </span>
        </el-dialog>

    </div>
</template>
<script>

import chapter from "@/components/d_chapter_box.vue";//课程大纲
import experiment from "@/components/d_experiment_box.vue";//课程实验
import courseware from "@/components/d_courseware_box.vue";//课程课件
import coursework from "@/components/d_coursework_box.vue";//课程作业
import {getCourseById,modifyCourseStatus} from '@/API/api';
export default {
   inject:['reload'],
    data(){
        return{
            coursrName:'',//课程名称
            introduction:'',
            status:'',
            time:'',
            chapter_number:'',
            section_number:'',
            numbers:'',
            type:0,
            typeWork:'',

           backNum:1,
           navindex:0,
           menu:[
               {name:'课程大纲'},

               {name:'实验库'},
               {name:'课件库'},
               {name:'作业'}
            ],
           isHasData:true,//传给课程大纲组件默认有数据
           picurl:null,

            startTime:'',//课程开始时间
            endTime:'',//课程结束时间
              // 开始日期 :picker-options 中引用
            pickerOptionsStart: {},
            // 结束日期 :picker-options 中引用
            pickerOptionsEnd: {},
            isSetTime:false,//设置时间是否设置(这个根据课程是否是已开课)



            showStudentList:false,//是否显示学生列表

            courseId:'',
            role:1,//代表管理员端
            courseChapters:[],
            resetDialog:false,//重置密码是否弹出
            show_courseOutline:{},//当前展示的课程章节，新建小节还是展示小节列表
            show_courseSection:{},//当前展开的是哪个小节
            small_section_number:0,//小节数量
            scrollTimer:null,
        }
    },
    components:{chapter,experiment,courseware,coursework},
    created(){
        let that = this;
        that.backNum = that.$route.query.back?that.$Base64.decode(that.$route.query.back):2;
        that.courseId = that.$route.query.courseId;
        if(sessionStorage.getItem('slt_Experiment') !=null &&　sessionStorage.getItem('slt_Experiment') == 1){
            sessionStorage.removeItem('slt_Experiment')
            that.$store.commit("updateAdminNavindex",1);
        }
        that.navindex = that.$store.state.adminNavindex;
    },
   beforeDestroy(){
        let that = this;
        that.$store.commit("updateAdminNavindex",0);
        
        if(that.scrollTimer!=null){
          clearTimeout(that.scrollTimer)
        }


    },
    mounted(){
        let that = this;
        that.show_courseOutline = sessionStorage.getItem('show_courseOutline')?JSON.parse(sessionStorage.getItem('show_courseOutline')):{};
        that.show_courseSection = sessionStorage.getItem('show_courseSection')?JSON.parse(sessionStorage.getItem('show_courseSection')):{};
       that.getCourseById();
    },
    methods:{
        getScroll(){
            let that = this;
            this.$nextTick(() => {
                var h = 0;
                var h1 = 0          
              that.scrollTimer = setTimeout(() => {
                   h =  document.getElementById("app").offsetHeight;
                   h1 = that.$refs.container_info.offsetHeight;
                   let scroll_h = (parseInt(h1)-parseInt(h))+135;            
                document.documentElement.scrollTop  = scroll_h;
              },100)
      
            })
         
        },
        getCourseById(){
            let that = this;
            let obj = {};
            obj.course_id = this.$route.query.courseId
            getCourseById(obj).then(res=> {
                if(res.code==200){
                    console.log(res.data)
                    that.picurl = that.$store.state.pic_Url+ res.data.pic_url;
                    that.coursrName = res.data.name;
                    that.chapter_number = res.data.chapter_number
                    that.small_section_number = res.data.small_section_number;
                    if(res.data.start_at != null && res.data.end_at != null){
                        that.time = res.data.start_at.replace('T', ' ') + '-' + res.data.end_at.replace('T', ' ');
                    }else{
                        that.time = "---";
                    }
                    that.numbers = res.data.numbers == null ? 0 : res.data.numbers
                    that.introduction = res.data.introduction;
                    that.course = res.data
                    that.status = res.data.status
                    that.status == 0 ? that.typeWork = 1:that.typeWork = 0;
                    that.courseChapters = res.data.chapters
                    that.addParamShow(that.courseChapters)
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        clickStartTime() {
        this.pickerOptionsStart.disabledDate = time => {0
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
        //发布课程
        modifyCourseStatus(){
            let that = this;
            let obj = {};
            obj.owner_id = sessionStorage.getItem('userId');
            obj.course_id = that.$route.query.courseId;
            obj.start = '';
            //that.endTime=that.endTime.getFullYear() + '-' + (that.endTime.getMonth() + 1) + '-' + that.endTime.getDate();

            obj.end = '';
            obj.user_id_list = [];
            obj.status = 1;
            modifyCourseStatus(obj).then(res=> {
                if(res.code==200){
                   // alert("111")
                    that.resetDialog = false;
                    that.$toast('课程已发布')
                    that.$router.push({path:'/admin/courseManagement'}).catch((err)=>{
                        console.log(err)
                    })
                }else{
                    this.$toast(res.message,2000)
                }
            })
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

            that.$router.push({path:'/admin/courseManagement'}).catch((err)=>{
                console.log(err)
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

        //页面nav切换
        linkDetails(item,num){
          let that = this;
          that.navindex = num;
          that.$store.commit("updateAdminNavindex",num);
          sessionStorage.setItem("store",JSON.stringify(this.$store.state))
          that.showStudentList = false;
          that.reload()
          sessionStorage.removeItem('show_courseOutline');
          sessionStorage.removeItem('show_courseSection');

        },


        //学生选择确认
        sureStudent(){
          let that = this;
          that.showStudentList = false
          console.log('选择学生确认')

        },
        //学生列表返回班级列表
        backClass(){
          this.showStudentList = false;

        },
        //班级选择确认
        sureCheckClass(){
            this.showStudentList = true
        }

    },
    filters: {

      },

}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>
