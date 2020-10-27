import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";

import Input from "../Input";

function ChangeHandlers() {
  const color = useInput();
  const triplet = useInput();

  const form = useForm({ inputs: { color, triplet }, delay: 100 });

  React.useEffect(() => {
    if (form.changed.color) {
      const name = {
        Red: "Huey",
        Blue: "Dewey",
        Green: "Louie",
      }[form.changed.color.value];
      triplet.meta.setValue(name);
    }
  }, [form.changed, triplet.meta]);
  // Warning! If you just use the eslint autofix you will get this:
  // `[form.changed.color, triplet.meta]` which wont work.
  // You need to include `form.changed` as otherwise it wont
  // be able to detect successive changes to the same input.

  return (
    <form onSubmit={form.onSubmit}>
      <Input label="Color" type="radio" {...color} options={colors} />
      <Input label="Triplet" {...triplet} />
    </form>
  );
}

export default ChangeHandlers;

const colors = [
  { label: "Red", value: "Red" },
  { label: "Blue", value: "Blue" },
  { label: "Green", value: "Green" },
];
