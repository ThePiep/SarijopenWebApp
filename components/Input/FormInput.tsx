import React from "react";
import {
  CustomTransformer,
  intTransformer,
  stringTransformer,
} from "./input-util";
import { SuperController, SuperControllerProps } from "./SuperController";

type InputType = "text" | "number";

interface Props extends Omit<SuperControllerProps, "render"> {
  type?: InputType;
}

const typeMap: Record<
  InputType,
  { transformer: CustomTransformer<any>; defaultValue: any }
> = {
  text: { transformer: stringTransformer, defaultValue: undefined },
  number: { transformer: intTransformer, defaultValue: undefined },
};

export const FormInput = ({ type = "text", ...rest }: Props) => {
  const { transformer, defaultValue } = typeMap[type];

  return (
    <SuperController
      defaultValue={defaultValue}
      render={(x) => (
        <input
          className="input input-bordered"
          onBlur={x.field.onBlur}
          onChange={(e) => {
            x.field.onChange(transformer.output(e.target.value));
          }}
          value={transformer.input(x.field.value)}
        />
      )}
      {...rest}
    />
  );
};
