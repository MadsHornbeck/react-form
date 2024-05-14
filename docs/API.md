# API

- `useInput`
- `useForm`

All props designated with `(lazy)` are only evaluated when accessed.

## `useInput`

### Parameters

Basic

- defaultValue - The value the input will initially have. Updating this will not
  update the value of the field, to achieve this use the `meta.setValue` on the
  input object.
- validate - `(value) => error | void` - A function or array of functions that
  validate the input.
  - Use `@hornbeck/validators` for a simple way of handling this.
- format - `(value) => string` - Will format the value and display it when the
  input is not active.
- parse - `(value, prevValue) => newValue` - Values are parsed before they are
  set in input state.
- normalize - `(value) => value` - Run on blur and allows you to normalize the
  value e.g. convert a number input to number instead of string.
- delay (default: 200) - The delay between the last user input and when the
  input level validation is run in ms.
- addToFrom - `{ form, name }` - pass in form and name of input, used to
  dynamically add inputs to forms. When useInput hook unmounts it's removed from
  the form if added to a form this way.

Events

- handleBlur - Is called whenever the input is blurred
- handleChange - Is called whenever the input is changed
- handleFocus - Is called whenever the input is focused

### return

input - The object returned from this hook will have stable referential identity.

- input props
  - value - The value of the input.
  - onBlur
  - onChange
  - onFocus
- meta
  - active - `true` when the input has focus.
  - actualValue - The value as it's stored, different from the value property
    only when `format` is being used and `meta.active` is `false`.
  - dirty - `true` if value is the same as `defaultValue`.
  - error (lazy) - Error for the input, either from input, form, or submit validation.
  - form - Reference to the form object the input is used in.
  - inputError (lazy) - The input level error.
  - invalid (lazy) - Inverse of valid.
  - pristine - Inverse of dirty.
  - setTouched - Allows for the setting the input as touched.
  - setValue - Allows for the setting of the input value.
  - touched - Whenever an input is blurred `touched` is set to `true`.
  - valid (lazy) - `true` if error is falsy.
  - validating (lazy) - `true` if the input is currently doing async validation.
  - visited - `true` if input has ever had focus.

## `useForm`

### Parameters

Basic

- inputs - Object with all the inputs in your form, use the names you want for
  your values.
- handleSubmit - Is called with values from all inputs when form is submitted.
- defaultValues - Object of values that will be the initial values, this will
  overwrite any value set on the individual inputs.
- validate - A function or validate the inputs, should return an object with
  `{ [inputName]: error }`.
  - Use `@hornbeck/validators` `schema` for a simple way of doing this.

### return

form - The object returned from this hook will have stable referential identity.

- canSubmit (lazy) - `!isSubmitting && valid`.
- changed (lazy) - `{[inputName]: input}` - An object with all inputs that have changed.
  - When using changed in a `useEffect` it's recommended to use `form.changed`
    in the dependency array to ensure it always triggers correctly.
- errors (lazy) - `{[inputName]: error}` - Object containing errors for all
  fields with the following priority: `input > form > submit`.
  - inputErrors (lazy) - Object containing all input level errors.
  - formErrors (lazy) - Object containing all form level errors.
  - submitErrors - Object containing all submit level errors.
- inputs - `Map<name, input>` - If input is a nested input, the name will be
  something like: `"friends[0].name"`.
  Use `form.inputs.entries()` to get the inputs as an iterator.
- invalid (lazy) - Inverse of valid.
- isSubmitting - `true` when submit is called and has not finished.
- onSubmit - `(event | void) => Promise` - Should be passed to form.
  Alternatively can be called programmatically.
- setInputs - `(inputs: object) => void` - sets the inputs of the form to the passed object.
- setValues - `(values: object) => void` - Allows for setting of values in the form.
- valid (lazy) - `true` if there are no errors.
- validate - The function / object passed in as `validate`.
- validating (lazy) - `true` if the form is currently doing async validation.
- values (lazy) - All the values of the inputs in the form in the shape of the
  inputs passed to `useForm`.
