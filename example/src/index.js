import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import FormSelector from "./FormSelector";

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <h1>@hornbeck/react-form</h1>
      <FormSelector />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
