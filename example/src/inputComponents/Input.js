import React from "react";

function Input({ type, meta, label, ...input }, ref) {
  return (
    <div className="input">
      <label>
        {label}:
        <input ref={ref} type={type} {...input} checked={input.value} />
      </label>
      <div className="meta">
        {meta.active && <div>Active</div>}
        {meta.touched && <div>Touched</div>}
        {meta.error && <div>{meta.error}</div>}
      </div>
    </div>
  );
}

export default React.memo(React.forwardRef(Input));
