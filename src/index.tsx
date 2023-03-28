import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import Square from './components/Square';

const targetDom = document.getElementById('root');

// 旧的写法
// ReactDOM.render(<div>hello world!!</div>,targetDom);

// 新写法的优点
// https://blog.saeloun.com/2021/07/15/react-18-adds-new-root-api
const root = ReactDOMClient.createRoot(targetDom);
root.render(
  <div>
    <div>hello world!</div>
    <Square></Square>
  </div>
);

