<template>
    <div class="experiment_pagewrap boxsizing">
        <div class="e-header">

            <div class="name textline1">正在进行的实验：{{experiment.name}}</div>

            <div class="timeBox" v-if="showtime">{{time}}</div>

            <div class="operationBox">

                <a class="a-opera pointer"  @click="makeImg"  v-if="isOpen && authority==0 &&experiment.end_at!=null">
                    <i><img src="../assets/img/exper_screen.png"/></i>
                    <span>一键截屏</span>
                </a>
                <a class="a-opera pointer" v-if="isOpen && authority==0 &&experiment.end_at!=null" @click="isEdit=true">
                     <i><img src="../assets/img/exper_download.png"/></i>
                    <span>下载代码</span>
                </a>
                <a class="a-opera pointer" @click="click_back" v-if="!isOpen">
                    <i><img src="../assets/img/exper_back.png"/></i>
                    <span>返回</span>
                </a>

                <a class="a-opera pointer" v-if="isOpen" @click="isClose=true,type=2,useractions=true">
                    <i><img src="../assets/img/exper_restart.png"/></i>
                    <span>重新开始</span>
                </a>
                  <a class="a-opera pointer" v-if="isOpen" @click="isClose=true,type=1,useractions=true">
                    <i><img src="../assets/img/exper_end.png"/></i>
                    <span>结束所有</span>
                </a>

            </div>

        </div>
        <div class="experiment_container clearfix boxsizing">
            <div class="left-noVNc boxsizing " :class="{'changeWidth':isHide}">
                <div class="l-nav" >
                  <span class="pointer" @click="isOpen?(openXuniji(item), virtualMachine=index,container=item,tagid=item.containerId):''" :class="{'active':virtualMachine==index}" v-for="(item,index) in containers" :key="index">虚拟机{{index+1}}{{item.status==1?'(运行中)':'(已创建)'}}</span>
                  <a class="icon_jm pointer" @click="isHide=!isHide" v-if="isHide"></a>
                </div>

                <div class="operation_box 22"  v-if="!isOpen"  ref="imageWrapper" >
                   <a class="btn-open pointer" v-if="!isOpen" @click="execContainer(0)">开启全部虚拟机</a>
                </div>

                <div class="operation_box"  ref="imageWrapper" v-show="isOpen && virtualMachine==iindex" :id="'Screenshots'+iindex"
                     v-for="(item,iindex) in opencontainers" :key="iindex">
                    
                
                   <!--初始化的数据-->
                   <div class="operation_box" id="screen" v-show="virtualMachine==iindex && containerstate=='2'"  v-if="item.url.indexOf('html')>0 && !item.restart && item.url!=''" ></div>
                   
                   
                   <xterm :id="iindex"  :socketURI="item.url" :height="xterm_height"   v-show="item.isFirst?containerstate=='1':virtualMachine==    iindex && containerstate=='1'" v-if="item.isFirst?virtualMachine==iindex && item.url.indexOf('html')==-1 && !item.restart && item.url!='':item.url.indexOf('html')==-1 && !item.restart && item.url!=''" ></xterm>  
                  
                  <div class="operation_box" id="screen" v-show="virtualMachine==iindex && containerstate=='2'"  v-if="item.url.indexOf('html')>0 && item.restart && item.url!=''"></div>
                  <xterm :id="iindex"  :socketURI="item.url" :height="xterm_height"  v-show="item.isFirst?containerstate=='1':virtualMachine==iindex && containerstate=='1'" v-if="item.isFirst?virtualMachine==iindex && item.url.indexOf('html')==-1 && item.restart && item.url!='':item.url.indexOf('html')==-1 && item.restart && item.url!=''" ref="imageWrapper"></xterm>  
               


                </div>





            </div>
            <div class="right_main" :class="{'changeWidth':isHide}">
                <el-scrollbar style="height:100%">
                    <div class="nav">
                        <a class="pointer" :class="{'active_index':curIndex==1}" @click="curIndex=1">实验步骤</a>
                        <a class="pointer" :class="{'active_index':curIndex==2}" @click="curIndex=2" v-if="authority==0&&experiment.end_at!=null">实验报告</a>
                        <!--<a class="icon_jm pointer" @click="isHide=!isHide"></a>-->
                    </div>
                    <div v-if="curIndex==1">
                        <h3 class="htitle">实验步骤说明</h3>
                        <ul class="step-ul">
                           <li style="border-bottom:0 none">
                               <!-- <p class="pt">1、实验步骤</p> -->
                               <p class="ptext" v-html="experiment.step"></p>
                           </li>
                        </ul>
                    </div>
                    <!--&& authority==0 -->
                    <template v-if="curIndex==2 && authority==0">
                    <h3 class="htitle">填写实验报告</h3>
                    <div class="labReport_box"  >
                        <quill-editor
                                v-model="yourContent"
                                ref="myQuillEditor"
                                :options="editorOption"
                                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                            >
                         </quill-editor>
                         <div class="btnbox"><a class="btnDefault" @click="insertExperimentRepor(hasReport)">确认上传</a></div>
                    </div>
                    </template>
                </el-scrollbar>
            </div>

        </div>
                <!--弹窗-->
            <el-dialog :visible.sync="isClose" width="500px">
            <div slot="title" class="dialog_header">警告!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">{{type==1?'确认结束当前实验':'确认重新开始当前实验'}}？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="stopOrrestart">确 认</a>
                <a class="btnDefault" @click="isClose=false">取 消</a>
            </div>
            </el-dialog>
                        <!--弹窗-->
            <el-dialog :visible.sync="isFinish" width="500px" :close-on-click-modal='false' :show-close="false">
            <div slot="title" class="dialog_header">警告!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">该实验已被关闭</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="closeexperiment">确 认</a>
            </div>
            </el-dialog>
            <!--再次上传实验报告弹出框-->
              <el-dialog :visible.sync="isHas" width="500px">
            <div slot="title" class="dialog_header">警告!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">实验报告已存在,确认覆盖上次提交的报告？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="insertExperimentRepor(false)">确 认</a>
                <a class="btnDefault" @click="isHas=false">取 消</a>
            </div>
            </el-dialog>

            <transLoading :mess="mess" v-if="remove"></transLoading>

            <el-dialog
            :visible.sync="isEdit"
            @close="editValue=''"
            width="500px"
            class="personDialog"

            >
            <div slot="title" class="dialog_header">下载代码</div>

            <div class="editMain" >
                <el-form ref="form" label-width="60px">
                <el-form-item label="名称">
                    <el-input v-model="editValue" placeholder="请输入路径/root/Downloads/下的文件名称" :maxlength="16" ></el-input>
                </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="btnDefault" @click="isEdit = false">取消</button>
                <button class="btnDefault" @click="downloadCode">确认</button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
