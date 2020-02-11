import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";

import { useInput, useForm, useValidation, useChangeHandler } from "./form";
import Input from "./testComponents/Input";

import { wait } from "./form/util";

const validate = v => {
  if (!v.length) return "Required";
  return wait(v.length > 3 && "Error");
};

const formValidate = ({ test }) => wait(test === "asdf" && { test: "henning" });

const handlers = {
  test: ({ fest, test }) => {
    if (test.value === "henning") {
      fest.meta.setValue("Ost");
    }
  },
  fest: ({ fest, test }) => {
    if (fest.value === "henning") {
      test.meta.setValue("Ost");
    }
  },
};

function App() {
  const test = useInput({ validate });
  const fest = useInput({ validate });
  const inputs = useMemo(() => ({ test, fest }), [fest, test]);
  useChangeHandler({ inputs, handlers });
  useValidation({ inputs, validate: formValidate });
  const [onSubmit, isSubmitting] = useForm({ inputs, validate: formValidate });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "200px",
          }}
        >
          <Input {...test} />
          <Input {...fest} />
          {isSubmitting && <div>Submitting</div>}
          <button type="submit">Submit</button>
        </form>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
