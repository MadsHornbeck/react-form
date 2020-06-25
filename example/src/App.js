import React from "react";
import "./App.css";

import SimpleForm from "./forms/SimpleForm";
import Example from "./forms/Example";
import ThousandInputs from "./forms/ThousandInputs";
import DynamicInputs from "./forms/DynamicInputs";
import ChangeHandlers from "./forms/ChangeHandlers";
import Login from "./forms/Login";
import ConditionalInputs from "./forms/ConditionalInputs";

function App() {
  return (
    <div className="App">
      <h1>@hornbeck/react-form</h1>
      <SimpleForm />
      {/* <Example /> */}
      {/* <ThousandInputs /> */}
      {/* <DynamicInputs /> */}
      {/* <ChangeHandlers /> */}
      {/* <Login /> */}
      {/* <ConditionalInputs /> */}
    </div>
  );
}

export default App;
