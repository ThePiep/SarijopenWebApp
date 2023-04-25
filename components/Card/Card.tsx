'use client';
import { IconType } from 'react-icons';

export interface CardProps {
  title: string;
  children?: React.ReactNode;
  // colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  colSpan?: keyof typeof spanMap;
  color?: keyof typeof colorMap;
  titleIcon?: JSX.Element;
}

enum colorMap {
  red = 'bg-red-100',
  orange = 'bg-orange-100',
  yellow = 'bg-yellow-100',
  green = 'bg-green-100',
  blue = 'bg-blue-100',
  purple = 'bg-purple-100',
  pink = 'bg-pink-100',
}

// enum spanMap {
//   'col-span-1' = 1,
//   'col-span-2' = 2
// }

const spanMap = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
};

export const Card = ({
  children,
  colSpan,
  color,
  title,
  titleIcon,
}: CardProps) => {
  const c = colorMap[color ?? 'red'];
  return (
    <div
      className={`card shadow-xl ${colorMap[color ?? 'red']} card-bordered ${
        spanMap[colSpan ?? 1]
      } h-44 overflow-hidden`}
    >
      <div className='card-body p-4'>
        <h2 className='card-title border-b-2 border-slate-600'>
          {title}
          <span className='mr-0 ml-auto'>{titleIcon} </span>
        </h2>
        {children}
      </div>
    </div>
  );
};
