import React from "react";

function Input({ options, meta, ...input }) {
  return (
    <div>
      <label>
        <div>
          <select {...input}>
            <option disabled></option>
            {options.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
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
