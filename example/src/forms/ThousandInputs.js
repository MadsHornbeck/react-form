import React from "react";

import { useInput, useForm } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

const validate = [
  validators.required("Required"),
  validators.email("Invalid email"),
];

function ThousandInputs() {
  // Warning! Don't actually do this, it's only to test performance.
  const inputArr = Array.from({ length: 1000 }, (_, i) => [
    `input-${i}`,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInput({ validate }),
  ]);

  const form = useForm({
    inputs: Object.fromEntries(inputArr),
    handleSubmit: console.log,
  });
  return (
    <form onSubmit={form.onSubmit}>
      <button type="submit">Submit</button>
      <div>
        {inputArr.map(([name, input]) => (
          <input key={name} {...input} />
        ))}
      </div>
    </form>
  );
}

export default ThousandInputs;
