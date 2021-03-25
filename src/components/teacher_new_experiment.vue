<template>
  <div>
    <!--新增实验选择-->
    <el-dialog
      class="dialog_pagination"
      :visible.sync="isnewFilter"
      :width="isnewFilterType == 1 ? '1100px' : '600px'"
      :class="{ newCourseware_dialog: isnewFilterType == 0 }"
      @close="searchTx='',parentId='',childrenId='',curPage=1"
    >
      <!--实验库选择-->
      <template v-if="isnewFilterType == 1">
        <div slot="title" class="dialog_header">实验库选择</div>
        <div class="pageTab clearfix nopaddingBottom">
          <div class="fl">
            <div class="sel-box">
              <el-select v-model="parentId" placeholder="自定义分类" @change="selectType" >
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" > </el-option>
              </el-select>
            </div>
            <div class="sel-box" v-if="parentId!=''">
              <el-select v-model="childrenId" placeholder="自定义分类" @change="selectType1" >
                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id" > </el-option>
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
                @keyup.enter="search"
              />
              <!-- <a class="searchBtn pointer" @click="search"></a> -->
            </div>
            <a class="btn_finsh" @click="search">查询</a>
          </div>
        </div>
        <noData :noDataType="noDataType" :dataMess="dataMess" v-if="!hasData"></noData>
        <template v-if="hasData">
        <div class="list_box">
          <div class="div_checked">
            <span v-for="(item, index) in chooseList" :key="index">
              {{ item.name }}
              <a
                class="icon icon_close pointer"
                @click="deleteSel(item, index)"
              />
            </span>
          </div>
          <ul class="list_ul clearfix">
              <li v-for="(item,index) in all_experimentList" :key="index">
                  <div class="info">


                       <div class="pic">
                            <div class="pic_box"><img :src="item.pic_url"/></div>
                            <div class="trans"></div>
                        </div>
                      <p class="p-text textline1">{{item.name}}</p>
                      <p class="p-text textline1">实验时长：{{item.duration}}分钟</p>
<!--                      <p class="p-text textline1">截止时间：{{item.endtime}}</p>-->
                       <a
                      class="icon icon_radio pointer"
                      :class="{ icon_radio_h: item.checked }"
                      @click="click_checked(item, index, item.checked)"
                    ></a>
                  </div>
              </li>
          </ul>

        </div>
        <div slot="footer" class="clearfix">
          <a class="btnDefault fl pointer" @click="confirmChoose">确认选择</a>

          <div class="tab-pagination fr">
            <el-pagination
              background
              :current-page.sync="curPage"
              :page-size="perPage"
              @current-change="handleCurrentChange1"
              layout="prev, pager, next,jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
        </template>
      </template>
    </el-dialog>
  </div>
</template>
<script>

