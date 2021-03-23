<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                    <div class="fl">
                       <div class="sel-box">
                          <el-select v-model="className" placeholder="课程名称"
                          @change="changeClass"
                          >
                                <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>

                       </div>

                       <!-- <div class="sel-box">
                          <el-select v-model="level1Name" placeholder="课程"
                          @change="changeLevel1"
                          >
                                <el-option
                                v-for="item in level1List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                        <div class="sel-box" v-if="level2List.length>0">
                          <el-select v-model="level2Name" placeholder="章"
                          @change="changeLevel2"
                          >
                                <el-option
                                v-for="item in level2List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                       <div class="sel-box" v-if="level3List.length>0">
                          <el-select v-model="level3Name" placeholder="节"
                          @change="changeLevel3"
                          >
                                <el-option
                                v-for="item in level3List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div> -->
                       <div class="sel-box" >
                          <el-select v-model="state" placeholder="请选择状态"
                          @change="changeState"
                          >
                                <el-option
                                v-for="item in stateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                    </div>
                    <div class="fr">
                       <div class="d-serach">
                            <input :placeholder="inplaceholder" type="text" v-emoji v-model="searchTx" autocomplete="off"  @keyup.enter="doSearch"/>
                            <a class="searchBtn pointer" @click="doSearch"></a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
            <noData :noDataType="noDataType" :dataMess="dataMess" v-if="!hasData"></noData>
                        <template v-if="hasData">
        <div class="container">
           <div class="tea_list">
              <ul class="tab_box">
                  <li class="li-th">
                      <div class="d1 d28">
                        <div class="cell pname">实验名称</div>
                     </div>
                     <div class="d2 d15">
                        <div class="cell textline1">截止时间</div>
                     </div>
                     <div class="d3 d18">
                        <div class="cell">分数</div>
                     </div>
                     <div class="d4 d14">
                        <div class="cell">状态</div>
                     </div>
                     <div class="d5 d25">
                         <div class="cell">
                           操作
                         </div>
                     </div>
                  </li>
                  <li class="li-tr" v-for="(item,index) in jobList" :key="index">
                     <div class="d1 d28">
                        <div class="cell pname">{{item.name}}</div>
                     </div>
                     <div class="d2 d15">
                        <div class="cell textline1">{{item.end_at!=null?item.end_at.substring(0,item.end_at.indexOf("T")):'暂未设置'}}</div>
                     </div>
                     <div class="d3 d18">
                        <div class="cell">{{item.isCorrect==1?item.score:'待老师批阅'}}</div>
                     </div>
                     <div class="d4 d14">
                        <div class="cell">{{item.status==1?'已提交':'待提交'}}</div>
                     </div>
                     <div class="d5 d25">
                         <div class="cell">
                            <a class="pointer tab_atn" @click="showDetail(item.status,item.isCorrect,item),singleData=item">查看</a>
                            <span class="space-line" v-if="item.status!=1" @click="isCommit=true,singleData=item"></span>
                            <a class="pointer tab_atn" v-if="item.status!=1" @click="isCommit=true,singleData=item">提交</a>

                         </div>
                     </div>
                  </li>
              </ul>
              <div class="tab-pagination">
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
           </div>
        </div>
        </template>
            <!--提交实验报告-->
              <el-dialog :visible.sync="isCommit" width="600px">
            <div slot="title" class="dialog_header">警告!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">确认提交实验报告？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="updateExperimentReport">确 认</a>
                <a class="btnDefault" @click="isCommit=false">取 消</a>
            </div>
            </el-dialog>
        <!--实验报告批阅-->
        <el-dialog width='1100px' :visible.sync="isReport" class="report_detail_dialog">
            <div slot="title" class="dialog_header">{{singleData.name}}实验---{{singleData.userName}}提交</div>
            <p v-if="curStatus==2" class="p-score">
                报告得分：{{singleData.score}}分
            </p>
            <div class="reportMain"  v-if="curStatus==2"  id="pdfDom">
                <div v-html="yourContent"></div>


            </div>
            <div class="report_detail_btnbox" v-if="curStatus==2">
                <a class="pointer btnDefault" @click="getPdf(1,singleData.name+'实验')">导出</a>
            </div>
            <div id="pdfDom" v-if="curStatus!=2">
                <quill-editor
                    v-model="yourContent"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                >
                </quill-editor>
            </div>
            <div class="report_detail_btnbox" v-if="curStatus==1">
                    <a class="pointer btnDefault tab_atn colorfff" @click="getPdf(2,singleData.name+'实验')">导出</a>
                   <a class="pointer btnDefault" @click="updateExperimentInfo">确认</a>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {student_getCourseList,findByExperimentReportAll,updateExperimentReport,findExperimentReportByExperimentAndUserId,findStudentExperimentReport} from '@/API/api';
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import noData from '@/components/noData.vue'
export default {
    data(){
      return{
        userList:'张三，李四，王龙，李明',
        perPage: 10,//用户列表每页条数
        curPage:1,
        jobList:[
        ],
        singleData:{},//存储单个实验报告数据
        classList:[//班级选择列表
            {label:'课程1',value:'1004'},{label:'课程2',value:'1005'}
        ],
        className:'',//选择的课程名称

        stateList:[{label:'全部',value:-1},{label:'已提交',value:1},{label:'未提交',value:0}],//作业状态list
        state:-1,//作业选中状态

        level1List:[
            {label:'区块链的发展史',value:'1'},
            {label:'原理篇',value:'2',
             children:[{label:'数据结构原理',value:'1'},{label:'节点共识模拟',value:'2'},{label:'智能合约部署与调用',value:'3'},
               {label:'区块链密码学',value:'4',
               children:[{label:'哈希算法',value:'1'},{label:'椭圆线密码算法',value:'2'},{label:'对称密钥算法',value:'3'},{label:'keystore',value:'4'}]
               }
             ]
            }
        ],
        level1Name:'',//选中课程名称

        level2List:[],//章节列表
        level2Name:'',//章节名称

        level3List:[],//小节列表
        level3Name:'',//小节名称

        inplaceholder:'请输入实验名称',
        total:0,
        noDataType:1,  //没有数据展示的样式
        dataMess:'当前暂无实验报告',
        hasData:true,
        isCommit:false,

        isReport:false,
        curStatus:0,//当前实验报告的状态
        yourContent:'',//报告内容
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
                    ['image','link']    //上传图片、上传视频'video'
                    ]
            }
        },
        searchTx:'',
        htmlTitle: '页面导出PDF文件名'
      }
    },
    components:{quillEditor,noData},
    filters:{
        catIndex: function (val) {
            let str = ''
            let value = val
            if(value<9){
                str='0'+value
            }else{
                str=value
            }
            return str
        }
    },
    created(){
        this.getDataList()
        this.findByExperimentReportAll(1)
    },
    methods:{
        //底部分页
        handleCurrentChange(val) {
            let that = this
            that.findByExperimentReportAll(val)
            // console.log(`当前页: ${val}`);
        },
        //选择班级
        changeClass(val){
            let that=this
            that.findByExperimentReportAll(1)
            // console.log('选择课程')
        },
        //选择状态
        changeState(val){
            let that = this
            that.findByExperimentReportAll(1)
            // console.log('选择状态'+val)
        },
        //选择课程
        changeLevel1(val){
            let that = this
            let tmp = that.level1List
            that.level2List = []
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].value){
                    if(tmp[i].children){
                       that.level2List = tmp[i].children || [];
                    }else{
                         that.level2List = []
                    }

                }
            }

        },
        //选择章节
        changeLevel2(val){
           let that = this
            let tmp = that.level2List
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].value){
                    if(tmp[i].children){
                       that.level3List = tmp[i].children || [];
                    }else{
                         that.level3List = []
                    }

                }
            }
        },
            //搜索
        doSearch(){
            let that = this;
            // if (that.searchTx=='') {
            //      return  that.$toast(that.inplaceholder,2000)
            // }
            that.findByExperimentReportAll(1)

        },
        //选择节
        changeLevel3(val){
            // console.log('选择节')
        },
        onEditorReady(editor) { // 准备编辑器
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件


        showDetail(state,isreview,item){
           let that = this;
           that.isReport = true
           if(state==0){
              that.curStatus = 1
           }else{

               if(isreview==1){
                    that.curStatus =2
               }
               else{
                   that.curStatus = 0
               }
           }
           that.findExperimentReportByExperimentAndUserId(item)


        },
        //获取我的课程列表
        getDataList(){
            let that = this;
            let obj={}
            obj.user_id = sessionStorage.getItem("userId")
            obj.per_page =100
            obj.page = 1
            obj.start=''
            obj.end=''
            obj.name=''
            student_getCourseList(obj).then(res=>{
                if(res.code==200){
                    // console.log(res.data)
                    that.classList = res.data.list
                }else{
                     this.$toast(res.message, 3000);
                }
            })
        },
           //查询实验报告列表
        findByExperimentReportAll(page){
            let that= this
            that.curPage=page
            let obj={}
            obj.course_id = that.className
            // obj.isCorrect = -1
            obj.status = that.state
            obj.user_id =sessionStorage.getItem("userId")
            obj.name = that.searchTx
            obj.perPage=that.perPage
            obj.page = page
            // console.log(obj)
            findStudentExperimentReport(obj).then(res=>{
                if (res.code==200) {
                    // console.log(res.data)
                    that.jobList = res.data.list
                    that.hasData=res.data.list.length==0?false:true
                    that.total = res.data.total

                } else {
                    that.$toast(res.message,3000)
                }
            })
        },
        //查看实验报告
        findExperimentReportByExperimentAndUserId(item){
            let that = this
            that.yourContent=''
            let obj = {}
            obj.experiment_id = item.experiment_id
            obj.user_id = sessionStorage.getItem("userId")
            findExperimentReportByExperimentAndUserId(obj).then(res=>{
                if (res.code==200) {
                    //console.log(res.data)
                    that.yourContent = res.data.info
                } else {
                     that.$toast(res.message,3000)
                }
            })
        },
        //提交实验报告
        updateExperimentReport(){
            let that = this
            let obj={}
            that.isCommit=false
            obj.experiment_id = that.singleData.experiment_id
            obj.user_id = sessionStorage.getItem("userId")
            obj.status=1
            //console.log(obj)
            updateExperimentReport(obj).then(res=>{
                if (res.code==200) {
                    that.findByExperimentReportAll(1)
                }else {
                    that.$toast(res.message,3000)
                }
            })
        },
        //更新实验报告内容
        updateExperimentInfo(){
            let that = this
            if (that.yourContent=='') {
                return that.$toast("请输入实验报告内容",2000)

            }
            let obj={}
            obj.experiment_id = that.singleData.experiment_id
            obj.user_id = sessionStorage.getItem("userId")
            obj.status=0
            obj.info=that.yourContent
            updateExperimentReport(obj).then(res=>{
                if (res.code==200) {
                    that.isReport=false
                }else {
                    that.$toast(res.message,3000)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/student.less);
.pp_main{background:#f3f4fa;}
.reportMain img{width:100%}
.p-score{text-align: center; font-size:18px; padding-bottom: 20px;}
</style>
