import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

function Example() {
  const username = useInput({
    validate: (value) => (value === "admin" ? "Nice try!" : undefined),
  });
  const email = useInput({
    initialValue: [],
    validate: [
      validators.required("Required"),
      validators.email("Invalid email address"),
    ],
  });

  const inputs = React.useMemo(() => ({ username, email }), [email, username]);

  const form = useForm({
    inputs,
    handleSubmit: console.log,
  });

  return (
    <form onSubmit={form.onSubmit}>
      <input {...username} />
      {username.meta.touched && username.meta.error}
      <input {...email} />
      {email.meta.touched && email.meta.error}

      <button type="submit">Submit</button>
    </form>
  );
}

export default React.memo(Example);
