<!--课程实验-->
<template>
    <div class="experiment_box">
         <div class="exper_main">
            <courseNav @getData = "getData"></courseNav>
            <div class="right_box">
                <div class="add_btn_box">
                    <a class="btnDefault pointer" @click="click_new" v-if="isdeleteStatus == 1?showAdd():false">新增实验</a>
                </div>
                <template v-if="isHasData">
                <div class="list_box">
                    <ul class="list_ul clearfix " :class="{'student_list_ul':role==3}">
                        <li v-for="(item,index) in experimentList" :key="index">
                            <div class="info pointer"  @click="link_Detail(item.id)">
                                <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if=" isdeleteStatus == 1?showDelete():false">
                                   <a class="icon icon_close pointer" :class="{'admin_icon_close':role==1}" @click.stop="getDelete(item.id)"></a>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="设置" placement="top" v-if="isdeleteStatus == 1?showSet():false">
                                   <a class="icon icon_set pointer" @click.stop="setinfo(item),experiment = item"></a>
                                </el-tooltip>
                                 <div class="pic">
                                    <div class="pic_box"><img :src="item.pic_url"/></div>
                                </div>
                                <div style="height:74px">
                                <p class="p-text textline1" :style="{'padding-top':item.end_at==null?'10px':'0px'}">{{item.name}}</p>
                                <p class="p-text textline1" >实验时长：{{item.duration}}分钟</p>
                                <p class="p-text textline1" v-if="role != 1 && item.end_at!=null">{{'实验报告截止时间：'+item.end_at.substring(0,item.end_at.indexOf("T"))}}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="page_box">
                    <el-pagination
                        background
                        :current-page="curPage"
                        :page-size="perPage"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next,jumper"
                        :total="total"
                    >
                    </el-pagination>
                </div>
                </template>
                <nodata dataMess="当前暂无实验"  v-if="!isHasData"></nodata>
            </div>
         </div>
         <!--新增实验弹窗-->
         <newdialog  ref="newdialog"  @findAllByType='sectionExperment(arguments)'></newdialog>
         <experimentDetail ref="experimentDetail"></experimentDetail>

         <!--是否删除-->
        <el-dialog :visible.sync="isDelete" width="500px">
            <div slot="title" class="dialog_header">警告!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <span class="span_icon icon_waring">确定要删除当前实验吗？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="deleteExperiment()">确 认</a>
                <a class="btnDefault" @click="isDelete = false">取 消</a>
            </div>
        </el-dialog>

        <!--设置时间-->
        <el-dialog :visible.sync="isSet" width="500px" @close="time='',reportinfo='',endTime=''">
            <div slot="title" class="dialog_header">请设置时间!</div>
            <div class="setform">

                <div class="set-col">
                    <p class="ptitle">实验时长：</p>
                    <div class="dselect">
                        <el-select v-model="time" placeholder="请选择" style="width:100%">
                            <el-option
                            v-for="item in timeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                 <div class="set-col">
                    <p class="ptitle">报告要求：</p>
                    <div class="dselect">
                        <el-input type="textarea" :rows="5" maxlength="200" v-model="reportinfo" resize="none"/>
                    </div>
                </div>
                 <div class="set-col">
                    <p class="ptitle">实验报告截止时间：</p>
                    <div class="dselect">
                        <el-date-picker style="width:100%" :picker-options="pickerOptions"
                            v-model="endTime"
                            @change="changeDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="updateExperiment">确 认</a>
                <a class="btnDefault" @click="isSet = false">取 消</a>
            </div>
        </el-dialog>


    </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
