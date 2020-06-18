# Setup

`npm install --save @hornbeck/react-form`

## `useInput`

```js
import { useInput } from "@hornbeck/react-form";

function App() {
  const name = useInput();

  return (
    <div>
      <input {...name} />
    </div>
  );
}
```

## `useForm`

```js
import { useForm, useInput, validators } from "@hornbeck/react-form";

function Form() {
  const name = useInput({
    validate: validators.required("Required"),
  });
  const email = useInput({
    validate: [
      validators.required("Required"),
      validators.email("Must be a valid email")
    ],
  });
  const phone = useInput();

  const inputs = React.useMemo(
    () => ({
      name,
      email,
      phone,
    }),
    [name, email, phone]
  );

  const form = useForm({
    inputs,
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
