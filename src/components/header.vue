<template>
  <div>
  <div class="PP_header">
    <div class="header-container">
      <div class="container">
        <div class="fl fl-logo">
          <div class="logo"></div>
          <span>区块链实践平台</span>
        </div>

        <div class="fr fr-info">
          欢迎你,<span class="pointer" @click="resetDialog=true">{{userinfo}}</span>
          <div class="hline"></div>
          <a class="btnexit" @click="logoutDialog=true">退出系统</a>
        </div>
        <ul class="nav_ul">
          <li
            :class="{ cur: index == state.navindex }"
            v-for="(item, index) in menus"
            :key="index"

          >
            <a @click="linPath(item, index)" >{{ item.text }}</a>
            <ul v-if="item.children" class="children-ul" @mouseleave="isShow=false">
              <li v-for="(iitem, iindex) in item.children" :key="iindex" >
                <a  @click="children_linPath(iitem, index)">{{ iitem.text }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>


  </div>
  <!--修改密码弹出框-->
  <el-dialog
      :visible.sync="resetDialog"
      width="500px"
      class="personDialog"
      @close="password='',confirmPassword=''"
    >
    <div slot="title" class="dialog_header">密码修改</div>

      <div class="editMain" style="margin:0 50px" >
        <el-form ref="form" label-width="100px">
          <el-form-item label="输入新密码">
            <el-input onKeyUp="value=value.replace(/[\W]/g,'')"
                      type="password"
                      placeholder="请输入新密码"
                      maxlength="20"
                      v-model="password"></el-input>
          </el-form-item>

          <el-form-item label="确认密码">
            <el-input  onKeyUp="value=value.replace(/[\W]/g,'')" type="password" placeholder="请输入确认密码" maxlength="20" v-model="confirmPassword"></el-input>
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btnDefault" @click="resetDialog = false">取消</button>
        <button class="btnDefault" @click="editPassword">确认</button>
      </span>
    </el-dialog>

    <!--退出登录弹出框-->
    <el-dialog
      :visible.sync="logoutDialog"
      width="500px"
      class="personDialog"
    >
    <div slot="title" class="dialog_header">退出登录</div>

        <div class="confirm_dialog_body" style="padding-bottom:20px">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要退出登录吗？</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btnDefault" @click="logoutDialog = false">取消</button>
        <button class="btnDefault" @click="logOut">确认</button>
      </span>
    </el-dialog>
  </div>


</template>
<script>
import { mapState } from "vuex";
import {updateUserPassword,layout} from '@/API/api';
export default {
  data() {
    return {
      menus:[],
      isShow:false,
      resetDialog:false,
      password:'',
      confirmPassword:'',
      logoutDialog:false,
      userinfo:''

    }
  },
  computed: {
    ...mapState({
      state: (state) => state,
    }),
  },
  watch: {
      // 监听路由变化，路由变化的时候请求页面数据
      '$route': function() {
           let that = this;
          if(this.$route.meta.navindex!=null){
            that.$store.commit("updateNavindex", this.$route.meta.navindex);
          }
          that.navindex = this.$route.meta.navindex
      }
  },
  created(){
    let that = this;
    if(this.$route.meta.navindex!=null){
       that.$store.commit("updateNavindex", this.$route.meta.navindex);
    }
    that.navindex = this.$route.meta.navindex
    that.getUserInfo()

  },
  mounted(){
      let that = this;
      let num = sessionStorage.getItem('p_p-authority');
      //console.log(this.$route.meta.navindex)

      if(num==2){
         that.menus = that.$store.state.ad_menus;

      }
      if(num==1){
        that.menus = that.$store.state.tea_menus;


      }
      if(num==0){
         that.menus = that.$store.state.stu_menus;
      }


  },
  methods: {
    linPath(item, num) {
      let that = this;

      let tmp = that.menus;
      if (!item.children) {
        that.$router.push({ path: item.path }).catch((err) => {
          console.log( err);
        });
         that.$store.commit("updateNavindex", num);
      }
    },
    children_linPath(item,index){
      let that = this;
      let num = sessionStorage.getItem('p_p-authority');
      if(num==2){
         that.$store.commit("updateNavindex", index);
      }
      that.$router.push({ path: item.path }).catch((err) => {
          console.log( err);
        });
    },
    //退出登录
    logOut(){
      let that = this;
      let obj = {};
      obj.user_id = sessionStorage.getItem("userId");
      layout(obj).then(res => {
        if (res.code == 200) {
          window.sessionStorage.removeItem('store')
          window.sessionStorage.removeItem('userId')
          window.sessionStorage.removeItem('jwt')
          let authority = sessionStorage.getItem('p_p-authority') ;
          if(authority==2){
            window.sessionStorage.removeItem('p_p-admin_userName')
            window.sessionStorage.removeItem('p_p-authority')
          }
          if(authority==1){
            window.sessionStorage.removeItem('p_p-teacher_userName')
            window.sessionStorage.removeItem('p_p-authority')
          }
          that.$store.commit("updateNavindex", 0);
          that.$router.push({ path:'/login'}).catch((err) => {
            console.log(err);
          });
        } else {
          this.$toast(res.message, 2000)
        }
      })
    },
    //密码修改
    editPassword(){
      let that =this
      if (that.password=='') {
        return that.$toast('请输入新密码',2000)
      }
      if (that.password.length<6||that.password.length>20) {
        return that.$toast('输入的密码需要为6-20位',2000)
      }
      if (that.confirmPassword=='') {
        return that.$toast('请输入确认密码',2000)
      }
      if (that.password!=that.confirmPassword) {
        return that.$toast('两次输入的密码不一致',2000)
      }
      that.resetDialog = false
      let list = []
      list.push(sessionStorage.getItem("userId"))
      let obj = {};
      obj.user_id_list = list;
      obj.password = that.password;
      //console.log(JSON.stringify(obj))
      updateUserPassword(JSON.stringify(obj)).then(res=>{
        if(res.code==200){
           that.$toast("密码已修改",2000)
           that.logOut()
        }else{
          this.$toast(res.message,3000)
        }
      })

    },
    //根据登录的账号显示对应的用户信息
    getUserInfo(){
      let that = this
      //console.log(sessionStorage.getItem('p_p-authority'))
      if (sessionStorage.getItem('p_p-authority')==0) {
        that.userinfo=sessionStorage.getItem('userName')+'(学号：'+sessionStorage.getItem('userId')+')'
      }else {
        that.userinfo=sessionStorage.getItem('userName')+'(工号：'+sessionStorage.getItem('userId')+')'
      }

    },
  },
};
</script>
<style lang="less" scoped>
.PP_header {
  position: fixed;
  width: 100%;
  height: 75px;
  background: #fff;
  top: 0px;
  z-index: 999;
  width: 100%;
  -moz-box-shadow: 0px 4px 6px 0px rgba(8, 22, 125, 0.14); /*firefox*/
  -webkit-box-shadow: 0px 4px 6px 0px rgba(8, 22, 125, 0.14); /*webkit*/
  box-shadow: 0px 4px 6px 0px rgba(8, 22, 125, 0.14); /*opera或ie9*/

  .header-container {
    margin: 0 60px;
  }
  .logo {
    width: 33px;
    height: 33px;
    display: inline-block;
    vertical-align: top;
    background: @basecolor;
  }
  .fl-logo {
    padding: 21px 0;
    height: 33px;
    line-height: 33px;
    span {
      color: @fontColor;
      padding-left: 15px;
      font-size: 18px;
    }
  }

  .fr-info {
    color: @fontColor1;
    line-height: 35px;
    height: 35px;
    margin-top: 20px;
    font-size: 14px;
    .hline {
      width: 2px;
      height: 15px;
      background: #ddd;
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px;
    }
    .btnexit {
      padding-left: 20px;
      background: url(../assets/img/icon_exit.png) left center no-repeat;
      cursor: pointer;
    }
    .btnexit:hover {
      color: @basecolor;
      background: url(../assets/img/icon_exit_h.png) left center no-repeat;
      cursor: pointer;
    }
  }

  .nav_ul {
    margin: 0 auto;
    text-align: center;
    > li { padding: 0 30px; display: inline-block; height: 75px; line-height: 75px; position: relative; }
    > li a { font-size: 18px; color: @hnavcolor; cursor: pointer; padding: 10px 8px; }
    >li:after{content: ""; width: 71px; height: 3px; position: absolute; left: 50%; margin-left: -35px; bottom: 0px; background: #fff;}
    > li:hover a, > li.cur a { color: @basecolor; }

    > li:hover:after,
    > li.cur:after { content: ""; width: 71px; height: 3px; position: absolute; left: 50%; margin-left: -35px; bottom: 0px; background: @basecolor; }
    .children-ul {
      position: absolute;
      width: 150px;
      background: #fff;
      left: 50%;
      margin-left: -75px;
      border: 1px solid #dcdcdc;
      border-top: 0 none;
      padding-top: 5px;
      display: none;
      > li { height: 50px; line-height: 50px; }
      > li a { color: @hnavcolor; }
      > li a:hover { color: @basecolor; }

    }
    > li:hover{
        .children-ul{display: block;}
     }
  }
  @media screen and (min-width: 1500px) {
    
    .nav_ul {
      > li {
        padding: 0 40px;
      }
    }
  }
  @media screen and (max-width: 1380px) {
    .header-container{margin: 0 30px;}

    .nav_ul {
      > li {
        padding: 0 20px;
      }
    }

  }
   @media screen and (max-width: 1280px) {
   
    .nav_ul {
      > li {
        padding: 0 5px;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  
  .PP_header {
    width: 1200px;
    position:relative;
  }
}
</style>
