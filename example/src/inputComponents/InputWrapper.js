import React from "react";

function InputWrapper({ meta, label, children }) {
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
        {label}: {children}
      </label>
      <div className="meta">{meta.error}</div>
    </div>
  );
}

export default React.memo(InputWrapper);
