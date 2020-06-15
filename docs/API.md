# API

- `useInput`
- `useForm`

## `useInput`

### Parameters

Basic

- initialValue
- validate
- format

Events

- handleBlur
- handleChange
- handleFocus

Advanced

- handleCursor
- parse
- normalize

### return

input

- input props
- meta
  - active,
  - actualValue,
  - error,
  - setActive,
  - setError,
  - setTouched,
  - setValue,
  - touched,

## `useForm`

### Parameters

Basic

- inputs
- handleSubmit
- initialValues
- validate

Events

- postSubmit
- preSubmit

Advanced

- handlers

### return

- inputs
- isSubmitting
- onSubmit
- setValues
