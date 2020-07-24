import React from "react";
import { useForm, useInput } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

import { Input } from "../inputComponents";

const validate = [
  validators.required("Required"),
  validators.minLength(3, "Must be at least 3 characters"),
];

// TODO: consider making a hook for handling this scenario.
function DynamicInputs() {
  const [inputArr, setInputArr] = React.useState([]);
  const [inputs, setInputs] = React.useState({});

  const addInput = React.useCallback((name, input) => {
    setInputs((inputs) => ({ ...inputs, [name]: input }));
    return () => {
      // eslint-disable-next-line no-unused-vars
      setInputs(({ [name]: _, ...inputs }) => inputs);
    };
  }, []);

  const form = useForm({
    inputs,
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

const Dynamic = React.memo(({ name, addInput }) => {
  const input = useInput({ validate });
  React.useEffect(() => addInput(name, input), [addInput, input, name]);
  return <Input {...input} label={name} />;
});
