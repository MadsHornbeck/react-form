import React from "react";
import { useMaskedInput } from "@hornbeck/react-form";

function Mask() {
  const maskedInput = useMaskedInput({
    mask: "+1 (000) 000-0000",
  });

  return (
    <div>
      <input {...maskedInput} />
    </div>
  );
}

export default Mask;
