<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="type" placeholder="镜像类型" @change="selectType" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>

        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="delDataList">删除镜像</a>
          <a class="btnDefault pointer abtn" @click="show_Add=true">新增镜像</a>
          <div class="d-serach">
            <input :placeholder="inplaceholder" type="text" autocomplete="off" v-model = "searchText" v-emoji @keyup.enter="searchImage"/>
            <a class="searchBtn pointer" @click="searchImage"></a>
          </div>
        </div>
      </div>

      <div class="tablex_box list_box">

       <template v-if="isHasData">
       <div class="tablex_box imageReposittory_table " :class="{'no_imageReposittory_table':Imagelibraries.length==0}">
        <!--镜像列表-->
        <el-table
          class="center-tab tab-userList"
          :data="Imagelibraries"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>

          <el-table-column prop="name" label="名称" width="240">
          </el-table-column>
          <el-table-column prop="type" label="镜像类型">
            <template slot-scope="scope">
              <span>{{
                scope.row.kind == 0
                  ? "命令行"
                  : "图形化界面"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="容量"> </el-table-column>
          <el-table-column prop="introduction" label="简介" width="280">
          </el-table-column>
           <el-table-column prop="quotecount" label="被引用次数">
          </el-table-column>
        </el-table>
        </div>
        <div class="tab-pagination imageReposittory_pagination">
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

        <nodata dataMess="镜像库暂无内容" noDataType='1' v-if="!isHasData"></nodata>

      </div>
    </div>

     <!--删除镜像弹出框-->
    <el-dialog :visible.sync="isDelete" width="500px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前选中镜像吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteList">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>

    <!--新增镜像弹出框-->
    <el-dialog class="dialog_add_mirroring dialog_body_nopadding_bottom"
      @close="Mirroring.name='',Mirroring.introduction='',kind='',Mirroring.url=''"
      :visible.sync="show_Add"
      width="600px"
     >
      <div slot="title" class="dialog_header">
          新增镜像
      </div>
      <div class="confirm_dialog_body">
          <div class="dialog_add_body">
          <el-form ref="form" label-width="100px">
                <el-form-item label="镜像名称:">
                    <el-input v-model="Mirroring.name" maxlength='100'></el-input>
                </el-form-item>
                 <el-form-item label="镜像简介:">
                    <el-input v-model="Mirroring.introduction" type="textarea" rows="3" resize="none" maxlength='200'></el-input>
                </el-form-item>
              <el-form-item label="镜像类型:">
              <el-select v-model="kind" @change="selectKind" >
                  <el-option v-for="item in optionsKind" :key="item.value" :label="item.label" :value="item.value" > </el-option>
              </el-select>
              </el-form-item>
                  <el-form-item label="镜像路径:">
                      <el-input v-model="Mirroring.url" type="textarea" rows="3" resize="none" maxlength='100'></el-input>
                  </el-form-item>
                <!--
                <el-form-item label="">
                    <ul class="fileList_name">
                        <li v-for="(file) in files" :key="file.id">
                        <span>{{file.name}}</span>
                        </li>
                    </ul>
                    <div class="upload_person">
                        <file-upload
                            style="overflow: visible"
                            :maximum="1"
                            :multiple="true"
                            ref="upload"
                            v-model="files"
                            extensions=""
                            :post-action="uploadUrl"
                            :auto-upload="false"
                            @input-file="inputFile"
                            @input-filter="inputFilter"
                            name="excel_file"
                            :headers="{ Authorization: jwt }"
                        >
                            <a class="a_upload pointer"><span>添加镜像</span></a>
                        </file-upload>
                    </div>
                </el-form-item>
                -->
          </el-form>

          </div>
      </div>

        <div slot="footer" class="dialog-footer ">
          <a class="btnDefault"  @click="confiremNew">确认上传</a>

      </div>
      </el-dialog>
      <loading  @hideLoading="hideLoading" v-if="showLoading"></loading>

  </div>
</template>
<script>
import { mapState } from "vuex";
//import FileUpload from "vue-upload-component";
import {getImagequoteList,deleteImages,addImage} from '@/API/api';
import loading from '@/components/loading.vue'
import nodata from '@/components/noData'
export default {
  data() {
    return {
     options: [{ value: "-1", label: "全部"},{ value: "0", label: "命令行"}, { value: "1", label: "图形化界面"} ],
      optionsKind: [ { value: "0", label: "命令行"}, { value: "1", label: "图形化界面"} ],
     type: "", //
      className: "", //
      inplaceholder: "请输入镜像名称",

      //新增镜像
      Imagelibraries:[
           ],
        total:1,
      showDel: false, //删除多选是否显示
      perPage:8, //虚拟机每页
      curPage:1,
      show_Add:false,//虚拟机释放弹出框显示
      dialog_machine:'',
      multipleSelection:[],//删除镜像库的选择
      isDelete:false,//是否删除弹出框
      Mirroring:{//新增镜像对象
          name:'',
          introduction:'',
          url:''
      },
      jwt:'',
      uploadUrl:'',
      files:[],
      showLoading:false,
      isHasData:true,//是否有数据 默认有数据
      kind:'',
      searchText:''
    };
  },
  components:{
    loading,nodata
      //FileUpload
  },
  computed: {
    ...mapState({
      state: (state) => state,
    }),
  },
  methods: {
    //人员类别选择
    selectType(val) {
      //表示选择的是学生
      let that = this;
      if (val == 0) {
        console.log('KVM')
      }
      if (val == 1) {
        console.log('Docker')
      }
        that.getImagequoteList(val,that.searchText,1);
    },
      searchImage(){
          let that = this;
          if(that.kind == ''){
            that.kind = -1
          }
          that.getImagequoteList(that.kind,that.searchText,1);
      },
      selectKind(val){
        let that = this;

          that.kind = val
      },
      findAllImagequoteList(){
          let that = this;
          that.getImagequoteList(-1,'',1);
      },
      //查询所有镜像
      getImagequoteList(kind,imageName,page){
          let that = this;
          let obj = {};
          obj.kind = kind;
          obj.imageName = imageName;
          obj.page = page;
          obj.perPage = that.perPage;
          console.log(obj)
          getImagequoteList(obj).then(res=> {
              if(res.code==200){
                  for(let i = 0;i<res.data.list.length;i++){
                    res.data.list[i].size = (res.data.list[i].size/(1024 * 1024)).toFixed(2) + "MB"
                  }
                  that.Imagelibraries = res.data.list;
                  that.total = res.data.total
                  res.data.total==0 ? that.isHasData = false :that.isHasData = true
              }else{
                  this.$toast(res.message,2000)
              }
          })
      },


    //删除镜像点击
    delDataList() {
      let that = this;
      if (that.multipleSelection.length <= 0) {
        that.showDel = !that.showDel;
      } else {
        that.isDelete = true;
      }
    },
      handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //确认删除镜像列表
    confirmDeleteList(){
        let that = this;
        let obj = {};
        let list = [];
        for(let i =0;i<that.multipleSelection.length;i++){
            list.push(that.multipleSelection[i].imageid)
        }
        obj.imagesID = list;
        console.log(obj)
        deleteImages(obj).then(res=> {
            if(res.code==200){
                that.isDelete = false;
                that.getImagequoteList(-1,'',1);
            }else{
                that.isDelete = false;
                this.$toast(res.message,3000)
                console.log(res)
                that.getImagequoteList(-1,'',1);
            }
        })
        console.log('确认删除镜像'+that.multipleSelection[0].imageid)
    },

     //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        console.log(extension);
        // if (extension != "xlsx" && extension != "xls") {
        //   this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
        //   return prevent();
        // }
      }
    },
        //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
      let that = this;
      console.log('123')

      if ( Boolean(newFile) !== Boolean(oldFile) ||oldFile.error !== newFile.error) {
        // if (!this.$refs.upload.active) {
        //   this.$refs.upload.active = true;
        // }
      }

      if (newFile && oldFile) {
        //add
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          //console.log('response', newFile.response)
          let response = newFile.response;
          console.log(this.files)
          if (response.code == 200) {
            // this.$message.success("文件上传成功");
            // that.searchUser(2, "", "", 1, 10);

          } else {
            this.$message.error("文件上传失败");
          }
          if (newFile.xhr) {
            //  Get the response status code
            console.log("status", newFile.xhr.status);
          }
        }
      }
      if (newFile && oldFile) {
        // update
        //console.log("update", newFile);
      }
      if (!newFile && oldFile) {
        // remove
        //console.log("remove", oldFile);
      }
    },
    //底部分页
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      let that = this;
      that.getImagequoteList(that.kind,that.searchText,val);
    },
    upLoad() {
      this.$refs.upload.active = true;
    },

    //镜像确认上传
    confiremNew(){
      let that = this;
      if(that.Mirroring.name == ''){
         return that.$toast('请输入镜像名称',2000)
      }

      if(that.Mirroring.introduction == ''){
         return that.$toast('请输入镜像简介',2000)
      }

      if(that.kind ==-1 || that.kind ==''){
         return that.$toast('请选择镜像类型',2000)
      }
      that.show_Add = false
      let obj = {};
      obj.imageName = that.Mirroring.name;
      obj.introduction = that.Mirroring.introduction;
      obj.kind = that.kind ;
      obj.url = that.Mirroring.url;
        addImage(obj).then(res=> {
            that.kind = '';
            if(res.code==200){
                that.show_Add = false
                this.$toast("上传成功，请稍后查看",3000)
                that.getImagequoteList(-1,'',1);
            }else{
                that.show_Add = false
                this.$toast("上传失败",3000)
                that.getImagequoteList(-1,'',1);
            }
        })
    },
    //隐藏loading
    hideLoading(){
       let that = this
       that.showLoading = false;
    }


  },
    mounted() {
        let that = this;
        that.findAllImagequoteList();
    }
};
</script>
<style lang="less" scoped>
.stu_upload{width:100px; margin-right: 20px; cursor: pointer;}
.excel_file{cursor: pointer;}
@import url(../../assets/less/admin.less);
</style>
