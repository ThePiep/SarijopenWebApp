import React from 'react';
import { Controller, UseFormRegister, useFormContext } from 'react-hook-form';
import { prettifyErrorMessage, stringTransformer } from './input-util';
import { SuperController, SuperControllerProps } from './SuperController';

interface Props extends Omit<SuperControllerProps, 'render'> {
  resize?: boolean;
}

export const FormTextarea = ({ resize = false, ...rest }: Props) => {
  const transformer = stringTransformer;

  return (
    <SuperController
      render={(x) => (
        <textarea
          className={`textarea textarea-ghost ${resize ? '' : 'resize-none'}`}
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
