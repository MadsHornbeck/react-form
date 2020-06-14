import React from "react";

function Input({ type, meta, label, ...input }, ref) {
  return (
    <div className="input">
      <label>
        {label}:
        <input
          ref={ref}
          type={type}
          {...input}
          checked={input.value}
          className={[
            meta.active && "active",
            meta.touched && "touched",
            meta.error && "error",
            meta.visited && "visited",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </label>
      <div className="meta">{meta.error}</div>
    </div>
  );
}

export default React.memo(React.forwardRef(Input));
