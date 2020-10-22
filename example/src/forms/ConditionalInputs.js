import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";

import Input from "../Input";

function useConditionalInputs(toggle) {
  const firstName = useInput();
  const lastName = useInput();
  const email = useInput();
  const password = useInput();

  const form = useForm({ handleSubmit: console.log });

  React.useEffect(() => {
    form.setInputs({
      ...(toggle && { firstName, lastName }),
      email,
      password,
    });
  }, [email, firstName, form, lastName, password, toggle]);

  return form;
}

function ConditionalInputs() {
  const toggle = useInput();

  const form = useConditionalInputs(toggle.value);

  return (
    <form onSubmit={form.onSubmit}>
      <Input {...toggle} type="checkbox" label="Toggle" />
      {[...form.inputs.entries()].map(([name, input]) => (
        <Input
          key={name}
          label={name}
          type={name === "password" ? "password" : "text"}
          {...input}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default ConditionalInputs;
