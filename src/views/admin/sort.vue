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
            <img src="../../assets/img/svg/37.svg" alt="" @click="removeList(index)" v-show="index > commonviewListLength">
            <a href="javascript:;">{{ item.name }} </a>
          </li>
        </ul>
        <div class="btn-box">
          <a class="btnDefault pointer abtn sort-btn" @click="add">新建目录</a>
        </div>
      </div>
      <div class="content-box" v-if="true">
        <div class="title">
          <ul>
            <li class="active">
              <input
                type="text"
                placeholder="输入目录名称..."          
              />
            </li>
          </ul>
        </div>
        <div class="text">
          <ul>
            <!-- <li v-for="(item, index) in commonviewList" :key="index">
              <div class="input_box">
                <input type="text" placeholder="" value="poa" />
              </div>
            </li> -->
          </ul>
          <div class="input_box">
            <input type="text" placeholder="" value="poa" />
          </div>
          <div class="input_box">
            <input type="text" placeholder="" value="poa" />
          </div>
          <div class="input_box">
            <input type="text" placeholder="" value="poa" />
          </div>
          <div class="input_box">
            <input type="text" placeholder="" value="poa" />
          </div>
          <ul>
            <li v-for="(item,index) in arr" :key="index">
              <div class="input_box input_box-new" v-show="true">
                <input type="text" placeholder="请输入分类名称" />
                {{item.id}}
                <img src="../../assets/img/svg/37.svg" alt="" @click="remove(index)">
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
export default {
  data() {
    return {
      commonviewList: [
        { id: "", name: "共识机制", childen: ["poa", "poa", "poa", "poa"] },
        { id: "", name: "共识机制", childen: ["poa", "poa", "poa", "poa"] },
        { id: "", name: "共识机制", childen: ["poa", "poa", "poa", "poa"] },
        { id: "", name: "共识机制1213", childen: ["poa", "poa", "poa", "poa"] },
        { id: "", name: "共识机制", childen: ["poa", "poa", "poa", "poa"] },
      ],
      commonviewListLength:0,
      arr: [],
      arr1:[],
      activeIndex: 0,
    };
  },
  created() {},
  mounted() {
    let _this = this;
    _this.commonviewListLength = _this.commonviewList.length - 1;
  },
  methods: {
    Change(index) {
      this.activeIndex = index;
      console.log(index);
    },
    add() {
      let _this = this;
      var current = _this.commonviewList.length;
      var obj = {};
      obj.name = "新建中...";
      _this.commonviewList.push(obj);
      _this.Change(current);
    },
    addnew() {
      var _this = this;
      var obj = {};
      _this.arr.push(obj);
    },
    remove(index) {
      console.log(index)
      var _this = this;  
      var arrnew = _this.arr.splice(index,1);
       console.log(arrnew)
    },
    removeList(index) {
      console.log(index)
      var _this = this;
      var arrnew = _this.commonviewList.splice(index,1);
      console.log(_this.commonviewList)
    }
  },
};
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
@import url(../../assets/less/sort.less);
</style>
