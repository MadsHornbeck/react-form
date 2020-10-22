import React from "react";
import { useForm, useInput } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

import Input from "../Input";

// TODO: consider making a hook for handling this scenario.
function DynamicInputs() {
  const form = useForm({ handleSubmit: console.log });

  return (
    <div>
      <button
        onClick={() => {
          const i = form.inputs.size / 2;
          form.inputs
            .set(`friends[${i}].firstName`)
            .set(`friends[${i}].lastName`);
        }}
      >
        Add input
      </button>
      <button onClick={form.inputs.clear}>Remove all inputs</button>
      <form onSubmit={form.onSubmit}>
        {[...form.inputs.keys()].map((name) => (
          <Dynamic key={name} name={name} addInput={form.addInput} />
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default React.memo(DynamicInputs);

const Dynamic = React.memo(({ name, addInput }) => {
  const input = useInput({ validate });
  React.useEffect(() => addInput(name, input), [addInput, input, name]);
  return <Input {...input} label={name} />;
});

const validate = [
  validators.required("Required"),
  validators.minLength(3, "Must be at least 3 characters"),
];
