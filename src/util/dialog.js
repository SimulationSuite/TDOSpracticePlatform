import Vue from 'vue'

Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {

    var parent_div = el;
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'move'
    
    
   
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
       
      console.log(styL)
      console.log(styT)

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        var l = e.clientX - disX
        var t = e.clientY - disY
        
     
        const max_left= (parseInt(parent_div.clientWidth)-500)/2-3

        const max_top = (parseInt(parent_div.clientHeight)-380)/2-3
        
        if(l<-max_left){
            l=-max_left
        }
        if(l>max_left){
            l=max_left
        }

        if(t<-max_top){
            t=-max_top
        }
        if(t>max_top){
            t=max_top
        }
        
       
     

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})