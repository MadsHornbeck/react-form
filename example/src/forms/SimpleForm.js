import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

import Input from "../Input";

function SimpleForm() {
  const firstName = useInput({ validate: required });
  const lastName = useInput();

  const form = useForm({
    inputs: { firstName, lastName },
    handleSubmit: console.log,
  });

  return (
    <form onSubmit={form.onSubmit}>
      <Input label="First name" {...firstName} />
      <Input label="Last name" {...lastName} />
      <button type="submit">Submit</button>
    </form>
  );
}

const required = validators.required("Required");

export default SimpleForm;
