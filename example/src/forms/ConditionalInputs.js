import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";

import { Input } from "../inputComponents";

function useConditionalInputs(toggle) {
  const firstName = useInput();
  const lastName = useInput();
  const email = useInput();
  const password = useInput();

  const inputs = React.useMemo(
    () => ({
      ...(toggle && { firstName, lastName }),
      email,
      password,
    }),
    [email, firstName, lastName, password, toggle]
  );

  return useForm({ inputs, handleSubmit: console.log });
}

function ConditionalInputs() {
  const toggle = useInput();

  const form = useConditionalInputs(toggle.value);

  return (
    <form onSubmit={form.onSubmit}>
      <Input {...toggle} type="checkbox" label="Toggle" />
      {Object.entries(form.inputs).map(([name, input]) => (
        <Input
          key={name}
          label={name}
          {...input}
          type={name === "password" ? "password" : "text"}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default ConditionalInputs;
