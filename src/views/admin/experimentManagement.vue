<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="type" placeholder="请选择人员类别" @change="selectType" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
          <div class="sel-box" v-show="type == '学生' || type == 2">
            <el-select v-model="className" placeholder="请选择班级" @change="selectClass" >
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" > </el-option>
            </el-select>
          </div>
        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="click_Release(1,'')">一键释放</a>

          <!--
          <div class="d-serach">
            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
          -->
        </div>
      </div>

      <div class="tablex_box list_box">
        <template v-if="isHasData">
        <div class="l_box">
          <ul class="default_List">
             <li v-for="(item,index) in machineList" :key="index">
                 <div class="info-box ">

                     <div class="d-icon"></div>
                      <!-- <p class="p_id textline1">ID：{{item.container_id}}</p> -->
                      <p class="p_id textline1">用户：{{item.user_name}}</p>
                     <p class="p_id textline1">实验名称：{{item.experiment_name}}</p>
                     <div class="btnbox">
                         <a class="btnDefault machbtn pointer" @click="click_Release(2,item.experiment_name),container =item"><span>释放内存</span></a>
                     </div>
                 </div>
             </li>
          </ul>
        </div>
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
        </template>

       <nodata dataMess="当前暂无正在运行的实验" noDataType='1' v-if="!isHasData"></nodata>

      </div>
    </div>

    <!--虚拟机内存释放弹出框-->
    <el-dialog

      :visible.sync="show_Release"
      width="500px">
      <div slot="title" class="dialog_header">
          {{!release_success?'警告!':'警告!'}}
      </div>
      <div class="confirm_dialog_body">
          <p class="dialog_mess" v-if="!release_success"><span class="span_icon icon_waring">{{dialog_machine}}</span></p>
          <p class="dialog_mess" v-if="release_success"><span class="span_icon icon_success">{{flag_state==1?'后台正在释放中，请稍后查看':'虚拟机内存已释放！'}}</span></p>
      </div>
      <div slot="footer" class="dialog-footer " v-if="!release_success">
          <a class="btnDefault" @click="confiremRelease">确 认</a>
          <a class="btnDefault"   @click="release_success = false;show_Release=false">取 消</a>
      </div>
        <div slot="footer" class="dialog-footer " v-if="release_success">
          <a class="btnDefault"  @click="successConfirm">确 认</a>

      </div>
      </el-dialog>
    <loading v-if="loading" @hideloading="hideloading" mess='内存正在释放,请稍候...'></loading>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {getRunContainerList,searchClass,stopRunContainerList,execContainer,stopExperiment} from '@/API/api';
