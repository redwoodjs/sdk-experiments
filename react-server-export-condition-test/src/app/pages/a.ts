import { checkImportB } from "./b";

export const checkImportA = (origin: string) => {
  checkImportB(origin);
};
