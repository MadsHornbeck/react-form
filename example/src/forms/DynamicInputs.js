import React from "react";
import { useForm, useInput } from "@hornbeck/react-form";
import * as validators from "@hornbeck/validators";

import Input from "../Input";

function DynamicInputs() {
  const name = useInput({ validate: required });
  const [friendsCount, setFriendsCount] = React.useState(0);
  const form = useForm({ inputs: { name }, handleSubmit: console.log });

  return (
    <form onSubmit={form.onSubmit}>
      <Input label="Name" {...name} />
      <div>
        <span>Friends </span>
        <button type="button" onClick={() => setFriendsCount((f) => f + 1)}>
          Add friend
        </button>
        <button type="button" onClick={() => setFriendsCount(0)}>
          Remove all friends
        </button>
      </div>
      <ol>
        {Array.from({ length: friendsCount }).map((_, i) => (
          <li key={i}>
            <Friend prefix={`friends[${i}]`} inputs={form.inputs} />
          </li>
        ))}
      </ol>
      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicInputs;

function Friend({ prefix, inputs }) {
  const name = useInput({ validate: required });
  const age = useInput({ validate: required });
  React.useEffect(() => {
    inputs.set(`${prefix}.name`, name).set(`${prefix}.age`, age);
    return () => {
      inputs.delete(`${prefix}.name`);
      inputs.delete(`${prefix}.age`);
    };
  }, [age, inputs, name, prefix]);
  return (
    <>
      <Input {...name} label="Name" />
      <Input {...age} label="Age" />
    </>
  );
}

const required = validators.required("Required");
