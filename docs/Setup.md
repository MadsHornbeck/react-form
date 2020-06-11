# Setup

`npm install --save @hornbeck/react-form`

## `useInput`

```js
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
function Form() {
  const name = useInput();
  const email = useInput();
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
      <input {...name}>
      <input {...email}>
      <input {...phone}>
      <button type="submit">Submit</button>
    </form>
}
```
