// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (num) {
      var title = this.htmlTitle
      let dd =''
       if (num==1){
          dd   = document.querySelector('#pdfDom')
       }
       else{
        dd   = document.querySelector('.ql-editor')
       }
       console.log(dd)
      document.body.appendChild(dd.cloneNode(true));
       
    this.$nextTick(() => {
      html2Canvas(dd, {
        allowTaint: true,
        dpi: 192,
        useCORS: true, // 如果截图的内容里有图片,解决文件跨域问题
        scale:1,
        height: dd.scrollHeight ,
        width:dd.scrollWidth,
        windowHeight:dd.scrollHeight,
      }).then(function (canvas) {
        console.log(canvas)
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        //document.getElementsByTagName("body")[0].innerHTML = '<img src="'+pageData+'"/>'
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      })
    })

   
    }

  }
}