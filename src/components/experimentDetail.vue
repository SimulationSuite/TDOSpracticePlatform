<!--管理员端实验详情-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false"
      class="dialog_pagination admin_dialog_newExperiment"
      :visible.sync="detailShow"
      width="1100px"
    >
    <div slot="title" class="dialog_header">实验详情</div>
    <div class="experDetail_main">
        <div class="top clearfix">
            <div class="pic"><img :src="experiment.pic_url"/></div>
            <div class="rightInfo">
                <p class="p-name textline1">{{experiment.name}}</p>
                <div class="p-ItsCourse">
                    <!-- 所属课程： -->
                </div>
                <div class="btnbox"><a class="btnDefault pointer" v-if="canClick" @click="startExperiment">进入实验</a></div>
            </div>
        </div>
        <div class="nav">
            <div class="nav-cel"><a class="pointer" :class="{'active':activeIndex==1}" @click="activeIndex=1">基本信息</a></div>
            <div class="nav-cel"><a class="pointer" :class="{'active':activeIndex==2}" @click="activeIndex=2">虚拟机引用</a></div>
            <div class="nav-cel"><a class="pointer" :class="{'active':activeIndex==3}" @click="activeIndex=3">报告要求</a></div>
            <!--
            <div class="nav-cel"><a class="pointer" :class="{'active':activeIndex==4}" @click="activeIndex=4">实验任务</a></div>
            -->
        </div>

        <div class="info_main" v-if="activeIndex==1">
            <div><p>实验时长：{{experiment.duration}}分钟</p></div>
            <div><p>引用虚拟机：{{experiment.imagesinfo!=null?experiment.imagesinfo.length:0}}台虚拟机</p></div>
            <div>
                <p class="pt">实验简介：</p>
                <p>{{experiment.introduce}}</p>
            </div>
            <!-- <div>
                <p class="pt">实验建议：</p>
                <p>介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本</p>
            </div> -->
        </div>

         <div class="info_main" v-if="activeIndex==2">
            <div class="tablex_box  detail_table">
                <!--镜像列表-->
                <el-table
                class="center-tab tab-userList"
                :data="Imagelibraries"

                style="width: 100%"
                >


                <el-table-column prop="name" label="名称" width="240">
                </el-table-column>
                <el-table-column prop="type" label="镜像类型">
                    <template slot-scope="scope">
                    <span>{{
                        scope.row.kind == 1 ? "图形化界面" : "命令行"
                    }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="容量"> </el-table-column>
                <el-table-column prop="introduction" label="简介" width="280">
                </el-table-column>

                </el-table>
            </div>
         </div>

         <div class="info_main" v-if="activeIndex==3">

            <div>
                <p class="pt">实验报告需求：</p>
                <p>{{experiment.report_requirement}}</p>
            </div>

        </div>

        <div class="info_main" v-if="activeIndex==4">

            <div>
                <p class="pt">任务1：</p>
                <p>介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本</p>
            </div>
            <div>
                <p class="pt">任务1：</p>
                <p>介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本介绍文本</p>
            </div>
        </div>

    </div>
    </el-dialog>
  </div>
</template>
<script>
import { findAllByType } from "@/API/api";
export default {
    data(){
        return{
          detailShow:false,
          activeIndex:1,
           Imagelibraries:[
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:1,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:1,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:1,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
                {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'}
            ],
            experiment:{},//实验详情
            courseId:'',
            canClick:false,

        }
    },
    props:{
        id:{
            default:0
        }
    },

    methods:{
        //点击详情，弹出实验详情框
        click_Detail(experId,courseId){
            let that = this;
            that.detailShow = true
            that.courseId=courseId
            that.activeIndex = 1;
            that.canClick=false;
            that.findAllByType(experId)
        },
        //点击进入实验
        startExperiment(){
            let that = this;
            //权限
            let  level = sessionStorage.getItem('p_p-authority')
            that.$router.push({path:'/experiment',query:{
                authority:this.$Base64.encode(level),
                userid:sessionStorage.getItem("userId"),
                experimentId: that.experiment.id,
                courseId:that.courseId
                }}).catch((err) => {
              console.log( err);
           });
        },
        //获取实验详情
        findAllByType(experId){
            let that = this
            let obj = {}
            obj.id = experId
            obj.type = 0
            obj.perPage=1
            obj.experiment_type=0
            obj.page=1
            findAllByType(obj).then(res=>{
                if (res.code==200) {
                    that.canClick=true;
                    //console.log(res.data)
                    that.experiment = res.data
                    for(let i = 0;i<res.data.imagesinfo.length;i++){
                        res.data.imagesinfo[i].size = (res.data.imagesinfo[i].size/(1024 * 1024)).toFixed(2) + "MB"
                    }
                    that.Imagelibraries = res.data.imagesinfo
                    that.experiment.pic_url = that.$store.state.pic_Url+that.experiment.pic_url
                }else {
                    that.$toast(res.message,3000)
                }
            })
        },   //创建实验
    }
}
</script>
<style lang="less" scoped>
.experDetail_main{margin:20px;
.pic{float:left;width:400px;height: 200px; border:1px  solid @border;.borderRadius(5px,5px,5px,5px);overflow: hidden;}
.pic img{width:100%;height: 100%;}
.rightInfo{margin-left:420px;min-height:140px;margin-right: 20px;color:@tabcolor; padding-bottom: 60px; position: relative;}
.p-name{font-size: 24px;}
.p-ItsCourse{font-size: 18px; padding-top:10px}
.btnbox{position:absolute;bottom: 0px; left:0px;}

.nav{
    font-size: 0px; background:@basecolor;.borderRadius(5px,5px,5px,5px); margin-top:20px; margin-bottom: 20px;
    .nav-cel{display: inline-block; width: 25%;
    a{margin:4px 5px; display: block; line-height: 40px; font-size: 18px; color: #fff; text-align: center;.borderRadius(5px,5px,5px,5px);}
    }
    a.active{background: #fff; color: @basecolor;}
}
  .info_main{font-size: 18px;color:@tabcolor; min-height:300px;
  >div{padding: 4px 0;}
  .pt{padding-bottom: 10px;}
  }
}
</style>
