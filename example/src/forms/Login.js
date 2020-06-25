import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";

function Login() {
  const username = useInput();
  const password = useInput();

  const form = useForm({
    inputs: { username, password },
    handleSubmit: console.log,
  });

  return (
    <form onSubmit={form.onSubmit}>
      <input {...username} />
      <input {...password} type="password" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default React.memo(Login);
