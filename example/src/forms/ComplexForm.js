import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

import Input from "../Input";
import { wait } from "../util";

function ComplexForm() {
  const name = useInput({
    validate: isRequired,
    defaultValue: "John Doe",
  });
  const email = useInput({
    validate: emailValidate,
    defaultValue: "john.doe@example.com",
  });
  const phone = useInput({
    format: phoneFormat,
    parse: phoneParse,
  });
  const sex = useInput();
  const favoriteColor = useInput({ defaultValue: [] });
  const profilePicture = useInput({ validate: isRequired });
  const age = useInput({
    defaultValue: 20,
    validate: isRequired,
    normalize: Number,
  });
  const canBuyAlcohol = useInput();

  const form = useForm({
    inputs: {
      age,
      canBuyAlcohol,
      email,
      favoriteColor,
      name,
      phone,
      sex,
      profilePicture,
    },
    handleSubmit: console.log,
    validate,
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
      <Input {...phone} label="Phone" type="tel" />
      <Input {...sex} label="Sex" type="radio" options={sexOptions} />
      <Input
        {...favoriteColor}
        label="Favorite Color"
        type="select"
        options={colors}
        multiple
      />
      <Input {...age} label="Age" type="number" />
      <Input
        {...canBuyAlcohol}
        type="checkbox"
        label="Can buy alcohol"
        disabled={isUnderage}
      />
      <Input {...profilePicture} type="file" label="Profile picture" multiple />
      <button type="submit" disabled={!form.canSubmit}>
        {form.isSubmitting ? "Is submitting" : "Submit"}
      </button>
    </form>
  );
}

export default ComplexForm;

const sexOptions = [
  { label: "Female", value: "Female" },
  { label: "Male", value: "Male" },
  { label: "Other", value: "Other" },
];

const isRequired = validators.required("Required");

const validate = validators.schema({
  name: (v) => (v === "Paul" ? "Cannot be Paul" : undefined),
  email: (v) => wait(/\.com/.test(v) ? undefined : "Must be a .com domain"),
});

const phoneFormat = (v) => {
  const local = v.slice(0, 3).padEnd(3, "_");
  const first = v.slice(3, 6).padEnd(3, "_");
  const last = v.slice(6, 10).padEnd(4, "_");
  return `+1 (${local}) ${first}-${last}`;
};
const phoneParse = (v) => v.match(/\d{1,10}/)?.[0] || "";

const emailValidate = [isRequired, validators.email("Must be a valid email")];

const colors = [
  { label: "Red", value: "Red" },
  { label: "Blue", value: "Blue" },
  { label: "Green", value: "Green" },
];
