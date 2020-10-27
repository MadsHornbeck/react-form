import React from "react";
import "./Input.css";

function Input({ meta, label, ...input }, ref) {
  return React.createElement(
    input.type === "radio" ? "div" : "label",
    {
      className: [
        "input",
        meta.touched && meta.invalid && "invalid",
        meta.touched && meta.valid && "valid",
      ]
        .filter(Boolean)
        .join(" "),
    },
    <>
      <span>{label}: </span>
      {React.createElement(
        { select: Select, radio: Radio }[input.type] || "input",
        {
          ...input,
          ref,
          value: input.type === "file" ? undefined : input.value,
          "aria-invalid": meta.touched && meta.invalid,
        }
      )}
      {meta.touched && meta.invalid && <em> {meta.error}</em>}
    </>
  );
}

export default React.forwardRef(Input);

const Select = React.forwardRef(({ options = [], ...input }, ref) => (
  <select {...input} ref={ref}>
    {options.map(({ label, value }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
));
Select.displayName = "Select";

const Radio = React.forwardRef(({ options = [], ...input }, ref) =>
  options.map(({ label, value }) => (
    <label key={value}>
      <input {...input} value={value} />
      <span>{label}</span>
    </label>
  ))
);
Radio.displayName = "Radio";
