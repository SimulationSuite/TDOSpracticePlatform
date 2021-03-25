<template>
  <div class="pp_main boxsizing">
    <div class="container container-userList">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select
              v-model="type"
              placeholder="请选择人员类别"
              @change="selectType"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="sel-box" v-show="type == '学生' || type == 2">
            <el-select
              v-model="className"
              placeholder="请选择班级"
              @change="selectClass"
            >
              <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="delUser">删除人员</a>

          <a class="btnDefault pointer abtn" @click="isUpload = true;files=[]"
            >上传人员</a
          >

          <div class="d-serach">
            <input
              :placeholder="inplaceholder"
              type="text"
              autocomplete="off"
              v-model="searchText"
              v-emoji
              @keyup.enter="searchByIdOrName"
            />
            <a class="searchBtn pointer" @click="searchByIdOrName"></a>
          </div>
        </div>
      </div>

      <div class="tablex_box">
        <!--学生列表-->
        <el-table
          v-if="type == '学生' || type == 2"
          class="center-tab tab-userList"
          :data="studentList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="id" label="学号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="80">
            <template slot-scope="scope">
              <span>{{
                scope.row.gender == 0
                  ? "男"
                  : scope.row.gender == 1
                  ? "女"
                  : "未知"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phoneNumber" label="号码"> </el-table-column>
          <el-table-column prop="identificationNumber" label="身份证号">
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <div>
                <a class="pointer atab-btn" @click="editInfo(scope.row)">编辑</a>
                <a class="pointer atab-btn" @click="reSetInfo(scope.row)">重置</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--教师列表-->
        <el-table
          v-if="type == 1"
          class="center-tab tab-userList"
          :data="teacherList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="id" label="工号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="gender" label="性别"  width="80">
            <template slot-scope="scope">
              <span>{{
                scope.row.gender == 0
                  ? "男"
                  : scope.row.gender == 1
                  ? "女"
                  : "未知"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phoneNumber" label="号码"> </el-table-column>
          <el-table-column prop="identificationNumber" label="身份证号">
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <div>
                <a class="pointer atab-btn" @click="editInfo(scope.row)">编辑</a>
                <a class="pointer atab-btn" @click="reSetInfo(scope.row)">重置</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--管理员列表-->
        <el-table
          v-if="type == 0"
          class="center-tab tab-userList"
          :data="adminList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="id" label="账号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="80">
            <template slot-scope="scope">
              <span>{{
                scope.row.gender == 0
                  ? "男"
                  : scope.row.gender == 1
                  ? "女"
                  : "未知"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phoneNumber" label="号码"> </el-table-column>
          <el-table-column prop="identificationNumber" label="身份证号">
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <div>
                <a class="pointer atab-btn" @click="editInfo(scope.row)">编辑</a>
                <a class="pointer atab-btn" @click="reSetInfo(scope.row)">重置</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    <!--点击上传人员弹出框-->
    <el-dialog :visible.sync="isUpload" width="600px">
      <div slot="title" class="dialog_header">人员上传</div>
      <div class="confirm_dialog_body alignCenter">
        <ul class="fileList_name">
        <li v-for="(file) in files" :key="file.id">
          <span>{{file.name}}</span> -

        </li>
      </ul>
        <div class="upload_person">
          人员列表:
          <file-upload
            style="overflow: visible"
            :maximum="1"
            :multiple="true"
            ref="upload"
            v-model="files"
            extensions="xlsx,xls"
            :post-action="uploadUrl"
            :auto-upload="false"
            @input-file="inputFile"
            @input-filter="inputFilter"
            name="excel_file"
            :headers="{ Authorization: jwt }"
          >
            <a class="a_upload"><span>点击上传人员列表</span></a>
          </file-upload>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="downloadTemplate">下载模板</a>
        <a class="btnDefault" @click.prevent="$refs.upload.active = true"
          >确认上传</a
        >
      </div>
    </el-dialog>

    <!--删除人员弹出框-->
    <el-dialog :visible.sync="isDelete" width="500px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前选中人员吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteUser">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>

    <!--修改编辑弹出框-->
    <el-dialog

      :visible.sync="editDialog"
      width="500px"
      class="personDialog"

    >
    <div slot="title" class="dialog_header">学生信息修改</div>

      <div class="editMain" >
        <el-form ref="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.name" v-emoji></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select  v-model="userInfo.gender"
              placeholder="请选择"
              @change="changeSex"
            >
              <el-option
                v-for="item in Sexoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="userInfo.identificationNumber"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfo.phoneNumber"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btnDefault" @click="editDialog = false">取消</button>
        <button class="btnDefault" @click="editUserInfo">确认修改</button>
      </span>
    </el-dialog>

    <!--重置-->
    <el-dialog
      :visible.sync="resetDialog"
      width="500px"
      class="personDialog"
    >
    <div slot="title" class="dialog_header">密码重置</div>
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
          <span class="span_icon icon_waring">是否需要重置密码！</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btnDefault" @click="resetDialog = false">取消</button>
        <button class="btnDefault" @click="editPassword">确认</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import "vue-upload-component/dist/vue-upload-component.part.css";
import FileUpload from "vue-upload-component";
import { mapState } from "vuex";
import { searchUser, searchClass, deleteUser ,modifyUser,updateUserPassword} from "@/API/api";
export default {
  data() {
    return {
        Sexoptions: [{
          value: '0',
          label: '男'
        }, {
          value: '1',
          label: '女'
        }],
      options: [
        {
          value: "2",
          label: "学生",
        },
        {
          value: "1",
          label: "教师",
        }
        /*,
        {
          value: "0",
          label: "管理员",
        },
        */
      ],
      type: "2", //人员类型选择
      classList: [
        { id: "211", name: "10年03班" },
        { id: "212", name: "10年04班" },
      ],
      className: "", //选择的班级
      inplaceholder: "请输入姓名和学号",
      searchText: "",
      studentList: [],
      teacherList: [],
      adminList: [],
      //用户总数
      total: 0,
      multipleSelection: [],
      showDel: false, //删除多选是否显示
      perPage: 10, //用户列表每页条数
      curPage: 1,
      jwt: "",
      files: [], // excel文件列表
      isDelete: false, //确认是否删除弹出框
      isUpload: false, //点击上传人员弹出框
      editDialog:false,//编辑弹出框
      userInfo: {gender:''}, //修改信息
      resetDialog:false,//重置密码是否弹出
      password:'',
      confirmPassword:'',
      id:''
    };
  },
  components: { FileUpload },
  computed: {
    ...mapState({
      uploadUrl: (state) => state.uploadUrl,
    }),
  },
  methods: {
    //页面一进来默认显示学生
    //人员类别选择
    selectType(val) {
      //表示选择的是学生
      let that = this;
      that.className = "";
      that.curPage = 1;
      that.searchText = '';
      if (val == 2) {
        that.inplaceholder = "请输入姓名和学号";
        that.searchUser(2, "", "", 1, 10);
      }
      if (val == 1) {
        that.inplaceholder = "请输入姓名和工号";
        that.searchUser(1, "", "", 1, 10);
      }
      if (val == 0) {
        that.inplaceholder = "请输入姓名和账号";
        that.searchUser(0, "", "", 1, 10);
      }
    },
    searchUser(type, search, classes, page, per_page) {
      let that = this;
      let obj = {};
      that.curPage = page;
      obj.type = type;
      obj.search = search;
      obj.classes = classes;
      obj.page = page;
      obj.per_page = per_page;
      searchUser(obj).then((res) => {
        if (res.code == 200) {
          type == 0
            ? (that.adminList = res.data.list)
            : type == 1
            ? (that.teacherList = res.data.list)
            : (that.studentList = res.data.list);
          that.total = res.data.total;

        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
    //搜索
    searchByIdOrName() {
      let that = this;
      let type = that.type;
      let search = that.searchText;
      let classes = that.className;
      that.searchUser(type, search, classes, 1, 10);
    },
    //班级选择事件
    selectClass() {
      let that = this;
      that.searchUser(2, "", that.className, 1, 10);
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
        that.isDelete = true;
      }
    },
    //确认删除当前选中的用户
    confirmDeleteUser() {
      let that = this;
      let obj = {};
      let list = [];
      for (let i = 0; i < that.multipleSelection.length; i++) {
        list.push(that.multipleSelection[i].id);
      }
      obj.delete_id_list = list;
      console.log(JSON.stringify(obj));
      deleteUser(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {

          if(that.curPage==1){
            that.curPage=1
          }else{
            that.multipleSelection.length == that.total?that.curPage = that.curPage-1:that.curPage = that.curPage;

          }
          that.searchUser(that.type, that.searchText, that.className,that.curPage, 10);


          that.showDel = !that.showDel;
          that.isDelete = false;
        } else {
          that.$toast(res.message, 3000);
        }
      });
      console.log("删除用户");
    },
   //点击编辑
      editInfo(obj){
        let that = this;
        that.editDialog = true;
        console.log(obj)
        that.userInfo =  Object.assign({}, obj)
        that.userInfo.gender = obj.gender==0?'男': obj.gender==1?'女':'未知'

      },
      //点击重置
      reSetInfo(obj){
         console.log(obj)
         let that = this;
         that.resetDialog = true;
         that.id = obj.id;
      },

      //密码重置确认
      editPassword(){
        let that = this;
        let list = []
        list.push(that.id)
        let obj = {};
        obj.user_id_list = list;
        obj.password = '12345678';
        console.log(JSON.stringify(obj))
        updateUserPassword(JSON.stringify(obj)).then(res=>{
          if(res.code==200){
            that.resetDialog = false;
            this.$toast("密码已重置",2000)
           that.searchUser(that.type, that.searchText, that.className, that.curPage, 10);
          }else{
            this.$toast(res.message,3000)
          }
        })
      },

    //信息确认修改
    editUserInfo(){
      let that = this;
      if(that.userInfo.name == null || that.userInfo.name == ''){
        this.$toast("姓名不能为空",3000);
        return false;
      }
      if(that.userInfo.identificationNumber == null || that.userInfo.identificationNumber == ''){
        this.$toast("请输入身份证",3000);
        return false;
      }
       if(that.userInfo.phoneNumber == null || that.userInfo.phoneNumber == ''){
        this.$toast("请输入手机号",3000);
        return false;
      }
      var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if(!p.test(that.userInfo.identificationNumber)){
        this.$toast("身份证号错误",3000);
        return false;
      }
      var phone = that.userInfo.phoneNumber;
      if(!(/^1\d{10}$/.test(phone))){
        this.$toast("手机号码错误",3000);
        return false;
      }
      let obj = {};
      obj.user_id = that.userInfo.id;
      obj.name = that.userInfo.name;
      obj.gender = that.userInfo.gender == '男'?0:1;
      obj.identification_number = that.userInfo.identificationNumber;
      obj.phone = that.userInfo.phoneNumber;
      let a = that.curPage
      console.log(JSON.stringify(obj));
      modifyUser(JSON.stringify(obj)).then(res=>{
        if(res.code==200){
          this.$toast("信息修改成功",2000)
          that.editDialog = false;
          that.searchUser(that.type, that.searchText, that.className, that.curPage, 10);
        }else{
          this.$toast(res.message,2000)
        }
      })
      console.log(that.userInfo.id)
    },
    //性别改变
    changeSex(selVal){
      let that =  this;
      //元素修改
      that.userInfo.gender = selVal
    },
      //点击关闭修改弹出框
    handleClose(){
      let that = this;
      that.editDialog = false;
      that.resetDialog = false;
    },

    //底部分页
    handleCurrentChange(val) {
      let that = this;
      console.log(that.type);
      that.curPage = val;
      that.searchUser(that.type, "", that.className, val, 10);
      console.log(`当前页: ${val}`);
    },
    upLoad() {
      this.$refs.upload.active = true;
    },
    //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        console.log(extension);
        if (extension != "xlsx" && extension != "xls") {
          this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
          return prevent();
        }
      }
    },
    //学生列表
    searchUser1() {
      let that = this;
      that.searchUser(2, "", "", 1, 10);
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

    //下载模板
    downloadTemplate() {
      console.log("下载模板");
      window.location.href = 'http://ibwedu.f3322.net:8111/download_excel';
    },

    // 文件上传成功
    handleSuccess(res, file, fileList) {
      this.$message.success("上传成功");
    },

    //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
      let that = this;
      console.log('123')
      /*
      if ( Boolean(newFile) !== Boolean(oldFile) ||oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
      */
      if (newFile && oldFile) {
        //add
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          //console.log('response', newFile.response)
          let response = newFile.response;
          console.log(newFile.response)
          if (response.code == 200) {
            this.$message.success("上传成功");
            that.isUpload = false;
            that.searchUser(2, "", "",that.curPage, that.perPage);

          } else {
            that.isUpload = false;
            this.$message.error(response.message);
          }
          if (newFile.xhr) {
            //  Get the response status code
            console.log("status", newFile.xhr.status);
          }
        }
      }
      if (newFile && oldFile) {
        // update
        console.log("update", newFile);
      }
      if (!newFile && oldFile) {
        // remove
        console.log("remove", oldFile);
      }
    }
  },
  mounted() {
    let that = this;
    that.jwt = sessionStorage.getItem("jwt");
    that.searchUser1();
    that.searchClass();
  },
};
</script>
<style lang="less" scoped>
.stu_upload {
  width: 100px;
  margin-right: 20px;
  cursor: pointer;
}
.excel_file {
  cursor: pointer;
}
.fileList_name{
  font-size: 18px;color:@tabcolor;
  li{margin-bottom:8px;}
}
@import url(../../assets/less/admin.less);

.atab-btn{margin:0 10px;}
.editMain{margin: 0 30px;}
</style>
