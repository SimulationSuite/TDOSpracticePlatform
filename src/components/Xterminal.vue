<template>
<div>
  <div :id="'xterm'+id" class="xterm" ref="xterm" />
  </div>
</template>

<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
let that = this;
export default {
  name: "Xterm",
  data() {
    return {
      socket: null,
      term: null,
      xterm_height:0
    };
  },
  props: {
    socketURI: {
      type: String,
      default: "",
    },
    height:{
      default:0
    },
    isShow:{
      default:true
    },
    id:{
      default:0
    }
  },

  watch: {
    socketURI: {
      handler(val, olVal) {
        console.log(val)
          this.socket = null;
          this.term = null;    
      },
      
    },
    height:{
      handler(val, olVal) { 
       
        this.xterm_height = val;
        
      },
 
    }
  },

  mounted() {
    this.initSocket();
    window.addEventListener('resize',this.windowChange);
  },

  beforeDestroy() {
    this.socket.close();
    this.term.dispose();
    window.removeEventListener("resize",this.windowChange);
    
  },
 
  methods: {
    close() {
      this.socket.close();
      this.term.dispose();
    },
    initTerm() {
        this.$nextTick(function(){
            //let height = 0    
           let that = this
           const term = new Terminal({
              rows:parseInt(that.xterm_height/17, 10),
              cursorBlink: true,
  
           });
           const attachAddon = new AttachAddon(this.socket);
           const fitAddon = new FitAddon();         
            term.loadAddon(attachAddon);
            term.loadAddon(fitAddon);
          
            term.open(document.getElementById("xterm"+this.id));
            //fitAddon.fit();
            term.focus();
            this.term = term;
           

        })
  
      


      
    },
    initSocket() {
        //ws://192.168.1.167:4002 this.socketURI 
      this.socket = new WebSocket(this.socketURI);
     
      this.socketOnClose();
      this.socketOnOpen();
      this.socketOnError();
        
    },
    socketOnOpen() {
      this.socket.onopen = () => {
        // 链接成功后
        this.initTerm();
        this.$parent.imageOpen()
      };
    },
    socketOnClose() {
      this.socket.onclose = () => {
        // console.log('close socket')
        this.$parent.imageClose()
      };
    },
    socketOnError() {
      this.socket.onerror = () => {
        // console.log('socket 链接失败')
      };
    },
   
  windowChange(){
      this.$nextTick(function(){

     let that = this
  
      this.term.resize(90,parseInt(that.xterm_height/17, 10));
      this.term.scrollToBottom();
       })
    }

  
  },
  
};
</script>

<style lang="less" scoped>
.xterm {
  width: 100%;
  height: 100%;
}
</style>
