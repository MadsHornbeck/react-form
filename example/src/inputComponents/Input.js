import React from "react";

function Input({ type, meta, ...input }) {
  return (
    <div>
      <label>
        <div>
          <input type={type} {...input} checked={input.value} />
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
