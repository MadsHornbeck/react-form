import React from "react";
import InputWrapper from "./InputWrapper";

function Select({ options, meta, label, ...input }, ref) {
  return (
    <InputWrapper meta={meta} label={label}>
      <SelectInput ref={ref} {...input} options={options} />
    </InputWrapper>
  );
}

export default React.memo(React.forwardRef(Select));

const SelectInput = React.memo(
  React.forwardRef(({ options, ...input }, ref) => (
    <select {...input} ref={ref}>
      {options.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  ))
);
