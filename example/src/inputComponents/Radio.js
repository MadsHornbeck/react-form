import React from "react";

function Input({ options, meta, label, ...input }, ref) {
  const name = React.useRef(Math.random());
  return (
    <div className="input">
      <label className="radio">
        {label}:
        <div>
          {options.map((v) => (
            <label key={v}>
              <input
                type="radio"
                name={name.current}
                {...input}
                value={v}
                checked={input.value === v}
              />
              {v}
            </label>
          ))}
        </div>
      </label>
      <div className="meta">
        {meta.touched && meta.error && <div>{meta.error}</div>}
      </div>
    </div>
  );
}

export default React.memo(React.forwardRef(Input));
