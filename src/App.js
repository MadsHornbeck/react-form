import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";

import { useInput, useForm } from "./form";
import Input from "./testComponents/Input";

const validate = v => v.length > 4 && "Error";
function App() {
  const test = useInput({ validate });
  const inputs = useMemo(() => ({ test }), [test]);
  const [onSubmit, isSubmitting] = useForm({ inputs });
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
