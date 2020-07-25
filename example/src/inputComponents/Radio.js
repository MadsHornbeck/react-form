import React from "react";
import InputWrapper from "./InputWrapper";

function Input({ options, meta, label, ...input }, ref) {
  const name = React.useRef(Math.random());
  return (
    <InputWrapper meta={meta} label={label}>
      <span ref={ref}>
        {options.map((value) => (
          <label key={value}>
            <input
              type="radio"
              name={name.current}
              {...input}
              value={value}
              checked={input.value === value}
            />
            {value}
          </label>
        ))}
      </span>
    </InputWrapper>
  );
}

export default React.memo(React.forwardRef(Input));
