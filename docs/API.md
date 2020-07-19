# API

- `useInput`
- `useForm`

## `useInput`

### Parameters

Basic

- initialValue - the value the input will initially have. Updating this will not update the value of the field, to achieve this use the `meta.setValue` on the input object.
- validate - a function or array of functions that validate the input
- format - will format the value and display it when the input is not active
- parse - values are parsed then normalized before set in input state
- normalize - run on blur and allows you to normalize the value e.g. convert it to all uppercase

Events

- handleBlur - is called whenever the input is blurred
- handleChange - is called whenever the input is changed
- handleFocus - is called whenever the input is focused

Advanced

- handleCursor

### return

input - the object returned from this hook will have stable referential identity.

- input props
  - value - the value of the input
- meta
  - error - error for the input, either from input, form, or submit validation
  - active - true when the input has focus
  - touched - whenever an input is blurred touched is set to true
  - visited - true if input has ever had focus
  - dirty - true if value is the same as initialValue
  - pristine - opposite of dirty
  - valid - true if error is falsy
  - validating - true if the input is currently doing async validation
  - invalid - opposite of valid
  - actualValue - the value as it's stored, different from the value property only when format is being used.
  - setError - allows for the setting of the input error
  - setTouched - allows for the setting the input as touched
  - setValue - allows for the setting of the input value
  - form - reference to the form object the input is used in
  - inputError - the input level error

## `useForm`

### Parameters

Basic

- inputs - object with all the inputs in your form, use the names you want for your values.
- handleSubmit - is called with values from all inputs when form is submitted
- initialValues - object of values that will be the initial values, this will overwrite any value set on the individual inputs
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
- errors - object containing all errors for all field as `{[inputName]: error}`
- formErrors - object containing all form level errors
- submitErrors - object containing all submit level errors
- validate - function that validates the form, returns true if the form has no errors otherwise false.

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
- smaller
- greater

- validateFn - a helper for creating your own validation functions
- creditCard - validate the format of credit card number. (disclaimer: this only verifies that a credit card number matches the format, it does _not_ validate or verify the creditcard is actually valid)
- guid
- email
