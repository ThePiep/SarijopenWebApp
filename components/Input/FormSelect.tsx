import { SuperController, SuperControllerProps } from './SuperController';

export interface SelectOption {
  value: number;
  label: string;
}

interface Props extends Omit<SuperControllerProps, 'render'> {
  allowEmpty?: boolean;
  options: SelectOption[];
}

export const FormSelect = ({ options, allowEmpty = false, ...rest }: Props) => {
  return (
    <SuperController
      render={(x) => (
        <select
          className='select  select-ghost'
          onBlur={x.field.onBlur}
          value={x.field.value ?? -1}
        >
          <option
            disabled={!allowEmpty}
            onClick={() => x.field.onChange(undefined)}
            value={-1}
          ></option>
          {options.map((o, i) => (
            <option
              key={i}
              value={o.value}
              onClick={() => x.field.onChange(o.value)}
            >
              {o.label}
            </option>
          ))}
        </select>
      )}
      {...rest}
    />
  );
};
