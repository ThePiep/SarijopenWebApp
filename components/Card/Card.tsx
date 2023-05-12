'use client';
import { isUndefined } from 'lodash';
import Link from 'next/link';
import { IconType } from 'react-icons';
import colors from 'tailwindcss/colors';
export interface CardProps {
  title: string;
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
        <div className='card-body p-4'>
          <h2 className='card-title border-b-2 border-slate-800'>
            {title}
            <span className='mr-0 ml-auto'>{titleIcon} </span>
          </h2>
          {children}
        </div>
      </LinkWrapper>
    </div>
  );
};
