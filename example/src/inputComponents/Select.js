import React from "react";

function Input({ options, meta, ...input }, ref) {
  return (
    <div className="input">
      <label>
        <div>
          <select {...input} ref={ref}>
            <option disabled></option>
            {options.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </label>
      <div>
        {meta.active && <div>Active</div>}
        {meta.touched && <div>Touched</div>}
        {meta.error && <div>{meta.error}</div>}
      </div>
    </div>
  );
}

export default React.memo(React.forwardRef(Input));
