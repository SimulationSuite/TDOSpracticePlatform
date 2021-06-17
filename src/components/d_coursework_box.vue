<!--课程作业-->
<template>
  <div class="experiment_box">
    <div class="exper_main">
      <courseNav @getData="getData"></courseNav>
      <div class="right_box">
        <!--小节下面有作业-->
        <noData v-if="sindex == ''"></noData>
        <div class="add_btn_box clearfix" v-if="!noData && sindex != ''">
          <div class="fl">
            <div class="sel-box" v-if="1 == -1">
              <el-select
                v-model="cate"
                placeholder="请选择作业类型"
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
          </div>
          <div class="fr" v-if="canEdit == 1 && noEdit != 0">
            <a
              v-if="courseList.length > 0"
              class="btnDefault pointer mr20"
              @click="deleteOperation"
              >删除题目</a
            >
            <a class="btnDefault pointer" @click="click_new">新增题目</a>
          </div>
        </div>
        <!--课程题目-->
        <div
          class="coursework_box"
          v-if="!noData && status != 1 && sindex != ''"
        >
          <div class="coursework_name">
            <p>{{ courseWork.name }}</p>
            <a
              class="edit"
              @click="reset_homework"
              v-if="canEdit == 1 && noEdit != 0"
            ></a>
            <a
              class="edit delete"
              @click="isConfirmDeleteWork = true"
              v-if="canEdit == 1 && noEdit != 0"
            ></a>
          </div>
          <div class="course_list">
            <el-scrollbar style="height: 100%">
              <!--选择题-->
              <ul class="choice_question">
                <li
                  :class="{ li_choose: isShow }"
                  v-for="(item, index) in courseList_Org"
                  :key="index"
                >
                  <div class="title">
                    {{ index + 1 }}.
                    {{ item.content }}
                    <span> ({{ item.score }}分) </span>
                    <a
                      class="btn-set pointer"
                      v-if="1 == -1"
                      @click="setNewScore(item)"
                    ></a>
                  </div>
                  <div class="pic" v-if="item.picUrl != '' && item.picUrl">
                    <span><img :src="state.pic_Url + item.picUrl" /></span>
                  </div>

                  <p class="answer_box" v-if="item.type == 0">
                    <span
                      class="s_radio"
                      :class="{ s_radio_answer: iitem == item.answer }"
                      v-for="(iitem, iindex) in JSON.parse(item.choice)"
                      :key="iindex"
                    >
                      {{ iitem }}
                    </span>
                  </p>
                  <p class="answer_box" v-if="item.type == 1">
                    {{ item.answer }}
                  </p>
                  <!--选中的状态添加class   li_radio_h-->
                  <span
                    class="li_radio"
                    @click="cheeckedList(1, item, index, item.checked)"
                    :class="{ li_radio_h: item.checked }"
                  ></span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
          <div class="add_btn_box" v-if="canEdit == 1 && noEdit != 0">
            <a
              v-if="courseList_Org.length < 0"
              class="btnDefault pointer"
              @click="addQuestionBack"
              >保存</a
            >
            <a
              class="btnDefault pointer"
              v-if="courseList_Org.length > 0"
              @click="(isConfirmWork = true), addQuestionBack(2)"
              >发布</a
            >
          </div>
        </div>

        <!--小节作业不存在-->
        <div
          class="noData_box"
          v-if="noData && status == 1 && sindex != '' && noEdit != 0"
        >
          <p class="mess">当前节下暂无作业，请点击下方新增作业按钮。</p>
          <div>
            <a class="btnDefault pointer" @click="addNewHomework">新增作业</a>
          </div>
        </div>
      </div>
    </div>
    <!--删除弹出框-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring"
            >确定要删除当前选中的题目吗？</span
          >
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteCourseWork">确 认</a>
        <a
          class="btnDefault"
          @click="
            isDelete = false;
            isShow = false;
          "
          >取 消</a
        >
      </div>
    </el-dialog>

    <!--确认作业弹框-->
    <el-dialog :visible.sync="isConfirmWork" width="600px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring"
            >确定要发布作业吗？发布过后将无法修改</span
          >
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmQuestionBack">发 布</a>
        <a class="btnDefault" @click="isConfirmWork = false">取 消</a>
      </div>
    </el-dialog>

    <!--删除作业弹框-->
    <el-dialog :visible.sync="isConfirmDeleteWork" width="600px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前作业吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="deleteAssignmentById">确 定</a>
        <a class="btnDefault" @click="isConfirmDeleteWork = false">取 消</a>
      </div>
    </el-dialog>

    <!--新增作业弹窗-->
    <el-dialog
      :visible.sync="isnewJobName"
      width="500px"
      class="dialog_newJobName"
      v-if="sindex != ''"
    >
      <div slot="title" class="dialog_header">{{ setNameOrTimeTitle }}</div>
      <div class="setScope">
        <el-input
          placeholder="输入作业名称"
          v-model="homework.name"
          maxlength="16"
          v-emoji
        ></el-input>
        <div class="set_endtime_box" v-if="timeStatus == 1">
          <el-date-picker
            type="datetime"
            v-model="homework.endTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="addCourseWork">确 认</a>
      </div>
    </el-dialog>

    <!--修改作业名称-->
    <el-dialog
      :visible.sync="modifyJobName"
      width="500px"
      class="dialog_newJobName"
      v-if="sindex != ''"
    >
      <div slot="title" class="dialog_header">{{ setNameOrTimeTitle }}</div>
      <div class="setScope">
        <el-input
          placeholder="输入作业名称"
          v-model="modifyName"
          v-emoji
          maxlength="20"
        ></el-input>
        <div class="set_endtime_box" v-if="timeStatus == 1">
          <el-date-picker
            type="datetime"
            v-model="homework.endTime"
            :picker-options="pickerOptions"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="modifyCourseName">确 认</a>
      </div>
    </el-dialog>

    <!--题库选择弹出框-->
    <el-dialog
      :visible.sync="showQuestionBank"
      width="1100px"
      class="dialog_pagination teacher_add_coursework"
    >
      <div slot="title" class="dialog_header">新增题目（题目库选择）</div>
      <div class="course_list dialog_course_list">
        <div class="pageTab clearfix">
          <div class="fl">
            <div class="sel-box">
              <el-select
                v-model="customClass"
                value-key="id"
                placeholder="自定义分类"
                @change="selectType"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div class="sel-box" v-if="options1.length > 0">
              <el-select
                v-model="i_customClass"
                value-key="id"
                placeholder="自定义分类"
                @change="selectType1"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div class="sel-box">
              <el-select
                v-model="cate"
                placeholder="题目类型"
                @change="selectQuestionType"
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
                placeholder="请输入作业标题"
                type="text"
                autocomplete="off"
                v-model="searchText"
                v-emoji
                @keyup.enter="searchQuestionAll"
              />
              <!--<a class="searchBtn pointer"></a>-->
            </div>
            <a class="btn_finsh" @click="searchQuestionAll">查询</a>
          </div>
        </div>
        <!--选择题-->
        <ul class="choice_question">
          <li
            class="li_choose"
            style="margin-bottom: 15px"
            v-for="(item, index) in all_courseList"
            :key="index"
          >
            <div class="title">{{ item.content }}</div>
            <div class="pic" v-if="item.picUrl != '' && item.picUrl">
              <span><img :src="state.pic_Url + item.picUrl" /></span>
            </div>
            <p class="answer_box" v-if="item.type == 0">
              <span
                class="s_radio"
                :class="{ s_radio_answer: iitem == item.answer }"
                v-for="(iitem, iindex) in JSON.parse(item.choice)"
                :key="iindex"
              >
                {{ iitem }}
              </span>
            </p>
            <p class="answer_box" v-if="item.type == 1">{{ item.answer }}</p>
            <!--选中的状态添加class   li_radio_h-->
            <span
              class="li_radio"
              :class="{ li_radio_h: item.checked }"
              @click="cheeckedList(2, item, index, item.checked)"
            >
            </span>
          </li>
        </ul>
      </div>

      <div class="choseFooter clearfix">
        <a class="btnDefault fl pointer" @click="showQuestion(2)" v-if="1 == 1"
          >确认</a
        >

        <div class="tab-pagination fr">
          <el-pagination
            background
            :current-page="curPage"
            :page-size="perPage_All"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,jumper"
            :total="totalAllCourse"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <!--单题设置时间弹出-->
    <el-dialog :visible.sync="isSetTime" width="500px" @close="score = ''">
      <div slot="title" class="dialog_header">设置该题目分数</div>
      <div class="setScope">
        <el-input placeholder="请输入该题目的分数" v-model="score"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="setScore">确 认</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import courseNav from "@/components/left_courseNav.vue";
