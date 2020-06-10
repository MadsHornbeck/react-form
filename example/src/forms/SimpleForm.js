import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";

import { Input, Radio } from "../inputComponents";
import { wait, genId } from "../util";

const sexOptions = ["Female", "Male", "Other"];

const isRequired = (v) => wait(!v ? "Required" : undefined, 2000);
// const isRequired = (v) => undefined;
const isEmail = (v) =>
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Must be a valid email" : undefined;

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
  const l = v.length;
  const a = l <= 3 ? 4 : l <= 6 ? 6 : 7;
  return a + l;
};

const handlers = {
  age: ({ age, canBuyAlcohol }) => {
    if (age.value < 18) {
      canBuyAlcohol.meta.setValue(false);
    }
  },
};

const handleSubmit = () =>
  wait({ name: genId(), sex: genId(), email: genId() });

function SimpleForm() {
  const name = useInput({
    validate: isRequired,
    initialValue: "John Doe",
  });
  const email = useInput({
    validate: isEmail,
    initialValue: "john.doe@example.com",
  });
  const phone = useInput({
    format: phoneFormat,
    parse: phoneParse,
    handleCursor,
  });
  const sex = useInput();
  const age = useInput({ initialValue: 20 });
  const canBuyAlcohol = useInput({ initialValue: false });

  const inputs = React.useMemo(
    () => ({ age, canBuyAlcohol, email, name, phone, sex }),
    [age, canBuyAlcohol, email, name, phone, sex]
  );

  const form = useForm({
    inputs,
    handleSubmit,
    validate: handleSubmit,
    handlers,
  });

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
        disabled={age.value < 18}
      />
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Is submitting" : "Submit"}
      </button>
    </form>
  );
}

export default SimpleForm;
