
import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
const { ipcRenderer } = window.require('electron')

export default class IAPView extends Component {
    constructor(props) {
        super (props)
        this.state = {products: []}
    }
    getIAPProducts(){
        var _this = this
        ipcRenderer.once('iap-product-get-success',(e,arg)=>{
            // console.log(JSON.parse(arg))
            console.log(this)
            this.setState({products:JSON.parse(arg)})
        });
        ipcRenderer.send('iap-get-products')
        console.log("start get products")
    }

    productPurchase(item) {
        console.log("purchase item:",item)
        ipcRenderer.on('iap-product-purchase-result',(e,arg)=>{
            console.log(arg)
        })
        ipcRenderer.send('iap-product-purchase',item)
    }

    componentDidMount(){
        this.getIAPProducts()
    }
    render() {
        const listItems = this.state.products.map((item,index) =>
                <Button onClick={this.productPurchase.bind(this,item)}>Buy:{item.productIdentifier}/{item.formattedPrice}</Button>
            );
        return  <div>
            <Button onClick={this.getIAPProducts.bind(this)}>Get Products</Button>
            {listItems}
        </div>
    }
}