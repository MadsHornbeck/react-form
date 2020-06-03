import React from "react";

function MultipleSelect({ options, meta, ...input }) {
  return (
    <div>
      <label>
        <div>
          <select {...input} multiple size="4" onSelectCapture={console.log}>
            <option disabled></option>
            {options.map(v => (
              <option key={v} value={v}>
                {v} {input.value.includes(v) && "X"}
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

export default React.memo(MultipleSelect);
