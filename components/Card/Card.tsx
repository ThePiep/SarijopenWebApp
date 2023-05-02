'use client';
import { IconType } from 'react-icons';

export interface CardProps {
  title: string;
  children?: React.ReactNode;
  colSpan?: keyof typeof spanMap;
  colSpanMd?: keyof typeof spanMap;
  colSpanXl?: keyof typeof spanMap;
  color?: keyof typeof colorMap;
  titleIcon?: JSX.Element;
}

enum colorMap {
  red = 'bg-pocean-50',
  orange = 'bg-porange-100',
  yellow = 'bg-pgreen-100',
  green = 'bg-pgreen-100',
  blue = 'bg-pblue-100',
  purple = 'bg-pocean-50',
  pink = 'bg-pblue-100',
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
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  // 12: 'col-span-12',
  12: 'col-span-full',
};

export const Card = ({
  children,
  colSpan,
  colSpanMd,
  colSpanXl,
  color,
  title,
  titleIcon,
}: CardProps) => {
  const c = colorMap[color ?? 'red'];
  return (
    <div
      className={`card rounded-md border-gray-500 border-2 border-b-5 border-r-5 
      h-44 overflow-hidden
      ${colorMap[color ?? 'red']}
      ${spanMap[colSpan ?? 1]} 
      ${colSpanMd ? `md:${spanMap[colSpanMd]}` : ''}
      ${colSpanXl ? `xl:${spanMap[colSpanXl]}` : ''}
      `}
    >
      <div className='card-body p-4'>
        <h2 className='card-title border-b-2 border-slate-800'>
          {title}
          <span className='mr-0 ml-auto'>{titleIcon} </span>
        </h2>
        {/* <div className='mb-2 max-h-max'>{children}</div> */}
        {children}
      </div>
    </div>
  );
};