import toastVue from "./toast/toast.vue";
import {findParentCategory,findChildCategory,findAllByCategoryId,bindExperiments,findAllExperimentByCategoryId} from '@/API/api';
import noData from '@/components/noData.vue'
export default {
  inject:['reload'],
  data() {
    return {
      inplaceholder: "请输入实验名称",
        all_experimentList:[
          ],

      total: 1,
      searchTx:'',
      perPage: 10, //8个实验一页
      curPage: 1, //设备列表
      options:[],
      options1:[],
      customClass: [
        { value: "1", label: "场景篇" },
        { value: "2", label: "原理篇" },
      ], //自定义分类
      i_customClass: [
        { value: "1", label: "场景篇" },
        { value: "2", label: "原理篇" },
      ], //自定义分类
      customType: "",
      i_customType: "",
      isnewFilter: false,
      isnewFilterType: 0, //实验库选择 1代表本地实验库  2代表本地上传

      chooseList: [], //实验被选择列表
      parentId:'',
      childrenId:'',
      count:'',//节下已有的实验，不能超过五个
      sindex:'',//节id
      noDataType:1,  //没有数据展示的样式
      dataMess:'当前暂无实验',
      hasData:false,
      isDisable:true
    };
  },
  components: {noData
  },
  created() {
  },
  mounted(){
    let that = this;

  },
  methods: {
    findAllExperiment(){
      let that= this;
      that.getAllExperiment('','','',1,that.sindex);
    },
    getAllExperiment(f_category_id,c_category_id,name,page,section_id){
      let that= this;
      let obj = {}
      obj.f_category_id = f_category_id;
      obj.name = name;
      obj.perPage = that.perPage;
      obj.page = page;
      obj.section_id = section_id;
      obj.c_category_id = c_category_id;
      obj.type=0
      console.log(obj)
      findAllExperimentByCategoryId(obj).then(res=> {
        if(res.code==200){
          that.total = res.data.total
          that.all_experimentList = res.data.list;
          that.hasData=res.data.list.length==0?false:true
          let ids=[]
          for (let index = 0; index < that.chooseList.length; index++) {
            ids.push(that.chooseList[index].id)

          }

          for (let index = 0; index <  that.all_experimentList.length; index++) {
                  if (ids.includes(that.all_experimentList[index].id)==true) {
                     that.$set(that.all_experimentList[index], "checked", true);
                  }else {
                     that.$set(that.all_experimentList[index], "checked", false);
                  }
                  that.all_experimentList[index].pic_url = that.$store.state.pic_Url+ that.all_experimentList[index].pic_url
               }
        }else{
          this.$toast(res.message,2000)
        }
      })
    },
    //新增时搜索实验名
    search(){
      let that = this;
      // let obj = {}
      // obj.category_id = that.parent_id;
      // obj.name = that.searchTx;
      // obj.perPage = 10;
      // obj.page = 1;
      // findAllByCategoryId(obj).then(res=> {
      //   if(res.code==200){
      //     that.total = res.data.total
      //     that.all_experimentList = res.data.list;
      //   }else{
      //     this.$toast(res.message,2000)
      //   }
      // })
        that.curPage=1
       that.getAllExperiment(that.parentId,that.childrenId,that.searchTx,1,that.sindex);
    },
    //点击选择实验
    click_new(sid,count,sindex,) {
      let that = this;
      that.isnewFilter = true;
      that.chooseList = [];
      that.isnewFilterType = 1;
      that.sindex = sid;
      that.count = count;
      that.sindex = sindex;

      console.log(that.curPage)
      that.array_addChecked(that.all_experimentList);
      that.findAllExperiment();
      that.findParentCategory();
    },

    //选择分类
    selectCate(val) {
      console.log(val);
      },

    //本地上传确认上传
    confirmLocalUpload() {
      let that = this;

      that.isnewFilter = false;
    },
    //实验库选择确认选择
    confirmChoose() {
      let that = this;
      if(that.isDisable) {
        that.isDisable = false;
        if (that.chooseList.length == 0) {
          return that.$toast('请选择实验', 2000)
        }
        console.log(that.sid)
        console.log(that.chooseList)
        let obj = {};
        let id = [];
        for (let i = 0; i < that.chooseList.length; i++) {
          id.push(that.chooseList[i].id)
        }
        obj.experiment_id = id
        obj.section_id = that.sindex;
        console.log(obj)
        bindExperiments(JSON.stringify(obj)).then(res => {
          setTimeout(function (){that.isDisable = true}, 3000 )

          if (res.code == 200) {
            that.isnewFilter = false;
            // that.reload();
            //that.findAllByType(that.sindex,3,8,1)
            that.$emit('findAllByType', that.sindex, 3, 8, 1)
          } else {
            this.$toast(res.message, 2000)
          }
        })
      }
    },
    //弹窗关闭
    closeDialog() {
      let that = this;
      console.log("ok");
      //that.$emit('hidedialog')
    },
    //弹窗分页
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`);
      let that= this;
      that.getAllExperiment(that.parentId,that.childrenId,that.searchTx,val,that.sindex);
    },

    //获取父类
    findParentCategory() {
      let that = this;
      findParentCategory().then((res) => {
        console.log(res);
        if (res.code == 200) {
          that.options = res.data;
          console.log("as"+res.data)
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    findChildCategory(val) {
      let that = this;
      let obj = {};
      obj.parent_category_id = val;
      findChildCategory(obj).then((res) => {
        if (res.code == 200) {
          that.options1 = res.data;
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    //父类
    selectType(val) {
      let that = this;
      that.options1 = [];
      that.childrenId='';

      that.parentId = val;
       console.log("11"+that.parentId)
      that.findChildCategory(val);
      that.getAllExperiment(that.parentId,that.childrenId,that.searchTx,1,that.sindex);
    },
    //子类
    selectType1(val) {
      let that = this;
       console.log("22"+val)
      that.childrenId = val;
      that.getAllExperiment(that.parentId,that.childrenId,that.searchTx,1,that.sindex);
    },
    //数组新增checked元素
    array_addChecked(array) {
      let that = this;
      for (var i = 0; i < array.length; i++) {
        that.$set(array[i], "checked", false);
      }
    },
    //删除实验选择
    deleteSel(item, index) {
      let that = this;
      that.chooseList.splice(index, 1);
      for (var i = 0; i < that.all_experimentList.length; i++) {
        if (item.id == that.all_experimentList[i].id) {
          that.$set(that.all_experimentList[i], "checked", false);
        }
      }

    },
    //实验选择
    click_checked(obj, index, checked) {
      let that = this;
      if (!checked) {
        if (!(that.chooseList.indexOf(obj.id) != -1)) {
          if (that.chooseList.length+that.count  > 4) {
            return this.$toast("最多上传5个实验，还需添加请删除", 3000);
          }
          that.chooseList.push(obj);
        }
        that.$set(that.all_experimentList[index], "checked", true);
      } else {
        that.$set(that.all_experimentList[index], "checked", false);
        for (var i = 0; i < that.chooseList.length; i++) {
          if (obj.id == that.chooseList[i].id) {
            that.chooseList.splice(i, 1);
          }
        }
      }
    },

  },
};
</script>

<style lang="less" scoped>
@import url(../assets/less/admin.less);
.pageTab .fr .d-serach{padding-left: 12px;padding-right: 12px; width: 170px; margin-right: 20px;}
.btn_finsh{background: @basecolor; font-size:16px;color:#fff; display: inline-block; padding: 5px 8px; .borderRadius(5px,5px,5px,5px);
vertical-align: middle; cursor: pointer;}
</style>
