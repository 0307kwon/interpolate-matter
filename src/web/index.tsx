import App from '@/web/App'
import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import './global.less'

window.React = React

const $root = document.querySelector('#root')

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  $root
)
