import React from "react";

export default function FormSelector({ forms }) {
  const formKeys = Object.keys(forms);
  const [active, setActive] = React.useState(formKeys[0]);
  return (
    <div className="form-selector">
      <ul>
        {formKeys.map((key) => (
          <li key={key}>
            <button onClick={() => setActive(key)}>{key}</button>
          </li>
        ))}
      </ul>
      <div>{React.createElement(forms[active])}</div>
    </div>
  );
}
