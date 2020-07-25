import React from "react";
import InputWrapper from "./InputWrapper";

function Input({ meta, label, ...input }, ref) {
  return (
    <InputWrapper meta={meta} label={label}>
      <input ref={ref} {...input} checked={input.value} />
    </InputWrapper>
  );
}

export default React.memo(React.forwardRef(Input));
