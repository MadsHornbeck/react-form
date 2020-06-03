import React from "react";

function Input({ options, meta, ...input }) {
  const name = React.useRef(Math.random());
  return (
    <div>
      <label>
        <div>
          {options.map(v => (
            <label>
              <input
                type="radio"
                name={name.current}
                {...input}
                key={v}
                value={v}
                checked={input.value === v}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          {meta.active && <div>Active</div>}
          {meta.touched && <div>Touched</div>}
          {meta.error && <div>{meta.error}</div>}
        </div>
      </label>
    </div>
  );
}

export default React.memo(Input);
