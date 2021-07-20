import * as PDFJS from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker
class Utils {
    pdfFile2Img(file) {
        let that = this
        return new Promise((reslove, reject) => {
            const reader = new FileReader()
            let resArr = []
            reader.readAsArrayBuffer(file)
            reader.onload = function () {
                const typeArray = new Uint8Array(this.result)
                const loadingTask = PDFJS.getDocument(typeArray)
                loadingTask.promise.then(async pdf => {
                    const pageNum = pdf.numPages
                    for (let i = 1; i <= pageNum; i++) {
                        const imgItem = await that.getBase64Img(pdf, i)
                        resArr.push(imgItem)
                    }
                    reslove(resArr)
                })
            }
        })

    }
    getBase64Img(pdf, i) {
        return new Promise((reslove, reject) => {
            let canvas = document.createElement('canvas')
            let canvasContext = canvas.getContext('2d')
            pdf.getPage(i).then(pageContext => {
                const viewPorts = pageContext.getViewport({
                    scale: 2
                })
                canvasContext.canvas.width = viewPorts.width
                canvasContext.canvas.height = viewPorts.height
                pageContext.render({
                    canvasContext: canvasContext,
                    viewport: viewPorts
                }).promise.then(function () {
                    reslove(canvasContext.canvas.toDataURL('image/png'))
                })
            })
        })
    }
}

export default new Utils()