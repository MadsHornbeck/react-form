import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";

import { useInput, useForm, useMultipleSelect } from "./form";
import { Input, Select, MultipleSelect } from "./testComponents";

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

const options = ["Kage", "Fisk", "Ost"];
function App() {
  // const test = useInput({ format: v => `$ ${v}` });
  const fest = useMultipleSelect({
    // validate,
    initialValue: [],
    parse: (v, p) => {
      const next = p.includes(v) ? p.filter(a => a !== v) : p.concat(v);
      console.log(v, p, next);
      return next;
    },
  });
  const inputs = useMemo(() => ({  fest }), [fest, ]);
  const [onSubmit, isSubmitting] = useForm({
    inputs,
    // validate: formValidate,
    handlers,
    // initialValues: { test: "initial", fest: "values" },
  });
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
          {/* <Input {...test} /> */}
          {/* <Input {...fest} /> */}
          {/* <Select {...fest} options={options} /> */}
          <MultipleSelect {...fest} options={options} />
          {/* <Radio {...fest} options={["Kage", "Fisk", "Ost"]} /> */}
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

export default React.memo(App);
