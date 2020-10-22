import React from "react";
import { splitPascal } from "./util";
import "./FormSelector.css";

import * as forms from "./forms";
const formKeys = Object.keys(forms);

export default function FormSelector() {
  const [active, setActive] = React.useState(formKeys[0]);
  return (
    <>
      <ul className="form-selector">
        {formKeys.map((key) => (
          <li key={key}>
            <button
              className={active === key ? "active" : ""}
              onClick={() => setActive(key)}
            >
              {splitPascal(key)}
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <h2>{splitPascal(active)}</h2>
      {React.createElement(forms[active])}
    </>
  );
}
