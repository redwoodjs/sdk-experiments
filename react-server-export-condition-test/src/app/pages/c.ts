import * as swr from "swr";

export const checkImport = (origin: string) => {
  console.log(
    "########## import result keys: %s, default: %s, origin: %s",
    Object.keys(swr),
    swr.default,
    origin
  );
};
