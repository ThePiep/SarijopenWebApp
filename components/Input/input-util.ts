import { isNil, isUndefined } from "lodash";
import {
  AnyObjectSchema,
  ArraySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  ObjectSchema,
  Schema,
  StringSchema,
  TupleSchema,
  reach,
} from "yup";

// This function replaces the default error message with a more user-friendly one.
// It does this by replacing name with label in message
export function prettifyErrorMessage(
  message: string | undefined,
  name: string,
  label: string | undefined
) {
  return message ? (label ? message.replace(name, label) : message) : undefined;
}

export type CustomTransformer<Target> = {
  input: (value: Target | undefined) => string;
  output: (value: string) => Target | undefined;
};

export const stringTransformer: CustomTransformer<string> = {
  input: (value) => {
    return value ?? "";
  },
  output: (value) => {
    return value.length ? value : undefined;
  },
};

export const intTransformer: CustomTransformer<number> = {
  input: (value: number | undefined) => {
    return isUndefined(value) || isNaN(value) ? "" : value.toString();
  },
  output: (value: string) => {
    const output = parseInt(value);
    return isNaN(output) ? undefined : output;
  },
};

export const isRequired = (schema: Schema, name: string) => {
  const field = reach(schema, name).resolve({});
  if (!field) {
    console.warn(`Could not find field ${name} in yup schema`);
    return false;
  }
  if (
    field instanceof StringSchema ||
    field instanceof NumberSchema ||
    field instanceof BooleanSchema ||
    field instanceof DateSchema ||
    field instanceof ArraySchema ||
    field instanceof TupleSchema
  ) {
    return !field.describe().optional;
  }
  return false;
};

// export const floatTransformer: CustomTransformer<number> = {
//   input: (value: number) => {
//     return value ? value.toString() : "";
//   },
//   output: (value: string) => {
//     return value ? parseFloat(value) : null;
//   },
// };

// export const booleanTransformer: CustomTransformer<boolean> = {
//   input: (value: boolean) => {
//     return value ? "true" : "false";
//   },
//   output: (value: string) => {
//     return value === "true";
//   },
// };

// export const dateTransformer: CustomTransformer<Date> = {
//   input: (value: Date) => {
//     return value ? value.toISOString() : "";
//   },
//   output: (value: string) => {
//     return value ? new Date(value) : null;
//   },
// };
