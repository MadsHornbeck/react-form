import React from "react";
import { useInput, useForm } from "@hornbeck/react-form"

function SimpleForm() {
  const firstName = useInput();
  const lastName = useInput();
  const email = useInput();
  const phone = useInput();
  const sex = useInput();

  const inputs = React.useMemo(() => ({
    firstName,
    lastName,
    email,
    phone,
    sex,
  }), [])

  return <form>

  </form>
}

export default SimpleForm;
