/*
 * @Descripttion: 
 * @version: 
 * @Author: WGQ
 * @Date: 2020-05-26 15:02:05
 * @LastEditors: WGQ
 * @LastEditTime: 2020-06-05 22:55:13
 */ 
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { MainRouter } from "./router";
import 'normalize.css'
import "antd/dist/antd.css";



ReactDOM.render(
  <React.StrictMode>
   <MainRouter></MainRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

console.log("application start");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
