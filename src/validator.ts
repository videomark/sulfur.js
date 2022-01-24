import Ajv from "ajv";
import { SulfurData } from "../types";
import schema from "../schema.json";

export function validate(data: SulfurData): void {
  const ajv = new Ajv();
  const validate = ajv.compile(schema.definitions.SulfurData);
  const result = validate(data);
  if (!result) {
    let message;
    if (validate.errors) {
      [{ message }] = validate.errors;
    }
    throw new Error(message);
  }
}
