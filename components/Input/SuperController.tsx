import { Controller, ControllerProps, useFormContext } from "react-hook-form";
import { ObjectSchema, Schema, object } from "yup";
import { isRequired, prettifyErrorMessage } from "./input-util";

export interface SuperControllerProps extends Omit<ControllerProps, "control"> {
  schema?: Schema;
  label?: string;
  required?: boolean;
}

export const SuperController = ({
  label,
  name,
  schema,
  required = false,
  ...props
}: SuperControllerProps) => {
  const { control, formState, getFieldState } = useFormContext();
  const fieldState = getFieldState(name, formState);
  // const errorMessage = prettifyErrorMessage(
  //   fieldState.error?.message,
  //   name,
  //   label
  // );
  const errorMessage = fieldState.error?.message;
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{`${label}${
            required || (schema && isRequired(schema, name)) ? "*" : ""
          }`}</span>
        </label>
      )}
      <Controller name={name} control={control} {...props} />
      {errorMessage && (
        <label className="label">
          <span className="label-text-alt text-error">{errorMessage}</span>
        </label>
      )}
    </div>
  );
};
