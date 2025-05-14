import * as swr from "swr";

export const checkImport = (origin: string) => {
  const gotCorrectImport =
    origin === "SERVER" ? swr.default === undefined : swr.default !== undefined;

  if (gotCorrectImport) {
    console.log(
      `########## ${origin} GOT CORRECT IMPORT!!!\n- keys: ${Object.keys(
        swr
      )}\n- default: ${swr.default}`
    );
  } else {
    console.log(
      `########## ${origin} GOT INCORRECT IMPORT\n- keys: ${Object.keys(
        swr
      )}\n- default: ${swr.default}`
    );
  }
};
