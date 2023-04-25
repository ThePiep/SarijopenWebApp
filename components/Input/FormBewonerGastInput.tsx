import React from "react";
import { SelectOption } from "./FormSelect";
import { SuperController, SuperControllerProps } from "./SuperController";
import { stringTransformer } from "./input-util";
import { ControllerProps, ControllerRenderProps } from "react-hook-form";

export interface FormBewonerGastInputProps
  extends Omit<SuperControllerProps, "render" | "name"> {
  bewonerFormName: string;
  gastFormName: string;
  allowEmpty?: boolean;
  options: SelectOption[];
}

export const FormBewonerGastInput = ({
  bewonerFormName,
  gastFormName,
  allowEmpty = false,
  options,
  ...rest
}: FormBewonerGastInputProps) => {
  const [isGast, setIsGast] = React.useState(false);

  const handleCheckboxClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    setIsGast((prev) => !prev);
  };

  const renderCheckbox = (
    <input
      type="checkbox"
      className="checkbox checkbox-xs ml-2"
      readOnly
      checked={isGast}
    ></input>
  );

  return (
    <>
      {isGast ? (
        <SuperController
          key={gastFormName}
          name={gastFormName}
          render={(x) => (
            <label className="input-group flex">
              <input
                className="input input-bordered grow"
                onBlur={x.field.onBlur}
                onChange={(e) => {
                  x.field.onChange(stringTransformer.output(e.target.value));
                }}
                value={stringTransformer.input(x.field.value)}
              />
              <span
                onClick={(e) => {
                  handleCheckboxClick(e);
                  x.field.onChange(undefined);
                }}
              >
                Gast
                {renderCheckbox}
              </span>
            </label>
          )}
          {...rest}
        />
      ) : (
        <SuperController
          key={bewonerFormName}
          name={bewonerFormName}
          render={(x) => (
            <label className="input-group flex">
              <select
                className="select select-bordered grow"
                onBlur={x.field.onBlur}
                onChange={(e) => x.field.onChange(e.target.value)}
                value={x.field.value ?? -1}
              >
                <option disabled={!allowEmpty} value={-1}></option>
                {options.map((o, i) => (
                  <option key={i} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span
                onClick={(e) => {
                  handleCheckboxClick(e);
                  x.field.onChange(undefined);
                }}
              >
                Gast
                {renderCheckbox}
              </span>
            </label>
          )}
          {...rest}
        />
      )}
    </>
  );
};
