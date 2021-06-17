<template>
    <div class="pp_main boxsizing detail_main Scroll_detail_main" ref="detail_main" id="detail_main">
        <div class="container">
            <div class="pageTab clearfix">
                <div class="mess">
                    当前位置：<a class="pointer" @click="back">我的课程</a> > <span>{{coursrName}}</span>
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
                                    共有{{chapter_number}}个章节，{{section_number}}个知识点
                                </div>
                                <!--已开课才有这个信息-->
                                <div class="d-cel clearfix">
                                    <div class="fl">{{time}}</div>
                                    <div class="fr">{{numbers}}人学习</div>
                                </div>
                                <div class="line"></div>
                                 <el-scrollbar class="content_el-scrollbar">
                                    <div class="d-cel">
                                        包含内容：{{introduction}}
                                    </div>
                                 </el-scrollbar>

                             </div>
                         </div>
                     </div>
                </div>

                 <div class="detail_nav">
                    <a  :class="{'cur':index==navindex}" v-for="(item,index) in menu" :key="index" @click="linkDetails(item,index)">{{item.name}}</a>
                </div>

                 <!--课程大纲-->
                <chapter :courseId="courseId" v-if="navindex==0" :role="role" :chapters="courseChapters" :isHasData="isHasData"></chapter>




                <!--课程实验-->
                <experiment v-if="navindex==1" :role="role"></experiment>

                <!--课程课件-->
                <courseware v-if="navindex==2" :role="role" @getScroll="getScroll"></courseware>




            </div>


        </div>
    </div>
</template>
<script>

import chapter from "@/components/student_chapter_box.vue";//课程大纲
import experiment from "@/components/d_experiment_box.vue";//课程实验
import courseware from "@/components/d_courseware_box.vue";//课程课件

import {getCourseById} from '@/API/api';
export default {
    data(){
        return{
            coursrName:'学生端课程',//课程名称
            introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容 描述内容描述内容描述内容描述内容描述内容描述内容',
            time:'课程时间：2020.9.12-2020.10.12',
            chapter_number:10,
            section_number:20,
            numbers:'40',

           navindex:0,
           menu:[
               {name:'课程大纲'},
               {name:'课程实验'},
               {name:'课程课件'},
            ],

           picurl:'',

            startTime:'',//课程开始时间
            endTime:'',//课程结束时间
              // 开始日期 :picker-options 中引用
            pickerOptionsStart: {},
            // 结束日期 :picker-options 中引用
            pickerOptionsEnd: {},
            isSetTime:false,//设置时间是否设置(这个根据课程是否是已开课)

            courseChapters:[],
            isHasData:true,//传给课程大纲组件默认有数据

            showStudentList:false,//是否显示学生列表

            courseId:'',
            course:'11',
            role:3,//传给子组件角色表示课程详情点击的是3,

            scrollTimer:null
        }
    },
    components:{chapter,experiment,courseware},
    created(){
        let that = this;

        that.courseId = this.$route.query.courseId
        that.course = 1;
         if(sessionStorage.getItem('slt_Experiment') !=null &&　sessionStorage.getItem('slt_Experiment') == 1){
            sessionStorage.removeItem('slt_Experiment')
            that.$store.commit("updateStudentNavindex",1);
        }
       that.navindex = that.$store.state.studentNavindex;

    },
     beforeDestroy(){
        let that = this;
        that.$store.commit("updateStudentNavindex",0);
        if(that.scrollTimer!=null){
          clearTimeout(that.scrollTimer)
        }
    },
    mounted(){
        let that = this;
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
            obj.course_id = that.courseId
            getCourseById(obj).then(res=> {
                if(res.code==200){
                  //console.log(res.data)
                    that.coursrName = res.data.name;
                    that.chapter_number = res.data.chapter_number
                    that.section_number = res.data.small_section_number;
                    that.picurl = that.$store.state.pic_Url+ res.data.pic_url;
                    if(res.data.start_at != null && res.data.end_at != null){
                        that.time = res.data.start_at.replace('T', ' ') + '-' + res.data.end_at.replace('T', ' ');
                    }else{
                        that.time = "---";
                    }
                    that.numbers = res.data.numbers == null ? 0 : res.data.numbers
                    that.introduction = res.data.introduction;
                    that.course = res.data
                    that.courseChapters = res.data.chapters;
                    that.addParamShow(that.courseChapters)
                    if(res.data.chapters.length==0){
                      that.isHasData = false
                    }
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },

         //章节下拉显示添加参数
        addParamShow(array){
             array.sort(this.compare('order'))
             for(var i=0;i<array.length;i++){
                this.$set(array[i], 'show', false);
                array[i].sections.sort(this.compare('order'))
                for(var j=0;j<array[i].sections.length;j++){
                    this.$set(array[i].sections[j], 'show', false);
                    array[i].sections[j].small_sections.sort(this.compare('order'))

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

            that.$router.push({path:'/student'}).catch((err)=>{
                //console.log(err)
            })
        },

        //页面nav切换
        linkDetails(item,num){
          let that = this;
          that.navindex = num;
           that.$store.commit("updateStudentNavindex",num);
            sessionStorage.setItem("store",JSON.stringify(this.$store.state))
          that.showStudentList = false
        },


        //学生选择确认
        sureStudent(){
          let that = this;
          that.showStudentList = false
          //console.log('选择学生确认')

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

      }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);

.content_el-scrollbar{height:110px;}

</style>

