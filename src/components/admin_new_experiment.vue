<template>
  <div>
    <el-dialog
      class="dialog_pagination admin_dialog_newExperiment"
      :visible.sync="isNew_experiment"
      width="1100px"
      @close="cleanData"
    >
      <div slot="title" class="dialog_header">新增实验</div>
      <div class="newdialog_body">
        <div class="new_nav">
          <a class="pointer" @click="tab_basic" :class="{ active: curIndex == 1 }"
            ><span class="num">1</span> 基本资料</a
          >
          <a class="pointer" @click="tab_virtualMachine" :class="{ active: curIndex == 2 }"
            ><span class="num">2</span> 选择镜像</a
          >
          <a class="pointer" @click="tab_step" :class="{ active: curIndex == 3 }"
            ><span class="num">3</span> 实验步骤</a
          >
          <a class="pointer" @click="tab_finish" :class="{ active: curIndex == 4 }"
            ><span class="num">4</span> 完成发布</a
          >
        </div>
        <!--基本资料-->
        <div class="baseInfo" v-if="curIndex == 1">
          <div class="fromBox">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>所属分类：</span >
                <el-cascader
                   v-model="category"
                   :options="categoryOptions"
                   :props="{value: 'id', label: 'name',children: 'cates'}"
                   @change="handleChange" clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验名称：</span >
                <el-input v-model="form.name" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验时长：</span >
                   <div class="dselect">
                        <el-select v-model="form.duration" placeholder="请选择" style="width:50%">
                            <el-option
                            v-for="item in timeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验描述：</span >
                <el-input
                  v-model="form.introduction"
                  type="textarea"
                  :rows=3
                   resize="none"
                   maxLength = '200'
                ></el-input>
              </el-form-item>
              <!--
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验建议：</span >
                <el-input v-model="form.advice" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验报告：</span >
                <el-input v-model="form.report" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验任务：</span >
                <el-input v-model="form.task" type="textarea"></el-input>
              </el-form-item>
              -->
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验封面：</span >
                <div class="upload_box clearfix">
                  <div class="left_pic">
                    <div class="picbox">
                      <div class="" v-for="(file, index) in files" :key="index">
                        <img
                          class="td-image-thumb"
                          v-if="file.thumb"
                          :src="file.thumb"
                        />
                      </div>
                    </div>
                    <p class="mess">
                      （上传图片比例为360x200的，支持.png.jpg.gif.webp）
                    </p>
                  </div>
                  <div class="bupload_btn_box">
                    <file-upload
                      style="overflow: visible"
                      :maximum="1"
                      :multiple="true"
                      ref="upload"
                      v-model="files"
                      extensions="jpg,gif,png,webp"
                      :post-action="uploadUrl"
                      :auto-upload="false"
                      @input-file="inputFile"
                      @input-filter="inputFilter"
                      name="excel_file"
                      :headers="{ Authorization: jwt }"
                    >
                      <a class="btnDefault a_upload">
                        <span>上传图片</span>
                      </a>
                    </file-upload>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- <div class="btnBox">
            <a class="btnDefault pointer" @click="confirm_baseInfo">确认</a>
          </div> -->
        </div>
        <!--选择虚拟机-->
        <div class="virtualMachineList" v-if="curIndex == 2">
          <div class="pageTab clearfix">
            <div class="fl">
              <div class="sel-box">
                <el-select
                  v-model="type"
                  placeholder="镜像类型"
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
            </div>
            <div class="fr">
              <div class="d-serach">
                <input
                  :placeholder="inplaceholder"
                  type="text"
                  autocomplete="off"
                  v-model="searchTx"
                  v-emoji
                  @keyup.enter="getImagequoteList"
                />
                <a class="searchBtn pointer"  @click="getImagequoteList"></a>
              </div>
            </div>
          </div>
          <div class="imageReposity_box">
            <el-table
              class="center-tab admin_dialog_experlist"
              :data="Imagelibraries"
              @selection-change="handleSelectionChange"
              style="width: 100%"
              :header-cell-class-name="cellClass"

              ref="multipleTable"

            >
              <el-table-column type="selection" width="55"> </el-table-column>

              <el-table-column prop="name" label="名称" width="240">
              </el-table-column>
              <el-table-column prop="type" label="镜像类型">
                <template slot-scope="scope">
                  <span>{{ scope.row.kind == 1 ? "图形化界面" : "命令行" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="size" label="容量"> </el-table-column>
              <el-table-column prop="introduction" label="简介" width="280">
              </el-table-column>
              <el-table-column prop="quotecount" label="被引用次数">
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer">
            <div class="footer_box clearfix">
              <!-- <a class="btnDefault fl pointer" @click="curIndex=3">确认选择</a> -->

              <div class="tab-pagination fr">
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
        </div>

        <!--steps-->
        <div class="steps" v-if="curIndex==3">
            <div class="steps_main">
               <quill-editor
                      v-model="yourContent"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                  >
                </quill-editor>
            </div>
            <div class="btnbox">
                <!--<a class="btnDefault pointer" @click="newStep">新建步骤</a>-->
                <!-- <a class="btnDefault pointer" @click="confirmStep">步骤确认</a> -->
            </div>
        </div>

        <!--complete-->
        <div class="steps pp_complete" v-if="curIndex==4">
             <div class="confirm_info">
                 <div class="d-confirm">
                    <div class="d-cel clearfix">
                        <label>实验名称：</label>
                        <div>{{form.name}}</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验时长：</label>
                        <div>{{form.duration}}</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验描述：</label>
                        <div>{{form.introduction}}</div>
                    </div>
                    <!-- <div class="d-cel clearfix">
                        <label>实验建议：</label>
                        <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本 文本</div>
                    </div> -->
                    <!-- <div class="d-cel clearfix">
                        <label>实验报告：</label>
                        <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本 文本</div>
                    </div> -->
                    <!-- <div class="d-cel clearfix">
                        <label>实验任务：</label>
                        <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本 文本</div>
                    </div> -->
                    <div class="d-cel clearfix">
                        <label>实验封面：</label>
                        <div>
                            <div class="d-cover"><img :src="files.length>0?files[0].thumb:''"/></div>
                        </div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验步骤：</label>
                        <div class="step-div">
                            <p v-html="yourContent"></p>
                        </div>
                    </div>
                 </div>
             </div>
             <div class="btnbox">
                <a class="btnDefault pointer" @click="confirmNewExperimentBef">确认新增</a>
            </div>

        </div>

      </div>
    </el-dialog>
       <!--点击新建实验按钮前确认弹框-->
           <el-dialog :visible.sync="innerVisible" width="600px">
              <div slot="title" class="dialog_header">新建实验</div>
              <div class="confirm_dialog_body">
              <p class="dialog_mess">
              <!--成功span的class为icon_success-->
              <span class="span_icon icon_success">确认新建名为：{{form.name}}的实验？</span>
              </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="confirmNewExperiment">确 认</a>
                <a class="btnDefault" @click="innerVisible = false">取 消</a>
              </div>
            </el-dialog>
  </div>
</template>
<script>
import FileUpload from "vue-upload-component";
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import {findParentCategory,findChildCategory,insertExperiment,getImagequoteList,upload} from '@/API/api';
export default {
  data() {
    return {
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
      curIndex:1,
      innerVisible:false,
      form: {
        name: "",
        duration: "",
        introduction: "",
        advice: "",
        report: "",
        task: "",
        cover: "",
        cateId:'',
        images:[]



      },

      category:[],//实验所属分类
      categoryOptions: [],
      multipleSelection:[],
      inplaceholder: "请输入镜像名称",
      isNew_experiment: false,
      uploadUrl: "",
      jwt: "",
      files: [],
      options: [
        // { value: "1", label: "KVM" },
        { value: "-1", label: "全部"},
        { value: "0", label: "命令行" },
        { value: "1", label: "图形化界面"} ,
      ],
      type: "-1", //镜像类型
      //新增镜像
      Imagelibraries: [
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 1, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 1, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 1, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
      ],
      total: 0,
      perPage: 8,
      curPage: 1,
      steps:[{text:''}],//实验步骤
      yourContent:'',
      editorOption:{},
      searchTx:'',
      isDisable:true
    };
  },
  components: {
    FileUpload,quillEditor
  },
  created(){

    this.editorOption={
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
            }
  },
    mounted(){

    },
  methods: {

    cellClass (row) {

      if (row.columnIndex === 0) {//将第一行消除
        return 'disabledCheck'
      }
    },
      //查询分类
      findParentCategory(){
          let that = this;
          findParentCategory().then(res=> {
              if(res.code==200){
                  that.categoryOptions = res.data;
                  for (let index = 0; index < that.categoryOptions.length; index++) {
                    that.findChildCategory(that.categoryOptions[index].id)

                  }
              }else{
                  this.$toast(res.message,2000)
              }
          })
      },

    //实验所属分类选择
    handleChange(value) {
       let that = this
       console.log(value.length==1?value[0]:value[1]);
       that.form.cateId = value.length==1?value[0]:value[1]
    },
    //根据一级分类id查询二级分类
        findChildCategory(cateId){
          let that = this
          let obj={}
          obj.parent_category_id = cateId
          findChildCategory(obj).then(res=> {
                if(res.code==200){
               let catesons = res.data
                   if(catesons.length>0){
                  for(let i = 0; i <  that.categoryOptions.length; i++) {
                    if(that.categoryOptions[i].id === cateId) {
                        that.$set(that.categoryOptions[i], 'cates', catesons) // right
                       break;
                     }
                    }
                  }
                }else{
                    that.$toast(res.message,3000)
                }
            })

        },
        //查询所有镜像
      getImagequoteList(){
          let that = this;
          let obj = {};
          obj.kind = that.type;
          obj.imageName = that.searchTx;
          obj.page = 1;
          obj.perPage = 10;
          getImagequoteList(obj).then(res=> {
              if(res.code==200){
                  console.log(res.data)
                  that.Imagelibraries = res.data.list;
                  that.total = res.data.total
                   for(let i = 0;i<res.data.list.length;i++){
                        res.data.list[i].size = (res.data.list[i].size/(1024 * 1024)).toFixed(2) + "MB"
                    }
              }else{
                  this.$toast(res.message,2000)
              }
          })
      },
    //选择实验类型
    selectType(val) {
      let that =this
      that.getImagequoteList()
      console.log(val);
    },
    click_new() {
      let that = this;
      that.findParentCategory();
       that.getImagequoteList()
      that.isNew_experiment = true;
    },

     tab_basic(){
        let that = this
        that.form.images=[]
        for (let index = 0; index < that.multipleSelection.length; index++) {
          that.form.images.push( that.multipleSelection[index].id)
        }

        that.curIndex = 1
      },
    tab_virtualMachine(){
        let that = this
        if(that.form.name ==''){
          return  that.$toast('请输入实验名称',2000)
        }
        if (that.form.cateId=='') {
          return that.$toast('请选择所属分类',2000)
        }
        if (that.form.duration=='') {
          return that.$toast('请选择实验时长',2000)
        }
        if (that.form.introduction=='') {
          return that.$toast('请输入实验描述',2000)
        }
        if (that.files.length==0) {
          return that.$toast('请上传实验封面',2000)
        }

        this.curIndex = 2
        console.log('Imagelibraries'+this.multipleSelection)
        console.log('multipleSelection'+this.multipleSelection)

        that.$nextTick(function(){
          for (let i = 0; i < that.Imagelibraries.length; i++) {
              for (let j = 0; j < that.form.images.length; j++) {
                if(that.Imagelibraries[i].id ==  that.form.images[j]){
                      that.$refs.multipleTable.toggleRowSelection(that.Imagelibraries[i],true);

                  }

          }

        }
        })

    },
    tab_step(){
        let that = this
        that.form.images=[]
        for (let index = 0; index < that.multipleSelection.length; index++) {
          that.form.images.push( that.multipleSelection[index].id)
        }
        console.log( that.form.images)
        if(that.form.name ==''){
          return  that.$toast('请输入实验名称',2000)
        }
        if (that.form.cateId=='') {
          return that.$toast('请选择所属分类',2000)
        }
        if (that.form.duration=='') {
          return that.$toast('请选择实验时长',2000)
        }
        if (that.form.introduction=='') {
          return that.$toast('请输入实验描述',2000)
        }
        if (that.files.length==0) {
          return that.$toast('请上传实验封面',2000)
        }
        if (that.form.images.length==0) {
          return that.$toast('请至少选择一台镜像',2000)
        }

        this.curIndex = 3


    },
        tab_finish(){
        let that = this
        that.form.images=[]
        for (let index = 0; index < that.multipleSelection.length; index++) {
          that.form.images.push( that.multipleSelection[index].id)
        }
        if(that.form.name ==''){
          return  that.$toast('请输入实验名称',2000)
        }
        if (that.form.cateId=='') {
          return that.$toast('请选择所属分类',2000)
        }
        if (that.form.duration=='') {
          return that.$toast('请选择实验时长',2000)
        }
        if (that.form.introduction=='') {
          return that.$toast('请输入实验描述',2000)
        }
        if (that.files.length==0) {
          return that.$toast('请上传实验封面',2000)
        }
        if (that.form.images.length==0) {
          return that.$toast('请至少选择一台镜像',2000)
        }
        if (that.yourContent=='') {
          return that.$toast('请输入实验步骤',2000)
        }
        this.curIndex = 4

    },
    /*tab选择 */
    handleSelectionChange(val) {
      let that = this
      that.multipleSelection = val;

      console.log( that.form.images);
    },
    //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      const isLt10M = newFile.size / 1024 / 1024 < 10;
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        console.log(extension);
        if (
          extension != "jpg" &&
          extension != "gif" &&
          extension != "png" &&
          extension != "webp"
        ) {
          this.$toast("只能上传图片", 3000);
          return prevent();
        }
        if (!isLt10M) {
          this.$toast("上传图片的大小不能超过 10M!", 3000);
          return prevent();
        }
      }

      if (
        newFile &&
        newFile.error === "" &&
        newFile.file &&
        (!oldFile || newFile.file !== oldFile.file)
      ) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }
    },

    //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
      let that = this;
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
          console.log(this.files);
          if (response.code == 200) {
            this.$message.success("文件上传成功");

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
        console.log("update", newFile);
      }
      if (!newFile && oldFile) {
        // remove
        console.log("remove", oldFile);
      }
    },
    //基本资料确认
    confirm_baseInfo() {
      let that = this;
      that.curIndex = 2;
    },
    //弹窗分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    //点击新建步骤
    newStep(){
        let that = this;
        that.steps.push({text:''})
    },

    //点击步骤确认
    confirmStep(){
        let that = this
        that.curIndex = 4;
    },
    //新增前确认
    confirmNewExperimentBef(){
        let that = this;
        if(that.form.name ==''){
          return  that.$toast('请输入实验名称',2000)
        }
        if (that.form.cateId=='') {
          return that.$toast('请选择所属分类',2000)
        }
        if (that.form.duration=='') {
          return that.$toast('请选择实验时长',2000)
        }
        if (that.form.introduction=='') {
          return that.$toast('请输入实验描述',2000)
        }
        if (that.files.length==0) {
          return that.$toast('请上传实验封面',2000)
        }
        if (that.yourContent=='') {
          return that.$toast('请输入实验步骤',2000)
        }
        if (that.form.images.length==0) {
          return that.$toast('请至少选择一台镜像',2000)
        }
        that.innerVisible = true
    },
    //确认新增实验
    confirmNewExperiment(){
        let that = this;
        let imageUpload= new FormData()
        imageUpload.append('type',0)
        imageUpload.append('file',that.files[0].file)
        upload(imageUpload).then(res=>{
          if (res.code==200) {
            console.log(res.data)
            that.form.cover=res.data.name
            that.commitExprement()
          }else {
            that.$toast(res.message,3000)
         }
      })





    },
    //清除数据
    cleanData(){
      let that = this
      that.category = []
      that.curIndex =1
      that.form.name= ''
      that.yourContent= ''
      that.form.duration= ''
      that.form.cateId= ''
      that.form.introduction =''
      that.form.images=[]
      that.files=[]
      that.form.cover=''
      that.multipleSelection=[]
    },
    //新增实验
    commitExprement(){
      let that = this
      if(that.isDisable) {
        that.isDisable = false;
        let obj = {}
        obj.name = that.form.name
        obj.pic_url = that.form.cover
        obj.step = that.yourContent
        obj.duration = that.form.duration
        obj.category_id = that.form.cateId
        obj.introduce = that.form.introduction
        obj.images = that.form.images

        insertExperiment(obj).then(res => {
          that.isDisable = true;
          if (res.code == 200) {
            that.isNew_experiment = false
            that.$parent.findExperiment(1)
            that.innerVisible = false
          } else {
            //console.log(res.message)
            that.innerVisible = false
            that.$toast(res.message, 3000)
          }
        })
      }
    },
      onEditorBlur(){}, // 失去焦点事件
      onEditorFocus(){}, // 获得焦点事件


  },
};
</script>
<style lang="less" scoped>
@import url(../assets/less/admin.less);
.newdialog_body {
  .new_nav {
    padding: 20px 0; font-size: 0px;
    a {
      font-size: 18px; color: @tabcolor; display: inline-block; width: 22%; text-align: center; margin: 0 1.5%; background: @dialog_nav; padding: 10px 0; line-height: 22px;
    }
    .num {
      min-width: 20px; height: 20px; line-height: 20px; border: 1px solid @tabcolor; display: inline-block; vertical-align: top;
      .borderRadius(50%,50%,50%,50%);
    }
    a.active {
      color: @fontfff; background: @basecolor;
      .num { border-color: @fontfff; }
    }
  }
}
.baseInfo {
  min-height: 600px;
  .btnBox {
    padding-bottom: 20px; text-align: center;
  }
  .left_pic {
    width: 320px; display: inline-block;
  }
  .s-label {
    font-size: 18px; color: @tabcolor;
    > span { color: #d82a2a; }
  }
  .fromBox {
    width: 600px; margin: 0 auto; }
  .picbox {
    width: 320px; height: 160px; border: 1px solid @border;
    .borderRadius(5px,5px,5px,5px);
    > div { position: relative; width: 320px; height: 160px; overflow: hidden; }
    img { width: 320px; position:absolute;left:50%;top:50%;
           position:absolute;left:50%;top:50%;
        transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%);
        -moz-transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        -o-transform:translate(-50%,-50%);
    }
  }
  .mess { color: @hnavcolor; line-height: normal; }
  .bupload_btn_box { display: inline-block; vertical-align: bottom; margin-bottom: 40px; margin-left: 20px; }
}
.virtualMachineList {
  min-height: 600px;
  .footer_box {
    margin: 0 20px; padding: 20px 0;
    .tab-pagination { margin-top: 10px; }
  }
  .dialog_experlist th { background: @dialog_nav; }
  .imageReposity_box { margin: 0 20px; }
}

