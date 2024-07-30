declare function useInput<T = string, E = string>(props?: UseInput<T, E>): Input<T, E>;

declare function useForm<T extends Inputs = Inputs>(props?: UseForm<T>): Form<T>;

export type UseInput<T, E> = {
  defaultValue?: T;
  validate?: ((value: T) => E | undefined |  Promise<E | undefined>)
    | ((value: T) => E | undefined |  Promise<E | undefined>)[];
  delay?: number;

  format?: (value: T) => T | string;
  normalize?: (value: T) => T;
  parse?: (value: T | string | ((pv: T) => T), prevValue: T) => T;

  addToForm?: { form?: Form, name?: string };

  handleBlur?: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  handleChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  handleFocus?: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
}

export type Input<T = string, E = string> = {
  value: T | string;
  name: string;
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  meta: Meta<T, E>;
}

export type Inputs = {
  [name: string]: Input<any, any> | Inputs;
}

export type Meta<T, E> = {
  active: boolean;
  touched: boolean;
  visited: boolean;
  dirty: boolean;
  pristine: boolean;
  valid: boolean; // lazy
  invalid: boolean; // lazy
  validating: boolean; // lazy

  actualValue: T;
  error?: E; // lazy
  inputError?: E; // lazy

  setValue: (value: T | string | ((pv: T) => T), changed: boolean) => void;
  setTouched: (isTouched: boolean) => void;

  form: { current?: Form };
}

export type UseForm<T extends Inputs = Inputs> = {
  inputs?: T;
  defaultValues?: Partial<FormValues<T>>;
  handleSubmit?: (values: FormValues<T>) =>
    Promise<FormErrors<T> | undefined> | FormErrors<T> | undefined | void;
  validate?: (values: FormValues<T>) =>
    Promise<FormErrors<T> | undefined> | FormErrors<T> | undefined;
}

export type Form<T extends Inputs = Inputs> = {
  inputs: Map<string, Input>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  values: FormValues<T>; // lazy
  changed: Partial<T>; // lazy

  canSubmit: boolean; // lazy
  isSubmitting: boolean; // lazy
  valid: boolean; // lazy
  invalid: boolean; // lazy
  validating: boolean; // lazy
  formValidating: boolean; // lazy

  errors: FormErrors<T>; // lazy
  inputErrors: FormErrors<T>; // lazy
  formErrors: FormErrors<T>; // lazy
  submitErrors: FormErrors<T>;

  setInputs: (inputs: T) => void;
  setValues: (values: Partial<FormValues<T>>) => void;
}

export type FormValues<T extends Inputs> = {
  [Name in keyof T]: T[Name] extends Inputs 
    ? FormValues<T[Name]> 
    : T[Name] extends Input
    ? T[Name]["meta"]["actualValue"]
    : never;
}

export type FormErrors<T extends Inputs> = {
  [Name in keyof T]: T[Name] extends Inputs 
    ? FormErrors<T[Name]> 
    : T[Name] extends Input
    ? T[Name]["meta"]["error"] | undefined
    : never;
}