import newdialog from "@/components/teacher_new_experiment.vue";
import experimentDetail from '@/components/experimentDetail';
import {findParentCategory,findChildCategory,findAllByCategoryId,findAllByType,unbindExperiments,updateExperiment} from '@/API/api';
import nodata from '@/components/noData'
export default {
    data(){
        return{
            experimentList:[
            ],
            perPage:8, //8个实验一页
            curPage:1,//设备列表
            isDelete:false,//是否删除
            isSet:false,//设置
            time:'',
            timeOptions: [{
                value: '30',
                label: '30分钟'
                }, {
                value: '45',
                label: '45分钟'
                }, {
                value: '60',
                label: '60分钟'
                }, {
                value: '75',
                label: '75分钟'
                }, {
                value: '90',
                label: '90分钟'
                },{
                value: '105',
                label: '105分钟'
                },{
                value: '120',
                label: '120分钟'
                }
            ],
             pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            } ,
            endTime:'',
            reportinfo:'',//报告要求
            sindex:'',
            cindex:'',
            experimentId:'',
            experiment:{},
            total:1,
            count:0,
            type:'',
            isHasData:true,//是否有数据 默认有数据
            isdeleteStatus:0,//节下面才能删除实验，默认节下面是1
            authority:0
        }
    },
    props:{
        role:{
            default:0, //默认是0传过来3表示是学生点击课程详情
        },
        status:{
          default:0,
        },
        typeData:{
          default:0,
        },
        course_info: {},
    },
    watch: {
      status: {
        handler:function(val, olVal) {


        }


      },
    },
    created(){
        let that = this;
        that.time = that.timeOptions[1].value
        that.sid = 1


    },
    components:{
        courseNav,newdialog,experimentDetail,nodata
    },
    mounted(){
        let that = this;
        that.getAllExperiment();
    },
    methods:{
        findAllByCategoryId(category_id,name,perPage,page){
            let that = this;
            let obj = {}
            obj.category_id = category_id;
            obj.name = name;
            obj.perPage = perPage;
            obj.page = page;
            findAllByCategoryId(obj).then(res=> {
                if(res.code==200){
                    that.total = res.data.total
                    res.data.total==0 ? that.isHasData = false :that.isHasData = true
                    that.experimentList = res.data.list;
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        findAllByType(id,type,perPage,page){
            let that = this;
            let obj = {}
            obj.id = id;
            obj.type = type;
            obj.perPage = perPage;
            obj.page = page;
            obj.experiment_type=1
            findAllByType(obj).then(res=> {
                if(res.code==200){

                    that.total = res.data.total
                     res.data.total==0 ? that.isHasData = false :that.isHasData = true
                    that.experimentList  = res.data.list;
                    for (let index = 0; index <  that.experimentList.length; index++) {
                    that.experimentList[index].pic_url = that.$store.state.pic_Url+ that.experimentList[index].pic_url

                   }
                    that.count = res.data.total;
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        getAllExperiment(){
            let that = this;
            let id = that.$route.query.courseId
            that.findAllByType(id,1,8,1);
        },
        getDelete(id){
          let that = this
          that.isDelete = true;
          that.experimentId = id;
        },
         showDelete(){
      let that = this

      if (sessionStorage.getItem('p_p-authority')==0) {
        // 学生直接没有删除按钮
        return false
      }else {

          if (sessionStorage.getItem('p_p-authority')==2) {
            //管理员判断status
            if (that.status==0) {
              return true
            }else {
              return false
            }
          }else {
            //判断教师端
            if (that.status==0&&that.typeData==1) {
              return true
            }else {
              return false
            }
          }


      }
    },
    showAdd(){
      let that = this
      if (sessionStorage.getItem('p_p-authority')==0) {
        // 学生直接没有删除按钮
        return false
      }else {

          if (sessionStorage.getItem('p_p-authority')==2) {
            //管理员判断status
            if (that.status==0) {
              return true
            }else {
              return false
            }
          }else {
            //判断教师端

            if (that.status!=-1&&that.typeData==1) {
              return true
            }else {
              return false
            }


          }


      }
    },
     showSet(){
      let that = this
      if (sessionStorage.getItem('p_p-authority')==0) {
        // 学生直接没有删除按钮
        return false
      }else {

          if (sessionStorage.getItem('p_p-authority')==2) {
            //管理员判断status

              return false

          }else {
            //判断教师端

            if (that.status!=-1&&that.typeData==1) {
              return true
            }else {
              return false
            }


          }


      }
    },
        //删除实验
        deleteExperiment(){
            let that = this
            let obj = {};
            obj.experiment_id = that.experimentId;
            obj.section_id = that.sindex;
            unbindExperiments(obj).then(res=> {
                if(res.code==200){
                    that.isDelete = false;
                    //that.getAllExperiment();
                    that.findAllByType(that.sindex,3,8,1)
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        //设置截至时间
        updateExperiment(){
            let that = this
            let obj={}

            // console.log(that.endTime)
            if (that.reportinfo==''||that.reportinfo==null) {
                 return  that.$toast('请输入实验报告要求',2000)
            }
            if (that.endTime==null||that.endTime=='') {
                return that.$toast('请设置实验报告截止时间',2000)
            }
            if (new Date(that.endTime).getTime()<new Date(that.course_info.start_at.substring(0, that.course_info.end_at.indexOf("T"))).getTime()) {
                 return  that.$toast('实验报告截止时间不能小于课程开始时间',2000)
            }
            if (new Date(that.endTime).getTime()>new Date(that.course_info.end_at.substring(0, that.course_info.end_at.indexOf("T"))).getTime()) {
                 return  that.$toast('实验报告截止时间不能大于课程结束时间',2000)

            }


            obj.id=that.experiment.id
            obj.duration = that.time
            obj.end_at = new Date(that.endTime).toUTCString();
            obj.report_requirement = that.reportinfo
            that.isSet=false
            // console.log(obj)
            updateExperiment(obj).then(res=>{
                if (res.code==200) {
                    that.isdeleteStatus = '';
                    if(that.sindex != "" && that.cindex != ''){
                        that.isdeleteStatus = 1;
                        that.findAllByType(that.sindex,3,8,1)
                    }else if(that.sindex == "" && that.cindex != ''){
                        that.findAllByType(that.cindex,2,8,1)
                    }else if(that.sindex == "" && that.cindex == ''){
                        that.findAllByType(that.$route.query.courseId,1,8,1)
                    }

                } else {
                    this.$toast(res.message,2000)
                }

            })


        },
         //底部分页
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            let that = this
            that.isdeleteStatus = '';
            if(that.sindex != "" && that.cindex != ''){
                that.isdeleteStatus = 1;
                that.findAllByType(that.sindex,3,8,val)
            }else if(that.sindex == "" && that.cindex != ''){
                that.findAllByType(that.cindex,2,8,val)
            }else if(that.sindex == "" && that.cindex == ''){
                that.findAllByType(that.$route.query.courseId,1,8,val)
            }
        },
        click_new(){
            let that = this;
            that.sid = that.sindex;
            // console.log(that.cindex+'节'+that.sindex)

            that.$refs.newdialog.click_new(that.sid,that.count,that.sindex);

        },
         changeDate(val) {
            let that = this;
            if (val!=null) {
                that.endTime=val
            }else {
                that.endTime=''
            }
            // console.log(that.endTime)
            // alert(that.value2.length);
         },
         //查看实验详情
        link_Detail(id){
          let that = this;
          that.isNewExperiment = true;
          if(that.cindex!=''&&that.sindex!=''){
              console.log()
          that.$refs.experimentDetail.click_Detail(id,that.$route.query.courseId);
}
        },
        getData(data){
            let that = this;
            // console.log(data.cindex)
            // console.log(data.sindex)
            that.sindex = data.sindex;
            that.cindex = data.cindex;
            that.isdeleteStatus = '';
            if(data.sindex != "" && that.cindex != ''){
                that.isdeleteStatus = 1;
                that.findAllByType(data.sindex,3,8,1)
            }else if(data.sindex == "" && that.cindex != ''){
                that.findAllByType(data.cindex,2,8,1)
            }else if(data.sindex == "" && that.cindex == ''){
                that.findAllByType(that.$route.query.courseId,1,8,1)
            }
        },
        sectionExperment(array){
          let that = this;
           that.findAllByType(array[0],array[1],array[2],array[3])
        },
        //设置需要的参数复制
        setinfo(item){
            let that = this
            if(that.course_info.end_at == "" || that.course_info.end_at ==null){
                return that.$toast("该课程尚未设置开课时间，请先进行设置！", 3000);
            }



            for (let index = 0; index < that.timeOptions.length; index++) {
              if (that.timeOptions[index].value==item.duration) {
                  that.time = that.timeOptions[index].value
                  break
              }

            }
            that.endTime=item.end_at!=null?item.end_at.substring(0,item.end_at.indexOf("T")):''
            that.reportinfo = item.report_requirement==null?'':item.report_requirement
            if (that.endTime!=''&&that.reportinfo!='') {
                 return that.$toast("该实验报告已设置过，无需再次设置", 3000);
            }
            that.isSet=true
            // console.log('课程详情'+that.course_info.end_at)
        },
    }
}
</script>
<style lang="less" scoped>
.experiment_box{
    margin-top: 30px;
    .exper_main{width:100%;height: 100%; position: relative;;}
    .right_box{ margin-left: 330px;}
}

.page_box{text-align:right;}
.add_btn_box{padding-bottom:15px; text-align:right;}

/*列表*/
.list_box{ overflow: hidden; min-height:500px;
    .list_ul{ margin-left: -10px; margin-right: -10px;
        li{width:25%;min-height: 40px;float: left; margin-bottom: 20px; }
        .pic{width:100%; margin-bottom: 10px;
          .pic_box{padding-bottom:50%; background:blanchedalmond;.borderRadius(5px,5px,0,0); position: relative;}
          img{width:100%;height:100%;position: absolute;}
        }
        /*.trans{position: absolute;width:100%;height: 100%;left:0px;top:0px; background: rgba(0,0,0,.1);} */
        .info{margin: 0 10px; min-height: 30px;background: @background; padding: 40px 0 20px 0; position:relative;}
        .p-text{font-size: 16px;color:@fontColor; text-align: center; padding: 2px 8px; line-height:20px; height:20px;}
        .icon{width: 20px;height: 20px;display: block; position:absolute;top:10px}
        .icon_close{background: url(../assets/img/n_close.png) center no-repeat;right:28px}
        .icon_set{background: url(../assets/img/n_set.png) center no-repeat;right:5px}
        .admin_icon_close{right: 15px;}
    }
    .student_list_ul{
        .info{padding-top: 0px;}
    }
}

.setform{margin: 0 30px;
  .ptitle{font-size: 16px; padding:10px 0;}
}
.dselect{width:100%;}

@media screen and (max-width:1440px) {
    .experiment_box{
        .right_box{ margin-left:290px;}
    }
}
</style>
