import React from "react";

function InputWrapper({ meta, label, children, ...input }, ref) {
  return (
    <div
      className={[
        "input",
        meta.active && "active",
        meta.dirty && "dirty",
        meta.error && "error",
        meta.touched && "touched",
        meta.visited && "visited",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label>
        {label}:{React.cloneElement(children, { ref, ...input })}
      </label>
      <div className="meta">{meta.error}</div>
    </div>
  );
}

export default React.memo(React.forwardRef(InputWrapper));
