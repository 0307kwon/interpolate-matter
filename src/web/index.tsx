import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.React = React;

const $root = document.querySelector("#root");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  $root
);
