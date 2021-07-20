import React from 'react'

import utils from '@/utils/utils'

class Drag extends React.Component {
    componentDidMount() {
        console.log(this.refs.dragBox)
        let dragBoxDom = this.refs.dragBox
        dragBoxDom.addEventListener('dragover', (e)=> {
            e.preventDefault();
            e.stopPropagation();
        })
        dragBoxDom.addEventListener('drop', (e)=> {
            // console.log(e)
            let that = this
            console.log(e.dataTransfer.files)
            let file = e.dataTransfer.files[0]

            if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|pdf)$/.test(file.name)) {     
                // console.log(file) 
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (res) => {
                    console.log(res.target.result)
                    that.props.setMainImgList([res.target.result])
                }
                // this.props.onDropedImg(file)  
            } else{  
                if (/\.(pdf)$/.test(file.name)){
                    utils.pdfFile2Img(file)
                    .then(res=> {
                        that.props.setMainImgList(res)
                    })
                }
            }   
        });
        dragBoxDom.addEventListener('dragenter', (e)=> {
            e.preventDefault();
            e.stopPropagation();
        });
        dragBoxDom.addEventListener('dragleave', (e)=> {
            e.preventDefault();
            e.stopPropagation();
        });
    }

   
    onDragStart(e) {
        console.log(e)
    }
    render() {
        return(
        <div className="drag-box"
            ref="dragBox"
            style={{width:'100%', height: '100%'}}
            >
        {this.props.children}
        </div>
        )
    }
}

export default Drag