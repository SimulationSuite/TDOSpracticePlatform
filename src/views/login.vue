<template>
    <div class="pageWrap wrap-login">
        <div class="loginMain">
            <div class="lo-form">
                <img src="../assets/img/login_form.png"/>
                <div class="logoin-info">
                    <div class="tab-cell">
                        <div class="icon">
                            <img src="../assets/img/login_icon.png"/>
                        </div>
                        <div class="login-from">
                            <h3 class="htitle">欢迎登陆实链通</h3>
                            <div class="din din-user">
                                <input placeholder="请输入账号" v-model="userName" autocomplete="off" @keyup.enter="getJwt"/>
                            </div>
                            <div class="din din-paw">
                                <input type="password" placeholder="请输入密码" v-model="password" autocomplete="off" @keyup.enter="getJwt"/>
                            </div>
                             <p class="p-forget">
                                <router-link to=""></router-link>
                            </p>
                            <div class="btnbox">
                                <a class="pointer btnlogin"  @click="getJwt">登录</a>
                            </div>
                        </div>
                    </div>
                    <div class="logo"><img src="../assets/img/logo.png"/></div>
                </div>
            </div>


        </div>
    </div>
</template>
<script>
import {login,createToken} from '@/API/api';
export default {
    data(){
        return{
           userName:'',//用户名
           password:'',//密码
            bodyBgImage: 'url(' + require('../assets/img/login_bg.png') + ')'
        }
    },

    mounted(){
        this.$nextTick(()=>{
           this.setBodyBackGround()
        })


    },
     beforeDestroy(){
        // 离开页面的时候清除
            this.clearBodyBackGround()

    },
   methods:{
        pp_login(){
            let that = this;
            if(that.userName ==''){
                return  that.$toast('请输入账号',2000)
            }
            if(that.password ==''){
                return  that.$toast('请输入密码',2000)
            }
            let obj = {}
            obj.id = that.userName;
            obj.password = that.password;
            let role_id;
            console.log(obj)
            login(obj).then(res=> {
                if(res.code==200){
                    //生成token
                    //that.getJwt(that.userName);
                    window.sessionStorage.setItem('userId',res.data.user_id);
                    window.sessionStorage.setItem('userName',res.data.user_name);
                    role_id = res.data.role_id;
                    if(role_id == 0){
                        //0,1 2学生，教师，管理员
                        window.sessionStorage.setItem('p_p-authority',2)
                        window.sessionStorage.setItem('p_p-admin_userName',that.userName)
                        that.$router.push({path:'/admin'})
                    }
                    if(role_id == 1){
                        //0,1 2学生，教师，管理员
                        window.sessionStorage.setItem('p_p-authority',1)
                        window.sessionStorage.setItem('p_p-teacher_userName',that.userName)
                        that.$router.push({path:'/teacher'})
                    }
                    if(role_id == 2){
                        //0,1 2学生，教师，管理员
                        window.sessionStorage.setItem('p_p-authority',0)
                        window.sessionStorage.setItem('p_p-student_userName',that.userName)
                        that.$router.push({path:'/student'})
                    }
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
       getJwt(id){
          id='';
           let obj={};
           let that = this;
           obj.id=that.userName;
           createToken(obj).then(res=> {
               if(res.code==200){
                   sessionStorage.removeItem('jwt')
                   sessionStorage.setItem('jwt',res.data);

                  that.pp_login();

               }else{
                   this.$toast(res.message,2000)
               }
           })
       },
         // 添加body图片
        setBodyBackGround () {


            document.body.style.backgroundImage = this.bodyBgImage
            document.body.style.backgroundSize = 'cover'



        },
            // 清除背景图
        clearBodyBackGround () {
           document.body.style.backgroundImage = ''
        },
    }
}
</script>
<style lang="less" scoped>
.wrap-login{display: table;width:100%;height:100%;}
.loginMain{ display: table-cell; vertical-align: middle;padding:50px 0}
.d-col{padding: 10px 0;}


.lo-form{
    width: 1560px; margin: 0 auto; position: relative;
    img{width:100%;}
    .logoin-info{position:absolute;width:100%;height:100%;left:0px;top:0px;display: table;}
    .tab-cell{
        display: table-cell; vertical-align:middle;text-align:center;
        .icon{width:40%;display: inline-block; vertical-align:middle; margin: 0 50px;}

    }
    .login-from{display: inline-block; vertical-align: middle; text-align: center;margin: 0 50px;}
    .htitle{font-size:40px;color: @fontColor2; padding-bottom: 40px;}
    .din{width:248px;border-bottom: 1px solid #666666; margin-top: 15px;}
    input{width:100%;font-size: 16px; height:40px;line-height:40px;}
    .din-user{background: url(../assets/img/icon_user.png) 5px center no-repeat; padding-left:40px;}
    .din-paw{background: url(../assets/img/icon_paw.png) 5px center no-repeat; padding-left:40px;}
    .p-forget{text-align: right; width:282px; padding: 8px 0;}
    .router-link-exact-active{color:@tabcolor;font-size:16px;}
    .router-link-exact-active:hover{color:@basecolor;}
    .btnbox{padding: 30px 0;}
    .btnlogin{width:324px;height:68px; display: block; margin: 0 auto;line-height: 68px;.borderRadius(34px,34px,34px,34px);
    font-size:24px;color:#fff;
    .gradientlr(#6AB8FC,#0B69F7)
    }
    .logo{width:50px;height: 50px;position: absolute; left:160px;top:50px;}
}
@media screen and (max-width:1600px) {
    .lo-form{width:80%}
}
</style>