import RFB from '@novnc/novnc/core/rfb';


import { quillEditor } from "vue-quill-editor"; //调用编辑器
import html2canvas from 'html2canvas';
import xterm from '@/components/Xterminal.vue'
import {createContainers,findAllByType,execContainer,removeContainers,insertExperimentRepor,hasExperimentReport,downloadCode,createAndRunContainers} from "@/API/api";

import transLoading from '@/components/uploadLoading.vue'

export default {
    inject:['reload'],
    data(){
        return{
            dataURL: '',
            isHide:false,//右侧栏是否显示
            curIndex:1,
            virtualMachine:8,
            reportText:'',//实验报告输入内容
            authority:0,
            isOpen:false,//虚拟机是否开启
            yourContent: "",
            editorOption: {
                placeholder: "实验报告输入",
                modules:{
                toolbar:[
                        ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                        ['blockquote', 'code-block'],     //引用，代码块
                        [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                        [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                        [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                        [{ 'direction': 'rtl' }],             // 文本方向
                        [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                        [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                        [{ 'font': [] }],     //字体
                        [{ 'align': [] }],    //对齐方式
                        ['clean'],    //清除字体样式
                        ['image']    //上传图片、上传视频'video'
                        ]
                }
            },
            loading:false,

             term: null,

             socketURI:'',

             //socketURI:'http://192.168.1.54:2222/ssh/host/192.168.1.54/5001'
            userid:'',
            experimentId:'',
            courseId:'',
            containers:[],//虚拟机列表 这里显示标题的时候要显示status 0是已创建 1是运行中
            opencontainers:[],//用来存放创建容器后的虚拟机列表
            experiment:{},//实验详情
            time:'',
            second:'',//用来记录当前倒计时的秒数
            isClose:false,
            type:'',//0是START,1是 STOP,2是 RESTART
            hasReport:false,//是否已上传过实验报告
            isHas:false,
            container:{},//用来存放选中的虚拟机
            containerstate:'',//1 命令行 2图文
            remove:false,

            connect_url:'',//图形化界面url
            rfb:'',
            timeInterval:null, //倒计时定时器

            isEdit:false,//点击文件下载名称输入显示
            editValue:'',//下载要输入的文件名称
            tagid:'',
            mess:'正在关闭实验，请稍候...',
            showtime:true,
            isFinish:false,
            timer:'',
            connectNum:0,
            experimentstate:{},
            xterm_height:0,
            restartForMe:false,
            useractions:false,

            isFirst:true,
           

        }
    },
    beforeCreate() {
       document.getElementsByTagName("body")[0].className="equipment-body";
    },
    beforeDestroy(){
        document.body.removeAttribute("class","equipment-body");
        let that = this
        //离开页面的时候清除定时器
        if(that.timeInterval!=null){

           clearInterval(that.timeInterval)
           sessionStorage.setItem(that.userid+that.experimentId,that.second)
        }
        if (that.timer!=null) {
            clearInterval(that.timer)
            
        }
    },
    components:{quillEditor,xterm,transLoading},
    created(){
        let that = this;
        that.authority = that.$route.query.authority?that.$Base64.decode(that.$route.query.authority):0;
        that.userid = that.$route.query.userid
        that.experimentId=that.$route.query.experimentId
        that.courseId =that.$route.query.courseId
        that.findAllByType(that.experimentId)
        that.showtime =  that.userid==sessionStorage.getItem("userId")?true:false
        if (that.authority==0) {
            that.hasExperimentReport()
        }
 
    },
    methods:{
        // vnc连接断开的回调函数
        disconnectedFromServer (msg) {
            if(msg.detail.clean){
                // 根据 断开信息的msg.detail.clean 来判断是否可以重新连接
                if (this.useractions==false) {
                     this.imageClose()
                }else{
                    this.connectVnc(this.connect_url)
            
                }
                   
            
              
            } else {
                //这里做不可重新连接的一些操作
                   if (this.useractions==false) {
                      this.imageClose()
                }else{
                  if (this.connectNum<2) {
                     this.connectVnc(this.connect_url)
                  }
                    this.connectNum=this.connectNum+1  
                    
                }
                  
           
                
                
            }
        },
        // 连接成功的回调函数
        connectedToServer(msg) {
             this.connectNum=0
             this.useractions=false
        },
           //创建实验
        createContainers(userid,experimentId,courseId){
           
            let that = this
            that.useractions=true
            let obj = {}
            obj.userId = userid
            obj.experimentId = experimentId
            obj.courseId = courseId
            createContainers(obj).then(res=>{
                if (res.code==200) {
                   
                    for(var i =0;i<res.data.length;i++){
                         res.data[i].isFirst = true;
                               res.data[i].isLink = false; //是否连接
                               res.data[i].restart = false;
                     }
                    that.containers = res.data
                    if (that.containers!=null&& that.containers.length>0&&that.containers[0]!=null) {
                        if (that.containers[0].status==1) {
                            that.isFirst = true;
                            that.isOpen=true
                            that.virtualMachine=0
                            if (that.showtime) {
                                that.daojishi(that.second)
                            }
                            
                            for(var i =0;i<res.data.length;i++){
                                res.data[i].isFirst = true,
                               res.data[i].isLink = false; //是否连接
                               res.data[i].restart = false;
                            }
                            that.opencontainers=res.data
                            // that.getState()
                        }
                        that.container = that.containers[0]
                        if (that.isOpen==true) {
                             that.openXuniji(that.container)
                        }
                    }
                } else {
                     console.log(res.data)
                }
            })

        },
        //获取实验详情
        findAllByType(experId){
            let that = this
            let obj = {}
            obj.id = experId
            obj.type = 0
            obj.perPage=1
            obj.page=1
            obj.experiment_type=0
            findAllByType(obj).then(res=>{
                if (res.code==200) {
                    that.experiment = res.data
                   if(sessionStorage.getItem(that.userid+that.experimentId)!=undefined && sessionStorage.getItem(that.userid+that.experimentId)!=null){
                        let experiment_time = sessionStorage.getItem(that.userid+that.experimentId).split(':')
                        //time = parseInt(experiment_time[0])*3600+parseInt(experiment_time[1])*60+parseInt(experiment_time[2])
                        that.second =  sessionStorage.getItem(that.userid+that.experimentId);
                        sessionStorage.removeItem(that.userid+that.experimentId);
                    }else{
                        that.second= that.experiment.duration*60
                    }
                    that.formatSecToDate( that.second)
                    that.createContainers(that.userid,that.experimentId,that.courseId)
                }else {
                    that.$toast(res.message,3000)
                }
            })
        },
        //判断是关闭实验还是重启实验
        stopOrrestart(){
            let that = this
            if (that.type==2) {
                //重启实验
                that.mess='正在重新开始实验，请稍候...'
                clearInterval(that.timeInterval)
                that.timeInterval=null
                sessionStorage.removeItem(that.userid+that.experimentId);
                that.closeContainers()
                that.yourContent=''
                that.restartForMe=true

            }else if (that.type==1) {
                that.mess='正在关闭实验，请稍候...'
                clearInterval(that.timeInterval)
                that.timeInterval=null
                sessionStorage.removeItem(that.userid+that.experimentId);
                that.remove=true
                if (that.authority==0) {
                   //学生关闭实验
                   that.execContainer(1)
                }else{
                    //教师与管理员关闭实验
                    that.removeContainers()
                }
            }
            if (that.timer!=null) {
                clearInterval(that.timer)
                that.timer=null
            }
            that.isClose=false

        },
        //开启实验 type 0是START,1是 STOP,2是 RESTART
        execContainer(type){
            let that = this
            let obj = {}
            let containerId = []
            for (let index = 0; index <  that.containers.length; index++) {
                containerId.push( that.containers[index].containerId)
            }
            that.isOpen = true
            obj.containerId = containerId
            obj.type = type
            execContainer(obj).then(res=>{
                if (res.code==200) {
                    if(type==0){
                      that.createContainers(that.userid,that.experimentId,that.courseId)

                    }
                    if (type==1) {
                        that.remove=false
                        that.click_back()
                    }
                } else {
                    that.$toast(res.message,3000)
                }
            })

        },
        //管理员和老师关闭实验调用
        removeContainers(){
            let that = this
            let obj = {}
            let containerId = []
            for (let index = 0; index <  that.containers.length; index++) {
                containerId.push( that.containers[index].containerId)
            }
            obj.containerIds = containerId
            removeContainers(obj).then(res=>{
                  that.remove=false
                  clearInterval(that.timeInterval)

                  that.click_back()
             })
        },
        //关闭镜像
        closeContainers(){
            let that =this
            that.remove=true
             //教师与管理员关闭实验
            let obj = {}
            let containerId = []
            // for (let index = 0; index <  that.containers.length; index++) {
            //     containerId.push( that.containers[index].containerId)
            // }
            containerId.push(that.container.containerId)
            obj.containerIds = containerId
            removeContainers(obj).then(res=>{
                that.restartContainers()
            })

        },
        //重启镜像
        restartContainers(){
            
            let that=this
            let obj={}
            obj.userId = that.userid
            obj.experimentId = that.experimentId
            obj.courseId = that.courseId
            obj.imageId=that.container.imageId
            
            for (let index = 0; index < that.opencontainers.length; index++) {
                if (that.opencontainers[index].imageId==that.container.imageId) {
                    that.opencontainers[index].url='';
                    
                }

            }

            createAndRunContainers(obj).then(res=>{
            that.remove=false
            that.useractions=true
            if (res.code==200) {

                // that.getState()
                for (let index = 0; index < that.containers.length; index++) {
                    if (that.containers[index].imageId==res.data.imageId) {
                        that.containers[index]=res.data
                        
                    }

                }
                for (let index = 0; index < that.opencontainers.length; index++) {
                    if (that.opencontainers[index].imageId==res.data.imageId) {
                        that.opencontainers[index]=res.data
                        
                    }

                }
                that.container = res.data;
                that.$set(that.container,'restart',true)   
                that.openXuniji(that.container)
                  if (that.showtime) {
                       that.daojishi(that.experiment.duration*60)
                  }
                            
                
            } 
            })
           .catch((error) => {
             that.remove=false
             that.useractions=true
            })
        },
        //添加实验报告
        insertExperimentRepor(hasReport){
            let that = this
            let endTime = that.experiment.end_at!=null? that.experiment.end_at.substring(0, that.experiment.end_at.indexOf("T")):''
            let nowTime=new Date().toLocaleDateString().replace(/\//g,'-')

            if (that.yourContent=='') {
               return that.$toast("请输入实验报告内容",3000)
            }

            if (new Date(nowTime).getTime()>new Date(endTime).getTime()) {
                 return that.$toast("已超过实验报告的最晚提交时间，不能提交报告",3000)
            }
            if (hasReport==true&&that.experimentstate.status==1) {
                return that.$toast("实验报告已提交，不能再次修改",3000)
            }
            if (hasReport==true&&that.experimentstate.isCorrect==1) {
                return that.$toast("该实验报告已批阅，不能再次修改",3000)
            }
           

            if ( hasReport==true) {
                 that.isHas=true
                return

            }
            that.isHas=false
            let obj={}
            obj.experiment_id = that.experimentId
            obj.user_id = that.userid
            obj.info = that.yourContent
            insertExperimentRepor(obj).then(res=>{
                if (res.code==200) {
                    that.$toast("实验报告上传成功",3000)
                    // that.yourContent=''
                    that.hasReport=true
                } else {
                    that.$toast(res.message,3000)
                }
            })

        },
        //判断是否已提交实验报告
        hasExperimentReport(){
            let that = this
            let obj ={}
            obj.experiment_id = that.experimentId
            obj.user_id =  that.userid
            hasExperimentReport(obj).then(res=>{
                if (res.code==200) {
                    that.hasReport=true
                    that.experimentstate =res.data
                } else {
                    that.hasReport=false
                }
            })

        },

        //连接vnc的函数
        connectVnc (uri) {
            let that = this;
            that.rfb = ''
            const PASSWORD = '';

            //const url='ws://192.168.1.31:6901/vnc.html?password=123456&autoconnect=true'
            //const url ='ws://192.168.1.133:6080/'



            const url =uri
            this.$nextTick(function(){
           
            that.rfb = new RFB(document.getElementById('screen'), url, {
            // 向vnc 传递的一些参数，比如说虚拟机的开机密码等
                credentials: {password: '123456' }
            });
            that.rfb.addEventListener('connect', this.connectedToServer);
            that.rfb.addEventListener('disconnect', this.disconnectedFromServer);
            that.rfb.scaleViewport = true;  //scaleViewport指示是否应在本地扩展远程会话以使其适                    合其容器。禁用时，如果远程会话小于其容器，则它将居中，或者根据clipViewport它是否更大来处理。默认情况下禁用。
            that.rfb.resizeSession = true; //是一个boolean指示是否每当容器改变尺寸应被发送到调整远程会话的请求。默认情况下禁用




            })


        },

        //头部点击返回
        click_back(){
            let that = this;
             if (window.history.length <= 1) {
                 if(that.authority==0){
                    this.$router.push({path:'/student'})
                 }
                  if(that.authority==1){
                    this.$router.push({path:'/teacher'})
                 }
                  if(that.authority==2){
                    this.$router.push({path:'/admin'})
                 }

                return false
            } else {
                this.$router.go(-1)
            }
        },
        //一键截屏
        click_screenshots(){
           let that = this;
           that.makeImg()

        },
        //时间转化
        formatSecToDate(sec){
            if(!sec){
                return '-'
            }
            var min = Math.floor(sec%3600);//分钟
            this.time= (Math.floor(sec/3600)<10?"0"+ Math.floor(sec/3600):Math.floor(sec/3600) )+ ":" +( Math.floor(min/60)<10?"0"+Math.floor(min/60):Math.floor(min/60)) + ":"+ (sec%60<10?"0"+sec%60:sec%60)
        },

      //倒计时
        daojishi(time){
            let that = this
            that.timeInterval = null;

            let min = null;
            let h = null;
            let m = null;
            let s = null;

            // if(type==1){
            //     h = time.split(':')[0];
            //     m = time.split(':')[1];
            //     s = time.split(':')[1]
            // }

            // if(type==2){
                min = Math.floor(time%3600)
                //时
                 h = parseInt(time / 3600) > 0 ? parseInt(time / 3600) : 0
                //分
                 m = parseInt( min /60)
                //秒
                 s = time%60
            // }

            //开始执行倒计时
            that.timeInterval = setInterval(function () {
            //如果时、分、秒都为0时将停止当前的倒计时
            if (h == 0 && m == 0 && s == 0) {
                 clearInterval(that.timeInterval);
                 that.type=1;
                 that.stopOrrestart();
                 return;
                 }
             //当秒走到0时，再次为60秒
            if (s == 0) { s = 60; }
            if (s == 60) {
            //每次当秒走到60秒时，分钟减一
            m -= 1;
            //当分等于0时并且小时还多余1个小时的时候进里面看看
            if (m < 0 && h > 0) {
                //小时减一
                h -= 1;
                //分钟自动默认为60分
                m = 59;
                //秒自动默认为60秒
                s = 60;
                }
             }
            //秒继续跳动，减一
            s -= 1;
            //小时赋值

            that.time= (h<10?"0"+ h:h )+ ":" +( m<10?"0"+m:m) + ":"+ (s<10?"0"+s:s);
            that.second = h*3600+m*60+s
            sessionStorage.setItem(that.userid+that.experimentId,that.second)
            }, 1000);
        },


        // 将dom转成canvas
        makeImg() {
            var that = this
            var opts = {
                logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
                allowTaint: true, // 否允许跨源图像污染画布
                backgroundColor: null, // 解决生成的图片有白边
                useCORS: true, // 如果截图的内容里有图片,解决文件跨域问题
                scale:2,
                height: document.getElementById('Screenshots'+that.virtualMachine).offsetHeight,
                width:document.getElementById('Screenshots'+that.virtualMachine).offsetWidth,
                //windowHeight: document.getElementById('imageWrapper').scrollHeight,
                //windowWidth: document.getElementById('imageWrapper').scrollWidth,
                x:0,
                scrollX: 0,    //设置这两个scrollX/Y即可
			    scrollY: 0,


            }

            // eslint-disable-next-line no-undef
            //const iframeHtml = this.$refs.frameWrapper.contentWindow // 获取iframe内容
            //const iframeBody = iframeHtml.document.getElementsByTagName('body')[0]
            //that.$refs.imageWrapper

            that.$nextTick(function(){
                html2canvas(document.getElementById('Screenshots'+that.virtualMachine), opts).then((canvas) => {
                    var url = canvas.toDataURL('image/png')
                    that.dataURL = url
                    that.yourContent =that.yourContent+ '<p><img src="'+that.dataURL+'"/></p>'
                })
            })
        },

        //判断打开虚拟机
        openXuniji(item){
            let that = this
            
            if(item.isFirst){
                that.$set(item,'isFirst',false)
            }

            if (that.isOpen) {
                if (item.url.indexOf("vnc.html")==-1) {
                     that.containerstate='1';
                      that.xterm_height = 0
                      that.$nextTick(function(){
                          that.xterm_height =  document.getElementById('Screenshots'+that.virtualMachine).offsetHeight
                      })
                       //that.xterm_height = that.$refs.imageWrapper[that.virtualMachine].offsetHeight;
                     //that.socketURI = item.url
                }else {
                    that.containerstate='2'
                    that.xterm_height = 0
                    that.connect_url = item.url
                       that.$nextTick(function(){
                          that.xterm_height =  document.getElementById('Screenshots'+that.virtualMachine).offsetHeight
                      })
                     that.$nextTick(function(){
                         if(!item.isLink){
                           that.connectVnc(item.url)
                           item.isLink =true
                         }
                        
                     })




                }
            }


        },

        downloadCode(){
                      
            let that =this
            if (that.editValue=='') {
               return that.$toast("请输入文件名称",3000)
            }
            let name=that.editValue
       
            let obj={}
            obj.containerId = that.container.containerId
            obj.fileName = that.editValue
            downloadCode(obj).then(res=>{
                that.isEdit=false
                if (res.code==200) {
                    if (res.data!=null) {
                        that.downloadfile(name,atob(res.data))                
                    }else {
                        that.$toast("输入的文件不存在",3000)
                    }
                } else {
                    console.log(res.message)
                }
            })

        },
        //监听命令行镜像是否断开
        imageClose(){
            let that = this
            if (that.useractions==false) {
            that.isFinish=true
            if ( that.timeInterval!=null) {
                  clearInterval(that.timeInterval)
                  that.timeInterval=null
            }          
            sessionStorage.removeItem(that.userid+that.experimentId);
            if (that.timer!=null) {
                clearInterval(that.timer)
                that.timer=null
            }
            }else {
                that.useractions=false
          
            }
                   
        },
        imageOpen(){
            let that = this
            that.useractions=false
         
        },
        // http图片转成base64，防止解决不了的图片跨域问题
        getBase64Image(img) {
        var canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        var dataURL = canvas.toDataURL('image/png') // 可选其他值 image/jpeg
        return dataURL
        },
        onEditorReady(editor) { // 准备编辑器
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件
        //用来判断该实验是否被关闭
        judgeState(){
            let that = this
            let obj = {}
            obj.userId = that.userid
            obj.experimentId = that.experimentId
            obj.courseId = that.courseId
            createContainers(obj).then(res=>{
                if (res.code==200) {
                    if (res.data!=null&& res.data.length>0&&res.data[0]!=null) {
                        if (res.data[0].status!=1&&that.restartForMe==false) {
                            that.isFinish=true
                            if ( that.timeInterval!=null) {
                                clearInterval(that.timeInterval)
                                that.timeInterval=null
                            }          
                            sessionStorage.removeItem(that.userid+that.experimentId);
                            if (that.timer!=null) {
                                clearInterval(that.timer)
                                that.timer=null
                            }
                        }
                    }
                } else {
                     console.log(res.data)
                }
            }) .catch((error) => {
                        that.isFinish=true
                        if ( that.timeInterval!=null) {
                                clearInterval(that.timeInterval)
                                that.timeInterval=null
                            }          
                            sessionStorage.removeItem(that.userid+that.experimentId);
                            if (that.timer!=null) {
                                clearInterval(that.timer)
                                that.timer=null
                            }
        });

        },
        //轮询访问实验是否被关闭
        getState(){
            let that = this
            that.timer = setInterval(that.judgeState, 1000)
        },
        //关闭实验
        closeexperiment(){
            let that = this
            that.isFinish=false
            if ( that.timeInterval!=null) {
                clearInterval(that.timeInterval)
                that.timeInterval=null
            }          
            sessionStorage.removeItem(that.userid+that.experimentId);
            if (that.timer!=null) {
                clearInterval(that.timer)
                that.timer=null
            }
            that.click_back()
        },
        downloadfile(filename,data){
            const blob = new Blob([data], {type: "text/plain"})
            //const blob = new Blob([data], {type: 'audio/wav'})
            const a= document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = filename // 这里填保存成的文件名
            a.click()
            URL.revokeObjectURL(a.href)
　　　       a.remove();
        }
        }
}
</script>
<style lang="less" scoped>
@import url(../assets/less/operateExperiment.less);


</style>