/**steps */
.steps{
    min-height: 500px;
    .steps_main{margin: 0 160px;}
     .s-label {
        font-size: 18px; color: @tabcolor;
        > span { color: #d82a2a; }
    }
    .adel{width:20px;height:20px;display:block;background: url(../assets/img/icon_del.png) center no-repeat; position:absolute; right:0px;top:50%;margin-top: -10px;}
    .btnbox{
        text-align:center; padding-bottom: 40px; padding-top: 20px;
        a.btnDefault{width:160px;margin: 0 20px;}
    }
}
/*pp_complete */
.pp_complete{
    .btnbox{padding-top:30px;}
    .confirm_info{min-height:300px; margin: 0 60px;border:1px solid @border; font-size: 18px; color: @tabcolor; padding:20px 0;}
    .d-confirm{width:70%;margin: 0 auto;}
    label{float: left;}
    .d-cel{padding:4px 0}
    .d-cel >div{padding-left:100px;}
    .d-cover{width:320px;height: 160px;border:1px solid @border;.borderRadius(5px,5px,5px,5px); overflow: hidden; position: relative;}
    img{
        position:absolute;left:50%;top:50%; max-width: 100%;
        transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%);
        -moz-transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        -o-transform:translate(-50%,-50%);
    }
    .step-div p{padding-bottom: 3px;}
}
</style>