import noData from "@/components/noData.vue";
import {
  findParentCategory,
  findChildCategory,
  getQuestionBackAll,
  addAssignment,
  getAssignmentBySectionId,
  addQuestionBackAssignmentList,
  getAssignmentNameBySectionId,
  modifyAssignmentNameById,
  modifyAssignmentStatusById,
  deleteAssignmentById,
} from "@/API/api";
export default {
  inject: ["reload"],
  data() {
    return {
      isConfirmDeleteWork: false,
      setNameOrTimeTitle: "请设置作业名称",
      canEdit: 0,
      nowData: {},
      options: [
        { value: "1", label: "选择题" },
        { value: "2", label: "简答题" },
      ],
      customClass: {}, //父类
      i_customClass: {}, //子类
      options2: [],
      options1: [],
      cate: "选择题", //课件分类默认内置课件
      showQuestionBank: false, //题库是否显示(弹出框)
      dialogWidth: 0,
      //作业列表参数根据具体实际情况来定
      courseWork: {},
      courseList_Org: [],
      courseList_backUp: [],
      courseList: [],
      //全部题目
      all_courseList: [],
      status: "",
      // courseWorkTitle:'',
      isShow: false,
      deleteList: [], //选中需要删除的题目列表
      chooseList: [], //新增题目选中
      isDelete: false,
      isConfirmWork: false,
      type: 0, //题目类型
      curPage: 1,
      perPage: 100,
      perPage_All: 5,
      noData: true, //小节没有内容
      isSetTime: false, //设置题目时间弹窗
      sindex: "",
      totalAllCourse: 1,
      isnewJobName: false,
      modifyJobName: false,
      modifyName: "", //修改作业名称
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      homework: {
        name: "", //作业名称
        endTime: "", //作业的截止时间
      },
      assignmentId: "",
      score: "",
      updateScore: {},
      parentId: "", //父类id
      childrenId: "", //子类id
      searchText: "", //搜索框
    };
  },
  computed: {
    ...mapState({
      state: (state) => state,
    }),
  },
  props: {
    timeStatus: { default: 0 }, //默认管理员为0，不显示时间
    course_info: {},
    noEdit: "",
  },
  components: {
    courseNav,
    noData,
  },
  created() {
    let that = this;
    //alert(this.options[0].value)
    this.cate = this.options[0].label; //默认选中内置课件
    this.setDialogWidth();
    that.addState(that.courseList);
    if (that.timeStatus == 1) {
      that.setNameOrTimeTitle = "请设置作业名称/截止时间";
    } else {
      that.setNameOrTimeTitle = "请设置作业名称";
    }
  },
  mounted() {
    let that = this;

    window.onresize = () => {
      return (() => {
        this.setDialogWidth();
      })();
    };
  },
  methods: {
    addNewHomework() {
      let that = this;
      if (that.timeStatus == 1) {
        that.setNameOrTimeTitle = "请设置作业名称/截止时间";
      } else {
        that.setNameOrTimeTitle = "请设置作业名称";
      }
      that.isnewJobName = true;
      that.homework.name = "";
      that.homework.endTime = "";
    },
    //查题库
    getQuestionBackAll() {
      let that = this;
      that.findQuestionBackAll(
        that.type,
        "",
        "",
        that.curPage,
        that.assignmentId,
        ""
      );
    },
    findQuestionBackAll(
      type,
      content,
      category_id,
      page,
      assignment_id,
      c_category_id
    ) {
      let that = this;
      that.all_courseList = [];
      let obj = {};
      obj.type = type;
      obj.content = content;
      obj.category_id = category_id;
      obj.c_category_id = c_category_id;
      obj.perPage = that.perPage_All;
      obj.page = page;
      obj.assignment_id = assignment_id;
      getQuestionBackAll(obj).then((res) => {
        if (res.code == 200) {
          // alert("111")
          that.searchText = "";
          that.totalAllCourse = res.data.total;
          // alert(that.totalAllCourse);
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].checked = false;
            for (let j = 0; j < that.courseList.length; j++) {
              if (res.data.list[i].id == that.courseList[j].id) {
                res.data.list[i].checked = true;
                //console.log(123);
              }
            }
          }
          console.log(res.data.list);
          console.log(that.courseList);
          // alert(JSON.stringify(res.data.list))
          that.all_courseList = res.data.list;
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    addCourseWork() {
      let that = this;
      let obj = {};
      obj.section_id = that.sindex;
      obj.name = that.homework.name;
      if (that.homework.name == "") {
        return that.$toast("作业名称不可为空", 2000);
      }
      if (that.timeStatus == 1) {
        /*
        let datetime=that.homework.endTime.getFullYear() + '-' + (that.homework.endTime.getMonth() + 1) + '-' + that.homework.endTime.getDate() + ' ' + that.homework.endTime.getHours() + ':' + that.homework.endTime.getMinutes() + ':' + that.homework.endTime.getSeconds();
        obj.end_at = new Date(datetime).toISOString();
        */
        if (that.homework.endTime == "" || that.homework.endTime == null) {
          return that.$toast("作业截止时间不为空", 2000);
        }

        if (that.course_info.end_at == "" || that.course_info.end_at == null) {
          return that.$toast("该课程尚未设置起止时间，请先进行设置！", 3000);
        }

        let dates1 = new Date(that.homework.endTime);
        let dates2 = new Date(that.course_info.end_at);
        let dates3 = new Date(that.course_info.start_at);
        if (dates1 > dates2) {
          return that.$toast("作业截止时间不能大于课程截止时间", 3000);
        }
        if (dates1 < dates3) {
          return that.$toast("作业截止时间不能小于课程开始时间", 3000);
        }
        obj.end_at = new Date(that.homework.endTime).toUTCString();
      } else {
        var date = new Date();
        obj.end_at = new Date(date.toLocaleDateString()).toUTCString();
      }
      obj.qualified_score = 100;

      addAssignment(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {
          that.canEdit = 1;
          that.assignmentId = res.data.id;
          that.isnewJobName = false;
          that.status = 0;
          that.noData = false;
          that.courseWork = res.data;

          //that.getAssignmentBySectionId();
        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
    //获取父类
    findParentCategory() {
      let that = this;
      findParentCategory().then((res) => {
        // alert(JSON.stringify(res));
        console.log(res);
        if (res.code == 200) {
          that.options2 = res.data;
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    findChildCategory(val) {
      let that = this;
      let obj = {};
      obj.parent_category_id = val.id;
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

      that.i_customClass = "";
      // that.customClass = "";
      (that.parentId = ""), (that.childrenId = ""), console.log(val);
      that.parentId = val.id;
      that.findChildCategory(val);
      that.findQuestionBackAll(
        that.type,
        "",
        that.parentId,
        1,
        that.assignmentId,
        ""
      );
    },
    //子类
    selectType1(val) {
      let that = this;
      that.childrenId = val.id;
      that.findQuestionBackAll(
        that.type,
        "",
        that.parentId,
        1,
        that.assignmentId,
        that.childrenId
      );
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      let that = this;
      that.curPage = val;
      // alert(that.parentId);
      that.findQuestionBackAll(
        that.type,
        that.searchText,
        that.parentId,
        val,
        that.assignmentId,
        that.childrenId
      );
    },
    //选中事件
    cheeckedList(num, obj, index, checked) {
      let that = this;
      //删除选中
      if (num == 1) {
        if (!checked) {
          if (!(that.deleteList.indexOf(obj.id) != -1)) {
            that.deleteList.push(obj.id);
          }
          that.$set(that.courseList[index], "checked", true);
        } else {
          that.$set(that.courseList[index], "checked", false);
          let i = that.deleteList.indexOf(obj.id);
          that.deleteList.splice(i, 1);
        }
      } else {
        //新增选中

        if (!checked) {
          that.$set(that.all_courseList[index], "checked", true);
          that.chooseList.push(obj);
        } else {
          that.$set(that.all_courseList[index], "checked", false);
          for (let i = 0; i < that.chooseList.length; i++) {
            let tmp = that.chooseList[i];
            if (obj.id == tmp.id) {
              that.chooseList.splice(i, 1);
            }
          }
        }
        that.showQuestion(1);
      }
    },

    //数组列表添加是否选中字段
    addState(array) {
      let that = this;
      for (var i = 0; i < array.length; i++) {
        that.$set(array[i], "checked", false);
      }
    },
    //弹出框设置响应式宽度
    setDialogWidth() {
      var val = document.documentElement.clientWidth;
      const def = 1200; // 默认宽度
      if (val < def) {
        this.dialogWidth = "80%";
      } else {
        this.dialogWidth = def - 200 + "px";
      }
    },
    //弹出框右上角关闭安妮
    handleClose() {
      let that = this;
      that.showQuestionBank = false;
    },
    setNewScore(item) {
      let that = this;
      that.isSetTime = true;
      that.updateScore = item;
    },
    setScore() {
      let that = this;
      this.$set(that.updateScore, "score", that.score);
      that.isSetTime = false;
    },
    //新增题目，题目选择确认
    showQuestion(flag) {
      let that = this;

      if (flag != 1) {
        that.courseList_Org = that.courseList;
        that.showQuestionBank = false;
        //保存
        that.addQuestionBack(2);
        return;
      }

      if (that.courseList.length == 0) {
        that.courseList = that.chooseList;
      } else {
        that.courseList = [];

        for (let i = 0; i < that.courseList_backUp.length; i++) {
          that.courseList.push(that.courseList_backUp[i]);
        }

        for (let i = 0; i < that.chooseList.length; i++) {
          that.courseList.push(that.chooseList[i]);
        }
      }

    },

    unique(arr) {
      for (var i = 0, len = arr.length; i < len; i++) {
        for (var j = i + 1, len = arr.length; j < len; j++) {
          if (arr[i].id === arr[j].id) {
            arr.splice(j, 1);
            j--; 
            len--;
          }
        }
      }
      return arr;
    },

    addQuestionBack(flag) {
      // alert("111");
      let that = this;
      that.isShow = false;
      let obj = {};
      let list = [];
      // alert(that.assignmentId);
      let totalscore = 0;
      console.log(that.courseList_Org.length);

      for (let i = 0; i < that.courseList_Org.length; i++) {
        totalscore += parseInt(that.courseList_Org[i].score);
      }
      if (totalscore > 100) {
        this.$toast("总分值大于100,请修改", 3000);
        return;
      }
      for (let i = 0; i < that.courseList_Org.length; i++) {
        let objques = {};
        objques.assignment_id = that.assignmentId;
        objques.question_id = that.courseList_Org[i].id;
        objques.score = 0; //that.courseList[i].score
        list.push(objques);
      }
      obj.question_back_assignment_list = list;
      console.log(JSON.stringify(obj));
      addQuestionBackAssignmentList(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {
          // alert("新增成功");


          return;

          // if (flag == 2) {
          //   return;
          // }

          // if (flag == 1) {
          //   this.$toast("删除成功", 2000);
          // } else {
          //   this.$toast("保存成功", 2000);
          // }

          // //这边要刷新下作业
          // that.getData(that.nowData);
        } else {
          // alert("新增失败");
          this.$toast(res.message, 2000);
        }
      });
    },

    //确认当前作业
    confirmQuestionBack() {
      let that = this;

      let obj = {};
      if (that.timeStatus == 1) {
        /*
        let datetime=that.homework.endTime.getFullYear() + '-' + (that.homework.endTime.getMonth() + 1) + '-' + that.homework.endTime.getDate() + ' ' + that.homework.endTime.getHours() + ':' + that.homework.endTime.getMinutes() + ':' + that.homework.endTime.getSeconds();
        obj.end_at = new Date(datetime).toISOString();
        */
        if (that.homework.endTime == "" || that.homework.endTime == null) {
          return that.$toast("作业截止时间不为空", 2000);
        }
        if (that.course_info.end_at == "" || that.course_info.end_at == null) {
          return that.$toast("该课程尚未设置起止时间，请先进行设置！", 3000);
        }

        let dates1 = new Date(that.homework.endTime);
        let dates2 = new Date(that.course_info.end_at);
        let dates3 = new Date(that.course_info.start_at);
        var dateNow = new Date();
        if (dates1 > dates2) {
          return that.$toast("作业截止时间不能大于课程截止时间", 3000);
        }
        if (dates1 < dates3) {
          return that.$toast("作业截止时间不能小于课程开始时间", 3000);
        }
        if (dates1 < dateNow) {
          return that.$toast("作业截止时间不能小于当前时间", 3000);
        }
        obj.end_at = new Date(that.homework.endTime).toUTCString();
      }
      that.isConfirmWork = false;
      obj.id = that.assignmentId;
      obj.status = 1;
      // alert(that.assignmentId);
      modifyAssignmentStatusById(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {
          this.$toast("发布成功，不可修改", 2000);
          that.canEdit = 0;
          // alert("确认成功，不可修改");
        } else {
          // alert("确认失败");
          this.$toast(res.message, 2000);
        }
      });
    },

    //删除当前作业
    deleteAssignmentById() {
      let that = this;

      let obj = {};
      let arr = [];
      arr.push(that.assignmentId);
      obj.assignment_id_list = arr;
      that.isConfirmDeleteWork = false;

      deleteAssignmentById(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {
          this.$toast("删除作业成功！", 2000);
          //这边要刷新下作业
          that.getData(that.nowData);
        } else {
          // alert("确认失败");
          this.$toast(res.message, 2000);
        }
      });
    },

    //选择分类(选择，简答)
    selectCate(val) {
      console.log("asd" + val);
      let that = this;
      that.getAssignmentBySectionId(val - 1);
    },

    //删除题目
    deleteOperation() {
      let that = this;

      if (that.isShow && that.deleteList.length > 0) {
        that.isDelete = true;
      } else {
        that.isShow = !that.isShow;
        that.addState(that.courseList_Org);
        that.deleteList = [];
      }
    },
    //修改作业
    reset_homework() {
      let that = this;

      if (that.timeStatus == 1) {
        that.setNameOrTimeTitle = "请设置作业名称/截止时间";
      } else {
        that.setNameOrTimeTitle = "请设置作业名称";
      }

      that.modifyJobName = true;
      that.modifyName = that.courseWork.name;
    },
    //查询课件库
    searchQuestionAll() {
      let that = this;

      that.curPage = 1;
      that.findQuestionBackAll(
        that.type,
        that.searchText,
        that.parentId,
        that.curPage,
        that.assignmentId,
        that.childrenId
      );
    },
    modifyCourseName() {
      let that = this;

      let obj = {};
      obj.id = that.assignmentId;
      obj.name = that.modifyName;

      if (that.modifyName == "" || that.modifyName == null) {
        return that.$toast("作业名称不可为空", 2000);
      }

      if (that.timeStatus == 1) {
        /*
        let datetime=that.homework.endTime.getFullYear() + '-' + (that.homework.endTime.getMonth() + 1) + '-' + that.homework.endTime.getDate() + ' ' + that.homework.endTime.getHours() + ':' + that.homework.endTime.getMinutes() + ':' + that.homework.endTime.getSeconds();
        obj.end_at = new Date(datetime).toISOString();
        */
        if (that.homework.endTime == "" || that.homework.endTime == null) {
          return that.$toast("作业截止时间不为空", 2000);
        }
        if (that.course_info.end_at == "" || that.course_info.end_at == null) {
          return that.$toast("该课程尚未设置起止时间，请先进行设置！", 3000);
        }

        let dates1 = new Date(that.homework.endTime);
        let dates2 = new Date(that.course_info.end_at);
        let dates3 = new Date(that.course_info.start_at);
        var dateNow = new Date();
        if (dates1 > dates2) {
          return that.$toast("作业截止时间不能大于课程截止时间", 3000);
        }
        if (dates1 < dates3) {
          return that.$toast("作业截止时间不能小于课程开始时间", 3000);
        }
        if (dates1 < dateNow) {
          return that.$toast("作业截止时间不能小于当前时间", 3000);
        }
        obj.end_at = new Date(that.homework.endTime).toUTCString();
      } else {
        var date = new Date();
        obj.end_at = new Date(date.toLocaleDateString()).toUTCString();
        // obj.end_at = date.toLocaleDateString().toUTCString();
      }
      console.log(JSON.stringify(obj));
      modifyAssignmentNameById(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {
          // alert("修改题目名称成功");
          that.modifyJobName = false;
          that.noData = false;
          // that.courseWorkTitle = that.modifyName;
          that.courseWork.name = that.modifyName;
          // that.$set(that.homework, 'name', that.modifyName);
          that.modifyName = "";
          that.$toast("修改成功！", 3000);
          // that.reload();
          //that.getAssignmentBySectionId();
        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
    //选择题目类型（选择，简答）
    selectQuestionType(val) {
      console.log("选择题类型" + val);
      // alert("1111111")
      let that = this;
      that.type = val - 1;
      that.curPage = 1;

      // alert(that.parentId + "-------" +that.childrenId)
      that.findQuestionBackAll(
        that.type,
        "",
        that.parentId,
        that.curPage,
        that.assignmentId,
        that.childrenId
      );
    },
    //删除确认
    confirmDeleteCourseWork() {
      let that = this;
      that.isDelete = false;
      that.isShow = false;
      //       alert(JSON.stringify(that.deleteList));
      // console.log(JSON.stringify(that.courseList))
      let tmpArr = [];
      for (let i = 0; i < that.courseList_Org.length; i++) {
        let q1 = that.courseList_Org[i];
        let isExist = 0;
        for (let j = 0; j < that.deleteList.length; j++) {
          let q2 = that.deleteList[j];

          if (q1.id == q2) {
            isExist = 1;
          }
        }
        if (isExist == 0) {
          tmpArr.push(q1);
        }
      }

      if (tmpArr.length == 0) {
        this.$toast("作业题目不能为空，删除失败！", 3000);
        return;
      }

      that.courseList_Org = tmpArr;
      //保存
      that.addQuestionBack(1);
    },
    //点击新增题目
    click_new() {
      let that = this;
      // that.chooseList = [];
      that.options1 = [];
      that.options2 = [];
      that.i_customClass = "";
      that.customClass = "";
      (that.parentId = ""),
        (that.childrenId = ""),
        (that.cate = this.options[0].label); //默认选中内置课件
      that.type = 0;
      that.showQuestionBank = true;
      that.curPage = 1;
      //that.addState(that.all_courseList);
      that.deleteList = [];
      that.getQuestionBackAll();
      that.findParentCategory();
    },

    getData(data) {
      let that = this;

      that.canEdit = 1; //设置能编辑
      that.nowData = data;
      that.courseList = [];
      that.courseList_Org = [];
      that.courseList_backUp = [];
      that.all_courseList = [];
      
      that.chooseList = [];

      that.sindex = data.sindex;
      console.log(data.sindex);
      if (data.sindex != "") {
        let obj1 = {};
        obj1.sectionId = data.sindex;
        getAssignmentNameBySectionId(obj1).then((res) => {
          console.log(JSON.stringify(res));
          if (res.code == 200) {
            if (res.data.name == "" || res.data.name == null) {
              // alert("123");
              that.status = 1;
              that.noData = true;
              that.courseList = [];
              that.chooseList = [];
            } else {
              // that.courseWorkTitle = res.data.name;
              that.homework.endTime = res.data.endAt;
              // that.modifyName = res.data.name;
              that.assignmentId = res.data.id;
              that.courseWork = res.data;
              if (res.data.status == 1) {
                that.canEdit = 0;
              } else {
                that.canEdit = 1;
              }

              let obj = {};
              obj.sectionId = data.sindex;
              obj.perPage = that.perPage;
              obj.page = 1;
              obj.type = "";
              getAssignmentBySectionId(obj).then((res) => {
                that.status = "";
                that.courseList = "";
                if (res.code == 200) {
                  console.log("asd" + res.data.list[0]);
                  if (res.data.list.length > 0) {
                    that.courseList = res.data.list;
                    that.courseList_Org = res.data.list;
                    that.courseList_backUp = res.data.list;
                  }
                  that.noData = false;
                  // alert(that.status)
                  // console.log(res.data.list)
                  // alert("查询题目成功");
                } else {
                  that.$toast(res.message, 3000);
                }
              });
            }
          } else {
            that.$toast(res.message, 3000);
          }
        });
      }
    },
    getAssignmentBySectionId(type) {
      let that = this;
      let obj = {};
      obj.sectionId = that.sindex;
      obj.perPage = that.perPage;
      obj.page = 1;
      obj.type = "";
      getAssignmentBySectionId(obj).then((res) => {
        if (res.code == 200) {
          // alert(111)
          that.courseList = res.data.list;
          that.courseList_Org = res.data.list;
          that.courseList_backUp = res.data.list;
          console.log(res.data.list);
          // alert("查询题目成功");
        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../assets/less/admin.less);
@import url(../assets/less/coursework.less);
.setScope {
  margin: 0 50px;
}
.coursework_box {
  position: relative;
}
.coursework_name {
  padding-right: 60px;
  position: relative;
  > p {
    font-size: 18px;
  }
  .edit {
    position: absolute;
    right: 40px;
    top: 50%;
    margin-top: -9px;
  }
  .delete {
    right: 0px;
    background: url(../assets/img/d_coursework_del.png) center no-repeat;
  }
}
.add_btn_box {
  text-align: center;
}
.coursework_box .course_list {
  height: 460px;
  padding: 20px 0;
}
</style>
<style lang="less">
.dialog_newJobName {
  .el-dialog__footer {
    padding-top: 0px;
  }
}

.pageTab .sel-box {
  width: 180px;
}
.pageTab .fr .d-serach {
  padding-left: 12px;
  padding-right: 12px;
  width: 170px;
  margin-right: 20px;
}
.btn_finsh {
  background: @basecolor;
  font-size: 16px;
  color: #fff;
  display: inline-block;
  padding: 5px 8px;
  .borderRadius(5px,5px,5px,5px);
  vertical-align: middle;
  cursor: pointer;
}

.set_endtime_box {
  margin-top: 20px;
}
</style>
