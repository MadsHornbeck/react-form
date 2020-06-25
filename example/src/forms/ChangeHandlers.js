import React from "react";
import { useInput, useForm } from "@hornbeck/react-form";

import { Radio, Input } from "../inputComponents";

const colors = ["Red", "Green", "Blue"];

// TODO: maybe handle issue of feedback loop of changes if changes are triggers with specific timing.
const handlers = {
  color: ({ triplet, color }) => {
    switch (color.value) {
      case "Red":
        triplet.meta.setValue("Huey");
        break;
      case "Blue":
        triplet.meta.setValue("Dewey");
        break;
      case "Green":
        triplet.meta.setValue("Louie");
        break;
    }
  },
};

function ChangeHandlers() {
  const color = useInput();
  const triplet = useInput();

  const inputs = React.useMemo(() => ({ color, triplet }), [color, triplet]);
  const form = useForm({ inputs, handlers });

  return (
    <form onSubmit={form.onSubmit}>
      <Radio label="Color" {...color} options={colors} />
      <Input label="Triplet" {...triplet} disabled />
    </form>
  );
}

export default React.memo(ChangeHandlers);
