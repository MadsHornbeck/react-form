# API

- `useInput`
- `useForm`

## `useInput`

### Parameters

Basic

- initialValue - the value the input will initially have
- validate - a function or array of functions that validate the input
- format - will format the value and display it when the input is not active
- parse - values are parsed then normalized before set in input state
- normalize - TODO: describe difference between parse and normalize

Events

- handleBlur - is called whenever the input is blurred
- handleChange - is called whenever the input is changed
- handleFocus - is called whenever the input is focused

Advanced

- handleCursor

### return

input

- input props
  - value - the value of the input
- meta
  - error - the error as returned from the validate function
  - active - true when the input has focus
  - touched - whenever an input is blurred touched is set to true
  - visited - true if input has ever had focus
  - dirty - true if value is the same as initialValue
  - pristine - opposite of dirty
  - valid - true if error is falsy
  - invalid - opposite of valid
  - actualValue - the value as it's stored, different from the value property only when format is being used.
  - setError - allows for the setting of the input error
  - setTouched - allows for the setting the input as touched
  - setValue - allows for the setting of the input value

## `useForm`

### Parameters

Basic

- inputs
- handleSubmit - is called with values from all inputs when form is submitted
- initialValues
- validate - a function or validate the inputs, should return an object with `{ [inputName]: error }`

Events

- preSubmit
- postSubmit

Advanced

- handlers - allows for defining inter-input relationships

### return

- inputs - inputs as passed as props
- isSubmitting - is true when submit is called and not finished in case of async submit
- onSubmit - should be passed to form. Alternatively can be called seperately
- setValues - allows for setting of all values in form

## validators

Validation functions

```js
// Example of use: required(error message)

const validate = required("Required");
// OR
const validate = [
  required("Required"),
  maxLength(80, "Cannot exceed 80 characters"),
];
```

- required
- maxLength
- minLength
- max
- min
- pattern
- positive
- negative
- greater

- validateFn - a helper for creating your own validation functions
- creditCard - validate the format of credit card number. (disclaimer: this only verifies that a credit card number matches the format, it does _not_ validate or verify the creditcard is actually valid)
- guid
- email
