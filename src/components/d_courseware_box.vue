<!--课程课件-->
<template>
  <div class="experiment_box">
    <div class="exper_main">
      <courseNav @getData="getData"></courseNav>
      <div class="right_box">
        <div class="add_btn_box clearfix" v-if="!showvideo">
          <div class="sel-box">
            <el-select
              v-model="cate"
              placeholder="请选择课件分类"
              @change="selectCate"
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
          <div class="sel-box">
            <el-select
              v-model="type"
              placeholder="请选择课件类型"
              @change="selectType"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!--学生点击课程详情没有新增课件-->
          <a
            class="btnDefault pointer"
            @click="click_new"
            v-if="isEdit==1?showAdd():false"
            >新增课件</a
          >
        </div>
        <template v-if="isHasData && !showvideo">
          <div class="list_box">
            <ul class="list_ul clearfix">
              <li v-for="(item, index) in experimentList" :key="index">
                <div class="info" @click="playItem(item)">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                    v-if="isEdit==1?showDelete():false"
                  >
                    <a
                      class="icon icon_close pointer"
                      @click.stop="click_delete(item)"
                    ></a>
                  </el-tooltip>
                  <!--
                                <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                   <a class="icon icon_set pointer"></a>
                                </el-tooltip>
                                -->
                  <div class="icon-box">
                    <span
                      class="c_icon"
                      :class="{
                        icon_video: item.kind == 0,
                        icon_pdf: item.kind == 1,
                      }"
                    ></span>
                  </div>
                  <p class="p-text textline1 p-name">{{ item.name }}</p>
                  <div class="line"></div>
                  <p class="p-text textline1">课件大小：{{ item.size }}</p>

                  <!---
                                <p class="p-text textline1">文档页数：共16页</p>
                                -->
                </div>
              </li>
            </ul>
          </div>
          <div class="page_box">
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

        <template v-if="showvideo">
          <div class="courseDetail_box">
              <div class="back_box">
                <a class="back pointer" @click="click_Hidevideo">
                  <img src="../assets/img/exper_back.png"/>
                </a>
              </div>
                <div class="video_box" v-if="detailType == 0">
                  <video-player
                    @touchstart.passive="passive"
                    class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :x5-playsinline="true"
                    :options="playerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @waiting="onPlayerWaiting($event)"
                    @playing="onPlayerPlaying($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @canplay="onPlayerCanplay($event)"
                    @canplaythrough="onPlayerCanplaythrough($event)"
                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied"
                  >
                  </video-player>
                  <!--<div class="name_box">
                    <div class="name textline1">{{ momentMod.name }}</div>
                    <a class="a_close pointer" ></a>
                  </div>
                  -->
                  <a class="a-record" @click.stop="click_record" v-if="role == 3">
                    <i></i>
                    <span>记录笔记</span>
                  </a>
                </div>
              <div class="video_box pdf_box" v-if="detailType == 1">
                <!--<div class="pdf_name">
                  {{ momentMod.name }}
                  <a class="a_close pointer" @click="click_Hidevideo"></a>
                </div>
                -->
                <div class="pdf-main">
                  <div class="p-main">
                    <pdf
                      ref="pdf"
                      :src="url"
                      v-if="url"
                      @loaded="loadPdfHandler"
                      :page="currentPage"
                      @num-pages="pageCount = $event"
                      @page-loaded="currentPage = $event"
                    >
                    </pdf>
                    <div class="pdf_info">
                      <div class="btn_box">
                        <a
                          @click="changePdfPage(0)"
                          class="pointer preve"
                          :class="{ grey: currentPage == 1 }"
                        ></a>
                        <a
                          @click="changePdfPage(1)"
                          class="pointer next"
                          :class="{ grey: currentPage == pageCount }"
                        ></a>
                      </div>
                      <a
                        class="pointer pdf_btnrecord"
                        @click="isRecordNotes = true,titleText ='',contentText ='' "
                        v-if="role == 3"
                      ></a>
                      <p>{{ currentPage }} / {{ pageCount }}</p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </template>

        <nodata dataMess="当前暂无课件" v-if="!isHasData"></nodata>
      </div>
    </div>
    <!--删除弹出框-->
    <el-dialog :visible.sync="isDelete" width="500px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除该课件吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDelete">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>
    <newdialog ref="newdialog" @getCoursewareBySectionId='subcomponent_getCoursewareBySectionId(arguments)'></newdialog>

    <!--视频弹出-->
    <div class="studetTrans" v-if="showvideo && 1==0">
      <div class="studentMain">
        <div class="dis-table-cell">
          <div class="video_box" v-if="detailType == 0">
            <video-player
              @touchstart.passive="passive"
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :x5-playsinline="true"
              :options="playerOptions"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
              @ended="onPlayerEnded($event)"
              @waiting="onPlayerWaiting($event)"
              @playing="onPlayerPlaying($event)"
              @loadeddata="onPlayerLoadeddata($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              @canplay="onPlayerCanplay($event)"
              @canplaythrough="onPlayerCanplaythrough($event)"
              @statechanged="playerStateChanged($event)"
              @ready="playerReadied"
            >
            </video-player>
            <!--
            <div class="name_box">
              <div class="name textline1">{{ momentMod.name }}</div>
              <a class="a_close pointer" @click="click_Hidevideo"></a>
            </div>
            -->
            <a class="a-record" @click.stop="click_record" v-if="role == 3">
              <i></i>
              <span>记录笔记</span>
            </a>
          </div>
          <div class="video_box pdf_box" v-if="detailType == 1">
            <!--
            <div class="pdf_name">
              {{ momentMod.name }}
              <a class="a_close pointer" @click="click_Hidevideo"></a>
            </div>
            -->
            <div class="pdf-main">
              <div class="p-main">
                <pdf
                  ref="pdf"
                  :src="url"
                  v-if="url"
                  @loaded="loadPdfHandler"
                  :page="currentPage"
                  @num-pages="pageCount = $event"
                  @page-loaded="currentPage = $event"
                >
                </pdf>
                <div class="pdf_info">
                  <div class="btn_box">
                    <a
                      @click="changePdfPage(0)"
                      class="pointer preve"
                      :class="{ grey: currentPage == 1 }"
                    ></a>
                    <a
                      @click="changePdfPage(1)"
                      class="pointer next"
                      :class="{ grey: currentPage == pageCount }"
                    ></a>
                  </div>
                  <a
                    class="pointer pdf_btnrecord"
                    @click="isRecordNotes = true,titleText ='',contentText ='' "
                    v-if="role == 3"
                  ></a>
                  <p>{{ currentPage }} / {{ pageCount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--记录笔记-->
    <el-dialog v-dialogDrag
    :close-on-click-modal="false"
      :visible.sync="isRecordNotes"
      width="500px"
      class="dialog_record"
      @close="click_hideRecord"
    >

        <div slot="title" class="dialog_header">保存笔记</div>
        <div class="record_main">
          <p class="location" v-if="detailType == 1">
            已保存当前页数：{{ currentPage }}
          </p>
          <p class="location" v-if="detailType == 0">
            已保存当前视频时间：{{ location }}
          </p>

          <el-form>
            <el-form-item>
              <el-input
                v-model="titleText"
                type="text"
                placeholder="请输入笔记标题"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="contentText"
                type="textarea"
                :rows="5"
                placeholder="请输入该段笔记的简介..."
              />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <a class="btnDefault" @click="submitNote">确 认</a>
        </div>
       


    </el-dialog>

  </div>
</template>

<script>
//pdf
import pdf from "vue-pdf";
import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";

//视频
import { videoPlayer } from "vue-video-player";

import courseNav from "@/components/left_courseNav.vue";
import newdialog from "@/components/dialog_newCourseware";
import {
  getCoursewareByCourseId,
  getCoursewareByChapterId,
  getCoursewareBySectionId,
  deleteChapterSectionCourseById,
  stduentUploadNotes,
} from "@/API/api";
import nodata from "@/components/noData";
export default {

  directives: {
      drag(el){
                let oDiv = el; //当前元素
                let self = this; //上下文
                //禁止选择网页上的文字
                document.onselectstart = function() {
                    return false;
                };
                oDiv.onmousedown = function(e){
                    //鼠标按下，计算当前元素距离可视区的距离
                    console.log(e.clientX)
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;

                    console.log( oDiv.getBoundingClientRect())

                    document.onmousemove = function(e){
                        //通过事件委托，计算移动的距离
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                        //移动当前元素
                        oDiv.style.left = l + "px";
                        oDiv.style.top = t + "px";
                    }
                    document.onmouseup = function(e){
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                    //return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
                    return false;
                };
            }
  },

  data() {
    return {
      titleText: "",
      contentText: "",
      showvideo: false,
      passive: true,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "",
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      isRecordNotes: false, //记录笔记
      location: "",
      url: "/Vue.pdf", //"/Vue.pdf",
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      detailType: 0, //0---视频   1---文档
      jumpPage: 0,
      jumpTime: 0,
      momentMod: {},

      options: [
        { value: "", label: "全部" },
        { value: "0", label: "内置课件" },
        { value: "1", label: "教师上传" },
      ],
      typeList: [
        { value: "", label: "全部" },
        { value: "0", label: "视频" },
        { value: "1", label: "文档" },
      ],
      cate: "", //课件分类默认内置课件
      type: "全部", //课件类型默认全部
      experimentList: [],
      perPage: 8, //8个实验一页
      curPage: 1, //设备列表
      isDelete: false, //是否删除弹出框是否显示
      total: 1,
      kind: '',
      typeware: "",
      cindex: "",
      sindex: "",
      isHasData: true, //是否有数据 默认有数据
      count: "", //课程下章，节已经存在的课件数量
      isdeleteId: "", //删除的课件id
      isEdit:0
    };
  },
  props: {
    role: {
      default: 0, //默认是0传过来3表示是学生点击课程详情
    },
    typeData: {
      default: 0,
    },
    status: {
      default: 0,
    },
  },
  components: {
    courseNav,
    newdialog,
    nodata,
    videoPlayer,
    pdf,
  },
  created() {
    this.cate = this.options[0].value; //默认选中内置课件
    this.type = this.typeList[0].value; //课件类型默认选中全部
    this.getAllCoursewareByCourseId();
  },
  mounted() {
    let that = this;
  },
  methods: {
      //保存笔记
    submitNote() {
      let that = this;

      let obj = {};
      obj.courseware_id = that.momentMod.id;
      obj.course_id = that.$route.query.courseId;
      obj.user_id = sessionStorage.getItem("userId");
      if (that.titleText == "") {
        return that.$toast("笔记标题不能为空", 3000);
      }

      if (that.contentText == "") {
        return that.$toast("笔记内容不能为空", 3000);
      }

      if(that.contentText.length >200)
      {
        return that.$toast("笔记内容字数不能超过200", 3000);
      }

      obj.title = that.titleText;
      obj.content = that.contentText;

      if (that.detailType == 1) {
        obj.type = 1;
        obj.remark_page = that.currentPage;
      } else {
        obj.type = 0;
        obj.remark_at = that.location;
      }

      stduentUploadNotes(obj)
        .then((res) => {
          if (res.code == 200) {
            that.titleText = "";
            that.contentText = "";
            that.isRecordNotes = false;
            that.$toast("记录成功！", 3000);
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((err) => {
        });
    },
    playItem(item) {;
      let that = this;
      let num = item.kind;
      that.momentMod = item;
      that.showvideo = true;
      that.detailType = num;
      var mo = function (e) {
        e.preventDefault();
      };
     // document.body.style.overflow = "hidden";
      //document.addEventListener("touchmove", mo, false); //禁止页面滑动
      if (num == 0) {
        that.jumpTime = 0;
        that.$nextTick(function () {
          that.playerOptions.sources[0].src =
            that.$store.state.pic_Url + that.momentMod.url;
          that.videoPlay();
        });
      } else {//"http://192.168.1.228:8080/pic/17e82a2f-512e-409f-9474-fcaa5c52583a.pdf"
        that.jumpPage = 1;
        that.$nextTick(function () {
          that.url = this.pdfUrl = pdf.createLoadingTask({
            url: that.$store.state.pic_Url + that.momentMod.url,
            CMapReaderFactory,
          });
          that.loadPdfHandler();
        });
      }
      that.$emit('getScroll')
    },

    getCoursewareByCourseId(perPage, page, kind, type) {
      let that = this;
      let obj = {};
      that.curPage=page
      obj.courseId = that.$route.query.courseId;
      obj.kind = kind;
      obj.type = type;
      obj.perPage = perPage;
      obj.page = page;
      getCoursewareByCourseId(obj).then((res) => {
        if (res.code == 200) {
          that.total = res.data.total;
           for(let i = 0;i<res.data.list.length;i++){
                        res.data.list[i].size = (res.data.list[i].size/(1024 * 1024)).toFixed(2) + "MB"
                    }
          // res.data.total == 0
          //   ? (that.isHasData = false)
          //   : (that.isHasData = true);
          res.data.total == 0
            ? (that.isHasData = false)
            : (that.isHasData = true);
          that.experimentList = res.data.list;
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    getAllCoursewareByCourseId() {
      let that = this;
      that.getCoursewareByCourseId(that.perPage, 1, that.kind,that.type);
    },
    getCoursewareByChapterId(chapterId, kind, type, perPage, page) {
      let that = this;
      let obj = {};
      obj.chapterId = chapterId;
      obj.kind = kind;
      obj.type = type;
      obj.perPage = perPage;
      obj.page = page;
      getCoursewareByChapterId(obj).then((res) => {
        if (res.code == 200) {
          that.count = res.data.total;
          that.total = res.data.total;
          res.data.total == 0
            ? (that.isHasData = false)
            : (that.isHasData = true);
          that.experimentList = res.data.list;
                  for(let i = 0;i<that.experimentList.length;i++){
                       that.experimentList[i].size = (that.experimentList[i].size/(1024 * 1024)).toFixed(2) + "MB"
                    }
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    getCoursewareBySectionId(sectionId, kind, type, perPage, page) {
      let that = this;
      let obj = {};
      obj.sectionId = sectionId;
      obj.kind = kind;
      obj.type = type;
      obj.perPage = perPage;
      obj.page = page;
      // console.log(obj)
      getCoursewareBySectionId(obj).then((res) => {
        if (res.code == 200) {
          that.count = res.data.total;
          that.total = res.data.total;
          res.data.total == 0
            ? (that.isHasData = false)
            : (that.isHasData = true);
          that.experimentList = res.data.list;
                      for(let i = 0;i<that.experimentList.length;i++){
                       that.experimentList[i].size = (that.experimentList[i].size/(1024 * 1024)).toFixed(2) + "MB"
                    }
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    //子组件调用结果
    subcomponent_getCoursewareBySectionId(params){
       let that = this;
       that.getCoursewareBySectionId(params[0],params[1],params[2],params[3],params[4])
    },

    getData(data) {
      let that = this;
      that.cindex = data.cindex;
      that.sindex = data.sindex;
      // console.log(that.sindex + that.cindex);
      that.cate = ''
      that.kind = ''
      that.type = ''
      that.showvideo = false;
      if (data.sindex == "") {
        that.isEdit = 1
        that.getCoursewareByChapterId(data.cindex, that.kind, that.type, that.perPage, 1);
      } else {
        that.isEdit = 1
        that.getCoursewareBySectionId(data.sindex, that.kind, that.type, that.perPage, 1);
      }
    },
    //底部分页
    handleCurrentChange(val) {
      let that  =this
       if (that.sindex == "" && that.cindex == "") {
        that.getCoursewareByCourseId(that.perPage, val, that.typeware, that.cate);
      } else if (that.sindex == "" && that.cindex != "") {
        that.getCoursewareByChapterId(
          that.cindex,
          that.typeware,
           that.cate,
          that.perPage,
          val
        );
      } else {
        that.getCoursewareBySectionId(
          that.sindex,
          that.typeware,
           that.cate,
          that.perPage,
          val
        );
      }
      // console.log(`当前页: ${val}`);
    },

    //选择分类
    selectCate(val) {
      // console.log("分类" + val);
      let that = this;
      that.kind = val;
      if (that.sindex == "" && that.cindex == "") {
        that.getCoursewareByCourseId(that.perPage, 1, that.typeware, val);
      } else if (that.sindex == "" && that.cindex != "") {
        that.getCoursewareByChapterId(
          that.cindex,
          that.typeware,
          val,
          that.perPage,
          1
        );
      } else {
        that.getCoursewareBySectionId(
          that.sindex,
          that.typeware,
          val,
          that.perPage,
          1
        );
      }
    },

    //选择课件类型
    selectType(val) {
      // console.log("类型" + val);
      let that = this;
      that.typeware = val;
      if (that.sindex == "" && that.cindex == "") {
        that.getCoursewareByCourseId(that.perPage, 1, val, that.kind);
      } else if (that.sindex == "" && that.cindex != "") {
        that.getCoursewareByChapterId(
          that.cindex,
          val,
          that.kind,
          that.perPage,
          1
        );
      } else {
        that.getCoursewareBySectionId(
          that.sindex,
          val,
          that.kind,
          that.perPage,
          1
        );
      }
    },

    //是否删除
    click_delete(item) {
      let that = this;
      that.isDelete = true;
      that.isdeleteId = item.id;
      // console.log(item);
    },
    //删除弹出确认
    confirmDelete() {
      let that = this;
      let obj = {};
      let list = [];
      let obj1 = {};
      if (that.sindex != ""  && that.cindex != "") {
        that.cindex = "fb0a1080-b11e-427c-8567-56ca6105ea07";
      }
      if (that.cindex != "" && that.sindex == "") {
        that.sindex = "fb0a1080-b11e-427c-8567-56ca6105ea07";
      }
      if (that.sindex != "" && that.cindex == "") {
        that.cindex = "fb0a1080-b11e-427c-8567-56ca6105ea07";
      }
      obj1.courseware_id = that.isdeleteId;
      obj1.section_id = that.sindex;
      obj1.chapter_id = that.cindex;
      list.push(obj1);
      obj.chapter_section_courseware_list = list;
      //console.log(JSON.stringify(obj));
      deleteChapterSectionCourseById(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {
          that.count = res.data.total;
          that.total = res.data.total;
          res.data.total == 0?(that.isHasData = false):(that.isHasData = true);
          if(that.sindex == "fb0a1080-b11e-427c-8567-56ca6105ea07"){
            that.sindex = ''
          }
          if(that.cindex == "fb0a1080-b11e-427c-8567-56ca6105ea07"){
            that.cindex = ''
          }
          //that.experimentList = res.data.list;
          //删除成功，节课件查询
          // that.getCoursewareBySectionId(that.sindex,that.kind,'',that.perPage,1);
          if (that.sindex == "" && that.cindex == "") {
            that.getCoursewareByCourseId(that.perPage, 1, that.typeware, that.cate);
          } else if (that.sindex == "" && that.cindex != "") {
            that.getCoursewareByChapterId(
              that.cindex,
              that.typeware,
               that.cate,
              that.perPage,
              1
            );
          } else {
            that.getCoursewareBySectionId(
              that.sindex,
              that.typeware,
               that.cate,
              that.perPage,
              1
            );
          }
        } else {
          this.$toast(res.message, 2000);
        }
      });
      that.isDelete = false;
    },
    click_new() {
      let that = this;
      that.$refs.newdialog.click_new(that.cindex, that.sindex, that.count);
    },
    showDelete(){
      let that = this

      // console.log(sessionStorage.getItem('p_p-authority')+that.status+that.typeData)
      if (sessionStorage.getItem('p_p-authority')==0) {
        // 学生直接没有删除按钮
        return false
      }else {

          if (sessionStorage.getItem('p_p-authority')==2) {
            //管理员判断status
            if (that.status==0) {
              return true
            }else {
              return false
            }
          }else {
            //判断教师端
            if (that.status==0&&that.typeData==1) {
              return true
            }else {
              return false
            }
          }


      }
    },
     showAdd(){
      let that = this

      // console.log(sessionStorage.getItem('p_p-authority')+that.status+that.typeData)
      if (sessionStorage.getItem('p_p-authority')==0) {
        // 学生直接没有删除按钮
        return false
      }else {

          if (sessionStorage.getItem('p_p-authority')==2) {
            //管理员判断status
            if (that.status==0) {
              return true
            }else {
              return false
            }
          }else {
            //判断教师端

            if (that.status!=-1&&that.typeData==1) {
              return true
            }else {
              return false
            }


          }


      }
    },

    //视频关闭
    click_Hidevideo() {
      let that = this;
      that.showvideo = false;
      var mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", mo, false);
    },

    //视频播放
    videoPlay() {
      this.$refs.videoPlayer.player.play();
    },

    //笔记记录
    click_record() {
      let that = this;
      that.isRecordNotes = true;
      this.$refs.videoPlayer.player.pause();
    },

    //关闭记录弹出框
    click_hideRecord() {
      let that = this;
      if (that.detailType == 0) {
        //表示当前记录的笔记是视频
        that.videoPlay();
      }
    },

    // 播放回调
    onPlayerPlay(player) {
      //console.log("player play!", player);
    },

    // 暂停回调
    onPlayerPause(player) {
      let that = this;
      that.location = player.currentTime();
      //console.log("player pause!", player);
    },

    // 视频播完回调
    onPlayerEnded(player) {
      //console.log(player);
    },

    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting(player) {
      // console.log(player)
    },

    // 已开始播放回调
    onPlayerPlaying(player) {
      // console.log(player)
    },

    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata(player) {
      player.currentTime(this.jumpTime);
      //console.log(player)
    },

    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      //console.log(player)
    },

    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },

    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },

    //播放状态改变回调
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      //   player.currentTime("20.18638");
    },

    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = this.jumpPage; // 加载的时候先加载第一页
    },

    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
        // console.log(this.currentPage)
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../assets/less/attachment.less);

.experiment_box {
  margin-top: 30px;
  //min-height: 600px;
  .exper_main {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .right_box {
    margin-left: 340px;
  }
}

.page_box {
  text-align: right;
}
.add_btn_box {
  padding-bottom: 15px;
  text-align: right;
}

.sel-box {
  float: left;
  margin-right: 30px;
}
/*列表*/
.list_box {
  overflow: hidden;
  min-height: 450px;
  .list_ul {
    margin-left: -10px;
    margin-right: -10px;
    li {
      width: 25%;
      min-height: 40px;
      float: left;
      margin-bottom: 20px;
    }

    .info {
      margin: 0 10px;
      min-height: 30px;
      background: @background;
      padding: 40px 0 20px 0;
      position: relative;
    }
    .p-text {
      font-size: 16px;
      color: @fontColor;
      text-align: center;
      padding: 2px 8px;
      line-height: 20px;
      height: 20px;
    }
    .icon {
      width: 20px;
      height: 20px;
      display: block;
      position: absolute;
      top: 10px;
      user-select: none;
    }
    .icon_close {
      background: url(../assets/img/n_close.png) center no-repeat;
      right: 15px;
    }
    .icon_set {
      background: url(../assets/img/n_set.png) center no-repeat;
      right: 28px;
    }
    .p-name {
      padding: 8px 4px;
      line-height: 26px;
      height: 26px;
    }
    .c_icon {
      width: 58px;
      height: 58px;
      margin: 0 auto;
      display: block;
    }
    .icon_video {
      background: url(../assets/img/courseware_video.png) center no-repeat;
    }
    .icon_pdf {
      background: url(../assets/img/courseware_pdf.png) center no-repeat;
    }

    .line {
      margin: 0 30px;
      height: 2px;
      background: @linecoloe;
      margin-bottom: 10px;
    }
  }
}

@media screen and (max-width: 1440px) {
  .experiment_box {
    .right_box {
      margin-left: 290px;
    }
  }
}


</style>
