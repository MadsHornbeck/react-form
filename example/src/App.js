import React from "react";
import "./App.css";
import FormSelector from "./FormSelector";

import SimpleForm from "./forms/SimpleForm";
import Example from "./forms/Example";
import DynamicInputs from "./forms/DynamicInputs";
import ChangeHandlers from "./forms/ChangeHandlers";
import Login from "./forms/Login";
import ConditionalInputs from "./forms/ConditionalInputs";
import Mask from "./forms/Mask";

const forms = {
  SimpleForm,
  Example,
  DynamicInputs,
  ChangeHandlers,
  Login,
  ConditionalInputs,
  Mask,
};

function App() {
  return (
    <div className="App">
      <h1>@hornbeck/react-form</h1>
      <FormSelector forms={forms} />
    </div>
  );
}

export default App;
