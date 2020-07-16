import React from "react";

export default function useMask(maskString, placeholder = "_") {
  const mask = React.useMemo(() => createMask(maskString), [maskString]);

  const format = React.useCallback(
    (value) =>
      mask.reduce(
        ([s, v], r) => {
          if (typeof r === "string") {
            return [s + r, v];
          } else {
            const e = getStr(r, v, placeholder);
            return [s + e, v.slice(e.length)];
          }
        },
        ["", String(value)]
      )[0],
    [mask, placeholder]
  );

  const handleCursor = React.useCallback(
    (input, value) => {
      // TODO: handle delete of a static character
      const i = calcPosition(mask, String(value).length);
      input.setSelectionRange(i, i);
    },
    [mask]
  );

  const parse = React.useCallback(
    (value, prevValue) => {
      const prev = format(prevValue);
      const next = [...value];
      const changedIndex = next.findIndex((s, i) => s !== prev[i]);
      const [a, b] = split(next, changedIndex);
      const maskSliced = mask.slice(changedIndex - (next.length - prev.length));
      const nextValue = [
        ...a.filter((s, i) => s !== mask[i]),
        ...b.filter((s, i) => s !== maskSliced[i]),
      ]
        .filter((s) => s !== placeholder)
        .join("");
      const regex = RegExp(
        mask
          .filter((r) => r instanceof RegExp)
          .reduce((a, r) => a + r.source + "?", "")
      );
      return regex.exec(nextValue)[0];
    },
    [format, mask, placeholder]
  );

  return React.useMemo(() => ({ format, parse, handleCursor }), [
    format,
    handleCursor,
    parse,
  ]);
}

function createMask(maskString) {
  return typeof maskString === "string"
    ? stringToMask(maskString)
    : flattenStrings(maskString);
}
function stringToMask(maskString) {
  return [...maskString]
    .map((s, i, a) =>
      a[i - 1] === "\\"
        ? s
        : {
            "*": /[A-Za-z\d]/,
            "0": /\d/,
            a: /[A-Za-z]/,
          }[s] || s
    )
    .filter((s) => s !== "\\");
}
function flattenStrings(arr) {
  return arr.map((v) => (typeof v === "string" ? [...v] : v)).flat();
}

function getStr(rx, val, placeholder) {
  return (RegExp("^" + rx.source).exec(val) || [placeholder])[0];
}

function split(arr, i) {
  return [arr.slice(0, i), arr.slice(i)];
}

function calcPosition(mask, length = 0) {
  const b = mask.reduce(
    (a, m) => {
      const isString = typeof m === "string";
      const l = isString ? m.length : 1;
      const e = a[a.length - 1];
      if (isString === e[0]) {
        e[1] += l;
      } else {
        a.push([isString, l]);
      }
      return a;
    },
    [[typeof mask[0] === "string", 0]]
  );
  return b.reduce(
    ([a, l], [isString, r]) => [
      l > 0 && isString ? a + r : a,
      isString ? l : l - r,
    ],
    [length, length]
  )[0];
}

// TODO: handle cursor
// OLD PARSE function
// const _parse = (value, prev) => {
//   const pf = format(prev);
//   const henning = (() => {
//     const v = [...value];
//     const i = v.findIndex((s, i) => s !== pf[i]);
//     if (v.length > pf.length) {
//       if (v[i + 1] !== placeholder && v[i + 1] !== void 0) {
//         const j = v.slice(i).findIndex((s) => s === placeholder);
//         // TODO: fix issue with 13 then set cursor between and type 2.
//         v[j + i - 1] = v.splice(i, 1)[0];
//       }
//     } else {
//       if (~i) {
//         if (typeof m[i - 1] !== "string") {
//           q = i;
//         } else {
//           q =
//             i -
//             m
//               .slice(0, i)
//               .reverse()
//               .findIndex((r) => r instanceof RegExp);
//         }
//       }
//       v.splice(i, 0, placeholder);
//     }
//     console.log({ value, prev: pf, i, q, asdf: v.join("") });
//     return v.join("");
//   })();

//   _parse(value, prev);

//   // TODO: make this handling of replacing all of content more sophisticated, i.e. look at mask and compare
//   const p = henning.length < pf.length;

//   return m
//     .filter((r) => !p || r instanceof RegExp)
//     .reduce(
//       ([s, v], r) => [
//         typeof r === "string" && v.startsWith(r) ? s : s + getStr(r, v, ""),
//         v.slice(r.length || 1),
//       ],
//       ["", henning]
//     )[0];
// };
