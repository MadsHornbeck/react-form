import { maskSymbol } from "./util";
import useInput from "./useInput";
import useMask from "./useMask";

export default function useMaskedInput({
  mask: maskString,
  maskPlaceholder,
  ...props
}) {
  const mask = useMask(maskString, maskPlaceholder);
  return useInput({ ...props, [maskSymbol]: mask });
}
