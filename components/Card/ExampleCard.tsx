import { FaRegLightbulb } from 'react-icons/fa';
import { Card, CardProps } from './Card';

interface Props extends Omit<CardProps, 'children'> {
  text?: string;
}

export const ExampleCard = ({ text, ...props }: Props) => {
  return (
    <Card {...props} titleIcon={text ? <FaRegLightbulb /> : undefined}>
      <p className='text-ellipsis'>
        {text ?? 'If a dog chews shoes whose shoes does he choose?'}
      </p>
      <div className='card-actions justify-end'></div>
    </Card>
  );
};
