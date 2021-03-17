import axios from 'axios'

import router from '@/router/index'
//自定义配置新建一个axios实例
const http = axios.create({
	baseURL: 'http://192.168.1.188:8111',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	},
	timeout: 50000
})

//添加请求拦截器
http.interceptors.request.use(function (config) {
  console.log(sessionStorage.getItem('jwt'))
	if(config.method=='delete'){
		config.headers['Content-Type']='application/json'
	}
	//console.log(config)
	/*
	if (localStorage.getItem('Authorer')) {
		config.headers.Authorization = localStorage.getItem('Authorer');
	  }
	  */
	config.headers.Authorization = sessionStorage.getItem('jwt')



	//对响应数据做点什么\
	return config;

},)

//添加响应拦截器
http.interceptors.response.use(function (response) {
  if (response.data.code == 400 || response.data.message == 'jwt is invalid') {
    response.data.message = 'jwt失效，请重新登录'
   router.push({
      path: "/login"
    })
  }
	return response.data;
},function (error) {
	return Promise.reject(error)
})

export default http;
