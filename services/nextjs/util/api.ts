import { ParameterValue } from "../types/api";

export const parseIntQuery = (val: ParameterValue) =>
  typeof val !== "string" ? null : parseInt(val);
