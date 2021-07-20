

const {
    BrowserWindow,
    ipcMain,
    dialog,
    app
} = require('electron')

const path = require('path')
const querystring = require('querystring');
const uploadPdfDialog = () =>{
    dialog.showOpenDialog({ properties: ['openFile'], filters: [
      { name: 'Custom File Type', extensions: ['pdf'] },
    ] }, async res => {
      if(typeof(res) !== 'undefined') {
        // let resArr = []
  
        // TODO post buffer problem
  
        /* const rowData = fs.readFileSync(res[0])
        // console.log(token)
        console.log(rowData)
  
        let content = querystring.stringify({
          fileData: JSON.stringify(rowData),
          token
        });
        
        let options = {
          hostname: '192.168.1.33',
          port: 8000,
          path: '/api/convert/pdf_file',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        };
        let req = http.request(options, function (res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
          //JSON.parse(chunk)
          });
        });
        req.on('error', function (e) {
          console.log('problem with request: ' + e.message);
        });
        // write data to request body
        req.write(content);
        req.end();*/
        // const loadingTask = PDFJS.getDocument(rowData);
        // loadingTask.promise
        //   .then(async function (pdfDocument) {
        //     const pageNum = pdfDocument.numPages
        //     for(let i = 1;i <= pageNum; i++ ) {
        //         // const imgItem = await getBase64Img(pdfDocument, i)
        //         // resArr.push(imgItem)
        //     }
        //   })
        // console.log(resArr)
      }
    })
  }
  
  // const getBase64Img = (pdf, i) => {
  //   return new Promise((reslove, reject) =>{
  //       let canvas = Canvas.createCanvas();
  //       let canvasContext = canvas.getContext('2d')      
  //       pdf.getPage(i).then(pageContext => {
  //           const viewPorts = pageContext.getViewport({scale:2})
  //           canvasContext.canvas.width = viewPorts.width
  //           canvasContext.canvas.height = viewPorts.height
  //           pageContext.render({
  //               canvasContext: canvasContext,
  //               viewport: viewPorts
  //           }).promise.then(function () {
  //             reslove(canvasContext.canvas.toDataURL('image/png'))
  //           })  
  //       })      
  //   })          
  // }

module.exports = uploadPdfDialog