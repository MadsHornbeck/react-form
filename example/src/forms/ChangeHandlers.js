import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";

import { Radio, Input } from "../inputComponents";

const colors = ["Red", "Green", "Blue"];

function ChangeHandlers() {
  const color = useInput();
  const triplet = useInput();

  const inputs = React.useMemo(() => ({ color, triplet }), [color, triplet]);
  const form = useForm({ inputs });

  React.useEffect(() => {
    if (form.changed.color) {
      const name = {
        Red: "Huey",
        Blue: "Dewey",
        Green: "Louie",
      }[inputs.color.value];
      inputs.triplet.meta.setValue(name);
    }
  }, [form.changed.color, inputs.color.value, inputs.triplet.meta]);

  return (
    <form onSubmit={form.onSubmit}>
      <Radio label="Color" {...color} options={colors} />
      <Input label="Triplet" {...triplet} disabled />
    </form>
  );
}

export default React.memo(ChangeHandlers);
