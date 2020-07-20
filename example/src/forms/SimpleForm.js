import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";
import * as validators from "@hornbeck/react-form/validators";

import { Input, Radio } from "../inputComponents";
import { wait } from "../util";

const sexOptions = ["Female", "Male", "Other"];

const isRequired = validators.required("Required");

const phoneFormat = (v) => {
  const local = v.slice(0, 3).padEnd(3, "_");
  const first = v.slice(3, 6).padEnd(3, "_");
  const last = v.slice(6, 10).padEnd(4, "_");
  return `+1 (${local}) ${first}-${last}`;
};
const phoneParse = (v) =>
  v
    .match(/[+\d]+/g)
    ?.filter((s) => s !== "+1")
    .join("") || "";

const handleCursor = (v) => {
  const l = String(v).length;
  const a = l <= 3 ? 4 : l <= 6 ? 6 : 7;
  return a + l;
};

const emailValidate = [isRequired, validators.email("Must be a valid email")];

const handleSubmit = (values) =>
  wait({
    name: values.name === "Paul" ? "Cannot be Paul" : undefined,
    email: /\.com/.test(values.email) ? undefined : "Must be a .com domain",
  });

function SimpleForm() {
  const name = useInput({
    validate: isRequired,
    initialValue: "John Doe",
  });
  const email = useInput({
    validate: emailValidate,
    initialValue: "john.doe@example.com",
  });
  const phone = useInput({
    format: phoneFormat,
    parse: phoneParse,
    handleCursor,
  });
  const sex = useInput();
  const age = useInput({
    initialValue: 20,
    validate: isRequired,
    normalize: Number,
  });
  const canBuyAlcohol = useInput({ initialValue: true });

  const inputs = React.useMemo(
    () => ({ age, canBuyAlcohol, email, name, phone, sex }),
    [age, canBuyAlcohol, email, name, phone, sex]
  );

  const form = useForm({
    inputs,
    handleSubmit,
    validate: handleSubmit,
  });

  const isUnderage = age.value < 18;
  React.useEffect(() => {
    if (form.changed.age && isUnderage) {
      canBuyAlcohol.meta.setValue(false);
    }
  }, [canBuyAlcohol.meta, form.changed.age, isUnderage]);

  return (
    <form onSubmit={form.onSubmit}>
      <Input {...name} label="Name" />
      <Input {...email} label="Email" />
      <Input {...phone} label="Phone" />
      <Radio {...sex} label="Sex" options={sexOptions} />
      <Input {...age} label="Age" type="number" />
      <Input
        {...canBuyAlcohol}
        type="checkbox"
        label="Can buy alcohol"
        disabled={isUnderage}
      />
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Is submitting" : "Submit"}
      </button>
    </form>
  );
}

export default React.memo(SimpleForm);
