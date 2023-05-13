'use client';
import { isUndefined } from 'lodash';
import Link from 'next/link';
import { IconType } from 'react-icons';
import colors from 'tailwindcss/colors';
import { LeftMiddleRight } from './LeftMiddleRight';
export interface CardProps {
  title: string;
  afterTitle?: string;
  children?: React.ReactNode;
  color?: 'bg-pocean-50' | 'bg-porange-100' | 'bg-pgreen-100' | 'bg-pblue-100';
  titleIcon?: JSX.Element;
  href?: React.ComponentProps<typeof Link>['href'];
  className?: React.ComponentProps<'div'>['className'];
  lockHeight?: boolean;
}

interface LinkWrapperProps {
  href?: CardProps['href'];
  children: JSX.Element;
}
const LinkWrapper = ({ href, children }: LinkWrapperProps): JSX.Element => {
  return isUndefined(href) ? children : <Link href={href}>{children}</Link>;
};

export const Card = ({
  children,
  title,
  afterTitle,
  titleIcon,
  href,
  color,
  className,
  lockHeight = true,
}: CardProps) => {
  return (
    <div
      className={`card rounded-md border-gray-500 border-2 border-b-5 border-r-5 
      ${lockHeight ? 'h-44' : ''} overflow-hidden
      ${className}
      ${color ?? 'bg-porange-100'}
      `}
      color={colors.amber[100]}
    >
      <LinkWrapper href={href}>
        <div className='card-body p-4 '>
          <LeftMiddleRight
            className={'border-b-2 border-slate-800 items-baseline'}
            left={<div className='text-xl font-semibold'>{title}</div>}
            middle={
              afterTitle ? (
                <div className='text-xs font-medium text-gray-900'>
                  {afterTitle}
                </div>
              ) : undefined
            }
            right={<div className='text-xl'>{titleIcon}</div>}
          />
          {children}
        </div>
      </LinkWrapper>
    </div>
  );
};
