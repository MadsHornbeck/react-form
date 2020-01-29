import React from "react";

export default function({ meta, ...input }) {
  return (
    <div>
      <label>
        <div>
          <input {...input} />
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