import nodata from '@/components/noData'
import loading from '@/components/uploadLoading.vue'
export default {
  data() {
    return {
     options: [ { value: "0", label: "全部"},{ value: "1", label: "教师"}, { value: "2", label: "学生"} ],
     type: "", //人员类型选择
      classList: [
        { id: "211", name: "10年03班" },
        { id: "212", name: "10年04班" },
      ],
      className: "", //选择的班级
      inplaceholder: "请输入虚拟机id",
      machineList:[
      ],//设备列表
      total:1,
      showDel: false, //删除多选是否显示
      perPage:12, //虚拟机每页
      curPage:1,
      show_Release:false,//虚拟机释放弹出框显示
      release_success:false,//是否是否成功
      dialog_machine:'',
       isHasData:true,//是否有数据 默认有数据
        type1:'',
        flag_state:'',//1一件释放 2释放单个
        container:{},
      loading:false
    };
  },
  components:{nodata,loading},

  computed: {
    ...mapState({
      state: (state) => state,
    }),
  },
  created(){
    let that = this;
    that.type = that.options[0].value

  },
    mounted(){
        let that = this;
        that.getAllRunContainer(that.curPage);
        that.searchClass();
    },
  methods: {
      getRunContainerList(type,classId,page){
          let that = this;
          let obj = {};
          that.curPage = page;
          obj.type = type;
          obj.classId = classId;
          obj.page = page;
          obj.perPage = that.perPage;
          getRunContainerList(obj).then(res=> {
              if(res.code==200){
                console.log(res.data)
                  that.total = res.data.total;
                  res.data.total==0 ? that.isHasData = false :that.isHasData = true
                  that.machineList = res.data.list;
              }else{
                  this.$toast(res.message,2000)
              }
          })
      },
      getAllRunContainer(page){
        let that = this;
        that.getRunContainerList(0,'',page);
      },
      //班级列表
      searchClass() {
          let that = this;
          searchClass().then((res) => {
              if (res.code == 200) {
                  that.classList = res.data;
              } else {
                  that.$toast(res.message, 3000);
              }
          });
      },
    //人员类别选择
    selectType(val) {
      //表示选择的是学生
      let that = this;
      that.className = "";
      that.type1 = val;
      if (val == 1) {
        console.log('老师')
        that.getRunContainerList(1,'',1);
      }
      if (val == 2) {
        console.log('学生')
        that.getRunContainerList(2,'',1);
      }
        if (val == 0) {
            console.log('管理员')
            that.getRunContainerList(0,'',1);
        }

    },
    //班级选择事件
    selectClass(val) {
        let that = this;
        that.getRunContainerList(2,val,1,10);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //删除用户
    delUser() {
      let that = this;
      if (that.multipleSelection.length <= 0) {
        that.showDel = !that.showDel;
      } else {
        console.log("删除用户");
      }
    },
    //底部分页
    handleCurrentChange(val) {
     let that = this
      that.curPage = val
      console.log(`当前页: ${val}`);
        if (that.type1 == 1) {
            console.log('老师')
            that.getRunContainerList(1,'',val);
        }
        if (that.type1 == 2) {
            console.log('学生')
            that.getRunContainerList(2,that.className,val);
        }
        if (that.type1 == 0) {
            console.log('管理员')
            that.getRunContainerList(0,'',val);
        }
    },
    upLoad() {
      this.$refs.upload.active = true;
    },
    //虚拟机释放点击x
    click_Release(num,id){
      let that = this;
      that.show_Release = true
      that.release_success = false
      //that.type = num;
      that.flag_state=num
      if(num==1){
        that.type == 1?that.dialog_machine ='确定要一键释放所有老师内存吗？':that.type==2?that.dialog_machine ='确定要一键释放所有学生内存吗？':that.dialog_machine ='确定要一键释放所有内存吗？'

      }else{
          that.id = id
        that.dialog_machine ='确定要释放'+id+'的虚拟机内存吗？'
      }

    },
    //虚拟机释放确认
    confiremRelease(){
        let that = this;
        if(that.total == 0){
          that.show_Release = false;
          return that.$toast("暂无正在运行的实验", 3000);
        }
        if(that.flag_state == 1){
            that.type    = ''
            stopRunContainerList().then((res) => {
               if (res.code == 200) {
                   that.release_success = true
                   that.isClose=false;
                   that.getAllRunContainer(that.curPage);
               } else {
                   that.$toast(res.message, 3000);
               }
            });
        }else{
            let obj = {}
            that.loading = true;
            obj.userId = that.container.user_id
            obj.experimentId = that.container.experiment_id
            stopExperiment(obj).then(res=>{
                that.id = ''
                if (res.code==200) {
                     that.loading = false;
                    that.release_success = true
                    that.isClose=false;
                    that.getAllRunContainer(that.curPage);
                } else {
                    that.isClose=false
                    that.loading = false;
                    that.$toast(res.message,3000)
                    //console.log(res.message)
                }
            })
        }


    },
    //释放成功确认
    successConfirm(){
      let that = this
       that.show_Release = false
      that.release_success = false
    }

  },
};
</script>
<style lang="less" scoped>
.stu_upload{width:100px; margin-right: 20px; cursor: pointer;}
.excel_file{cursor: pointer;}
@import url(../../assets/less/admin.less);
</style>
