import React from "react";
import { useForm, useInput } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

import { Input } from "../inputComponents";

const validate = [
  validators.required("Required"),
  validators.minLength(3, "Must be at least 3 characters"),
];

function DynamicInputs() {
  const [inputArr, setInputArr] = React.useState([]);
  const inputs = React.useRef({});

  const addInput = React.useCallback((name, input) => {
    inputs.current[name] = input;
    return () => delete inputs.current[name];
  }, []);

  const form = useForm({
    inputs: inputs.current,
    handleSubmit: console.log,
  });

  return (
    <div>
      <button
        onClick={() => setInputArr((is) => is.concat(`input-${is.length}`))}
      >
        Add input
      </button>
      <button onClick={() => setInputArr([])}>Remove all inputs</button>
      <form onSubmit={form.onSubmit}>
        {inputArr.map((name) => (
          <Dynamic key={name} name={name} addInput={addInput} />
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DynamicInputs;

function Dynamic({ name, addInput }) {
  const input = useInput({ validate });
  React.useEffect(() => addInput(name, input), [addInput, input, name]);
  return <Input {...input} label={name} />;
}
