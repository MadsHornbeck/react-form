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
  - actualValue - the value as it's stored, different from the value property only when format is being used and `meta.active` is false.
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
- delay - a number that specifies the delay between the last change to an input and when validation is run and `useForm.changed` is updated. - default: 200

### return

- inputs - inputs as passed as props
- isSubmitting - is true when submit is called and not finished in case of async submit
- onSubmit - should be passed to form. Alternatively can be called seperately
- setValues - allows for setting of all values in form
- errors - object containing all errors for all field as `{[inputName]: error}`
- setInputs - `(inputs: object) => void` sets the inputs of the form to the passed object
- setChanged - `(name: string) => void` sets the changed state for a specific input, this will trigger form validation and the `changed` object will be updated
- formErrors - object containing all form level errors
- submitErrors - object containing all submit level errors
- validate - function that validates the form, returns the errors from the validate function passed
- changed - an object with input names as keys and whether they've changed as a boolean value
