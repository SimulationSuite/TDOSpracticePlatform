<template>
  <div class="pp_main boxsizing">
    <div class="s-container">
      <div class="pageTab clearfix">
        <div class="fr">
          <a class="btnDefault pointer abtn" style="margin-right: 0">保存</a>
        </div>
      </div>
    </div>
    <div class="s-container clearfix sa-container-tab">
      <div class="commonview-box">
        <ul>
          <li
            v-for="(item, index) in commonviewList"
            :key="index"
            :class="{ active: activeIndex == index }"
            @click="Change(index)"
          >
            <img
              src="../../assets/img/svg/37.svg"
              alt=""
              @click.stop="removeList(index)"
              v-show="index > commonviewListLength"
            />
            <a href="javascript:;">{{ item.name }} </a>
          </li>
        </ul>
        <div class="btn-box">
          <a
            class="btnDefault pointer abtn sort-btn"
            v-if="addFinished == 0"
            @click="add"
            >新建目录</a
          >
        </div>
      </div>
      <div class="content-box" v-if="true">
        <div class="title">
          <ul>
            <li class="active">
              <input
                type="text"
                placeholder="输入目录名称..."
                v-model="momentParentName"
              />
            </li>
          </ul>
        </div>
        <div class="text">
          <ul>
            <li v-for="(item, index) in arr" :key="index">
              <div class="input_box">
                <input
                  type="text"
                  placeholder="请输入分类名称"
                  v-model="item.name"
                />
              </div>
            </li>
          </ul>

          <ul>
            <li v-for="(item, index) in arr1" :key="index">
              <div class="input_box input_box-new" v-show="true">
                <input
                  type="text"
                  placeholder="请输入分类名称"
                  v-model="item.name"
                />

                <img
                  src="../../assets/img/svg/37.svg"
                  alt=""
                  @click="remove(index)"
                />
              </div>
            </li>
          </ul>

          <div class="text-btn-box">
            <a class="btnDefault pointer abtn text-btn" @click="addnew"
              >新建分类</a
            >
          </div>
        </div>
      </div>
      <!-- <div class="content-box content-box-new" v-if="false">
        <div class="title">
          <ul>
            <li><a href="#" class="active">输入目录名称</a></li>
          </ul>
        </div>
        <div class="text">
          <div class="input_box input_box-new">
            <input type="text" placeholder="请输入分类名称" />
          </div>
          <div class="text-btn-box">
            <a class="btnDefault pointer abtn text-btn">新建分类</a>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { findParentCategory, findChildCategory } from "@/API/api";

export default {
  data() {
    return {
      commonviewList: [],
      commonviewListLength: 0,
      addFinished: 0,
      arr: [],
      arr1: [],
      activeIndex: 0,
      momentParentObj: {},
      momentParentName: "",
    };
  },
  created() {
    let _this = this;
  },
  mounted() {
    let _this = this;
    _this.getParent();
  },
  methods: {
    getParent() {
      let _this = this;
      findParentCategory().then((res) => {
        _this.commonviewList = res.data;
        _this.commonviewListLength = _this.commonviewList.length - 1;
        if (_this.commonviewList.length > 0) {
          _this.Change(0);
        }
        //console.log(_this.commonviewList)
      });
    },
    Change(index) {
      let _this = this;
      let parentObj = _this.commonviewList[index];
      _this.activeIndex = index;
      _this.momentParentObj = parentObj;
      // alert(index);
      _this.momentParentName = parentObj.name;
      _this.arr1 = [];
      _this.arr = [];
      if (parentObj.name == "新建中...") {
        _this.momentParentName = "";
        
      } else {
        let obj = {};
        obj.parent_category_id = parentObj.id;
        findChildCategory(obj).then((res) => {
          _this.arr = res.data;
        });
      }
    },
    //父分类新建分类
    add() {
      let _this = this;
      if (_this.addFinished == 0) {
        var current = _this.commonviewList.length;
        var obj = {};
        obj.name = "新建中...";
        _this.commonviewList.push(obj);
        _this.Change(current);
        _this.addFinished = 1;
      }
    },
    addnew() {
      var _this = this;
      var obj = {};
      obj.id = "";
      obj.name = "";
      _this.arr1.push(obj);
    },
    remove(index) {
      var _this = this;
      _this.arr1.splice(index, 1);
    },
    removeList(index) {
      //console.log(index)
      var _this = this;
      _this.commonviewList.splice(index, 1);
      _this.addFinished = 0;
      _this.Change(0);
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
@import url(../../assets/less/sort.less);
</style>
