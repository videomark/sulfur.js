import Ajv from "ajv";
import schema from "../schema.json";

export function validate(data: SulfurData): void {
  const ajv = new Ajv();
  const validate = ajv.compile(schema.definitions.SulfurData);
  const result = validate(data);
  if (!result) throw new Error(validate.errors.toString());
}
