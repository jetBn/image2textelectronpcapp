import React from 'react';
// import './style.css'
// import '../../lib/capture-renderer'


class Capture extends React.Component {
  render() {
    return (
      <div>
        <div id="js-bg" className="bg"></div>
            <div id="js-mask" className="mask"></div>
            <canvas id="js-canvas" className="image-canvas"></canvas>
            <div id="js-size-info" className="size-info"></div>
            <div id="js-toolbar" className="toolbar">
                <div className="iconfont icon-zhongzhi" id="js-tool-reset"></div>
                <div className="iconfont icon-xiazai" id="js-tool-save"></div>
                <div className="iconfont icon-guanbi" id="js-tool-close"></div>
                <div className="iconfont icon-duihao" id="js-tool-ok"></div>
            </div>
        </div>
   );
  }
 
}
export default Capture;
