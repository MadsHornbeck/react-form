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
      }[color.value];
      triplet.meta.setValue(name);
    }
  }, [color.value, form.changed.color, triplet.meta]);

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
