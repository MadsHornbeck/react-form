# Setup

`npm install --save @hornbeck/react-form`

## `useInput`

```js
import { useInput } from "@hornbeck/react-form";

function App() {
  const name = useInput();

  return <input {...name} />;
}
```

## `useForm`

```js
import { useForm, useInput, validators } from "@hornbeck/react-form";

const nameValidation = validators.required("Required");
const emailValidation = [
  validators.required("Required"),
  validators.email("Must be a valid email")
];

function Form() {
  const name = useInput({ validate: nameValidation });
  const email = useInput({ validate: emailValidation });
  const phone = useInput();

  const form = useForm({
    inputs: {
      name,
      email,
      phone,
    },
    handleSubmit: console.log
  });

  return <div>
    <form onSubmit={form.onSubmit}>
      <input {...name} />
      <input {...email} />
      <input {...phone} />
      <button type="submit">Submit</button>
    </form>
}
```
